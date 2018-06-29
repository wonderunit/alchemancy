import * as paper from 'paper'
import * as PIXI from 'pixi.js'

import Util from './util'
import { Brush } from './brush/brush'
import BrushNodeFilter from './brush/brush-node-filter'
import { Cursor } from './cursor'

import LayersCollection from './layers-collection'
import Layer from './layer'

interface IStrokePoint {
  x: number
  y: number
  pressure: number
  tiltAngle: number
  tilt: number
}

interface IStrokeSettings {
  erase?: Array<number>
}

interface IStrokeState {
  isErasing?: boolean
  layerIndices?: Array<number>
  points?: Array<IStrokePoint>
  path?: paper.Path
  lastStaticIndex?: number
  lastSpacing?: number | undefined
  grainOffset?: { x: number, y: number }
// snapshot brush configuration
  size?: number
  color?: number

  nodeOpacityScale?: number
  strokeOpacityScale?: number
  layerOpacity?: number
}

export default class SketchPane {
  layerMask: PIXI.Graphics
  layerBackground: PIXI.Graphics
  layers: LayersCollection
  images = {
    brush: {} as any,
    grain: {} as any
  }
  app: PIXI.Application

  viewClientRect: ClientRect
  containerPadding: number

  efficiencyMode: boolean = false

  zoom: number
  anchor: PIXI.Point

  onStrokeBefore: (state?: IStrokeState) => {}
  onStrokeAfter: (state?: IStrokeState) => {}

  constructor (options: any = { backgroundColor: 0xffffff}) {
    this.layerMask = undefined
    this.layerBackground = undefined
    this.viewClientRect = undefined
    this.containerPadding = 50

    // callbacks
    this.onStrokeBefore = options.onStrokeBefore
    this.onStrokeAfter = options.onStrokeAfter

    this.setup(options)
    this.setImageSize(options.imageWidth, options.imageHeight)

    this.app.view.style.cursor = 'none'
  }

  static canInitialize () : boolean {
    return PIXI.utils.isWebGLSupported()
  }

  sketchPaneContainer: PIXI.Container
  layersContainer: PIXI.Container

  liveContainer: PIXI.Container
  segmentContainer: PIXI.Container
  strokeSprite: PIXI.Sprite

  alphaFilter: PIXI.filters.AlphaFilter

  offscreenContainer: PIXI.Container
  eraseMask: PIXI.Sprite
  cursor: Cursor

  setup (options: any) {
    // @popelyshev: paper typings are wrong
    paper.setup(undefined)
    ;(paper.view as any).setAutoUpdate(false)

    // HACK
    // attemping to fix the bug where the first stroke is slow
    // first run of paper.Path appeared to be slow
    // so, try initializing it here instead
    // need to benchmark this on a few machines to see if it helps
    new paper.Path()

    PIXI.settings.FILTER_RESOLUTION = 1
    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
    PIXI.settings.MIPMAP_TEXTURES = true
    PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.REPEAT
    PIXI.utils.skipHello()

    this.app = new PIXI.Application({
      // width: window.innerWidth,
      // height: window.innerHeight,

      // preserveDrawingBuffer: true,  // for toDataUrl on the webgl context

      backgroundColor: options.backgroundColor,
      // resolution: 2,
      antialias: this.efficiencyMode ? true : false,
      // powerPreference: 'high-performance'
    })

    this.app.renderer.roundPixels = false

    // this.app.renderer.transparent = true

    this.sketchPaneContainer = new PIXI.Container()
    this.sketchPaneContainer.name = 'sketchPaneContainer'

    // current layer
    this.layersContainer = new PIXI.Container()
    this.layersContainer.name = 'layersContainer'
    this.sketchPaneContainer.addChild(this.layersContainer)

    // setup an alpha filter
    this.alphaFilter = new PIXI.filters.AlphaFilter()

    // live stroke
    // - shown to user
    this.liveContainer = new PIXI.Container()
    this.liveContainer.name = 'live'

    // static stroke
    // - shown to user
    // - used as a temporary area to render before stamping to layer texture
    this.strokeSprite = new PIXI.Sprite()
    this.strokeSprite.name = 'static'

    // current segment
    // - not shown to user
    // - used as a temporary area to render before stamping to layer texture
    this.segmentContainer = new PIXI.Container()
    this.segmentContainer.name = 'segment'

    // off-screen container
    // - used for placement of grain sprites
    this.offscreenContainer = new PIXI.Container()
    this.offscreenContainer.name = 'offscreen'
    this.offscreenContainer.renderable = false
    this.layersContainer.addChild(this.offscreenContainer)

    // erase mask
    this.eraseMask = new PIXI.Sprite()
    this.eraseMask.name = 'eraseMask'

    this.cursor = new Cursor(this)
    this.sketchPaneContainer.addChild(this.cursor)

    this.app.stage.addChild(this.sketchPaneContainer)
    this.sketchPaneContainer.scale.set(1)

    this.viewClientRect = this.app.view.getBoundingClientRect()

    this.zoom = 1
  }

  width: number
  height: number

  setImageSize (width: number, height: number) {
    this.width = width
    this.height = height

    this.layerMask = new PIXI.Graphics()
      .beginFill(0x0, 1)
      .drawRect(0, 0, this.width, this.height)
      .endFill()
    this.layerMask.name = 'layerMask'
    this.layersContainer.mask = this.layerMask
    this.sketchPaneContainer.addChildAt(this.layerMask, this.sketchPaneContainer.getChildIndex(this.layersContainer) + 1)

    this.layerBackground = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, this.width, this.height)
      .endFill()
    this.layerBackground.name = 'background'
    this.sketchPaneContainer.addChildAt(this.layerBackground, 0)

    this.eraseMask.texture = PIXI.RenderTexture.create(this.width, this.height)
    this.strokeSprite.texture = PIXI.RenderTexture.create(this.width, this.height)

    this.centerContainer()

    this.layers = LayersCollection.create({
      renderer: this.app.renderer as PIXI.WebGLRenderer,
      width: this.width,
      height: this.height,
      onAdd: this.onLayersCollectionAdd.bind(this),
      onSelect: this.onLayersCollectionSelect.bind(this)
    })
  }

  onLayersCollectionAdd (index: number) {
    let layer = this.layers[index]

    // layer.sprite.texture.baseTexture.premultipliedAlpha = false

    this.layersContainer.position.set(0, 0)
    this.layersContainer.addChild(layer.container)

    this.centerContainer()
  }

  onLayersCollectionSelect (index: number) {
    this.updateLayerDepths()
  }

  updateLayerDepths () {
    for (let layer of this.layers) {
      if (layer.index === this.layers.currentIndex) {
        layer.container.addChild(this.strokeSprite)
        layer.container.addChild(this.liveContainer)
        // layer.filters = [this.alphaFilter]
      } else {
        // layer.filters = []
      }
    }
  }

  newLayer (options: any) {
    return this.layers.create(options)
  }

  centerContainer () {
    if (this.anchor) {
      // use anchor
      let point = this.localizePoint(this.anchor)

      this.sketchPaneContainer.pivot.set(point.x, point.y)
      this.sketchPaneContainer.position.set(this.anchor.x, this.anchor.y)
    } else {
      // center
      this.sketchPaneContainer.pivot.set(this.width / 2, this.height / 2)
      this.sketchPaneContainer.position.set(
        Math.floor(this.app.renderer.width / 2),
        Math.floor(this.app.renderer.height / 2)
      )
    }
  }

  // resizeToParent () {
  //   this.resizeToElement(this.app.view.parentElement)
  // }
  //
  // resizeToElement (element) {
  //   const { width, height } = element.getBoundingClientRect()
  //   this.resize(width, height)
  // }

  resize (width: number, height: number) {
    // resize the canvas to fit the parent bounds
    this.app.renderer.resize(width, height)

    // copy the canvas dimensions rectangle value
    // min size of 0×0 to prevent flip
    let dst = {
      width: Math.max(0, width - (this.containerPadding * 2)),
      height: Math.max(0, height - (this.containerPadding * 2))
    }

    // src is image width / height
    const src = {
      width: this.width,
      height: this.height
    }

    // fit to aspect ratio
    const frameAr = dst.width / dst.height
    const imageAr = src.width / src.height

    let targetWidth = (frameAr > imageAr)
      ? src.width * dst.height / src.height
      : dst.width

    // center
    this.centerContainer()

    // set scale
    this.sketchPaneContainer.scale.set(
      (Math.floor(targetWidth) / Math.floor(src.width)) * this.zoom
    )

    // update viewClientRect
    this.viewClientRect = this.app.view.getBoundingClientRect()
  }

  brushes: Record<string, Brush>

  // per http://www.html5gamedevs.com/topic/29327-guide-to-pixi-v4-filters/
  // for each brush, add a sprite with the brush and grain images, so we can get the actual transformation matrix for those image textures
  async loadBrushes (params: { brushes: Array<any>, brushImagePath: string }) {
    let {brushes, brushImagePath} = params
    this.brushes = brushes.reduce((brushes: Array<any>, brush: any) => {
      brushes[brush.name] = new Brush(brush)
      return brushes
    }, {})

    // get unique file names
    let brushImageNames = Array.from(
      // unique
      new Set(
        // flatten
        [].concat(
          ...Object.values(this.brushes)
            .map(b => 
              [b.settings.brushImage, b.settings.efficiencyBrushImage]
            )
        // skip undefined
        ).filter(Boolean)
      )
    )
    let grainImageNames = Array.from(new Set(Object.values(this.brushes).map(b => b.settings.grainImage)))

    let promises: Array<Promise<any>> = []
    for (let [names, dict] of [[brushImageNames, this.images.brush], [grainImageNames, this.images.grain]]) {
      for (let name of names) {
        let sprite = PIXI.Sprite.fromImage(`${brushImagePath}/${name}.png`)
        sprite.renderable = false

        dict[name] = sprite

        let texture = sprite.texture.baseTexture
        if (texture.hasLoaded) {
          promises.push(Promise.resolve(sprite))
        } else if (texture.isLoading) {
          promises.push(
            new Promise((resolve, reject) => {
              texture.on('loaded', (baseTexture: PIXI.BaseTexture) => {
                resolve(texture)
              })
              texture.on('error', (baseTexture: PIXI.BaseTexture) => {
                reject(new Error(`Could not load brush from file: ${name}.png`))
              })
            })
          )
        } else {
          promises.push(Promise.reject(new Error(`Failed to load brush from file: ${name}.png`)))
        }
      }
    }
    await Promise.all(promises)

    this.cursor.updateSize()
  }

  // stamp = don't clear texture
  stampStroke (source: any, layer: Layer) {
    layer.draw(source, false)
  }

  disposeContainer (container: PIXI.Container) {
    for (let child of container.children) {
      (child as PIXI.Container).destroy({
        children: true,

        // because we re-use the brush texture
        texture: false,
        baseTexture: false
      })
    }
    container.removeChildren()
  }

  addStrokeNode (
    r: number,
    g: number,
    b: number,
    size: number,
    nodeOpacityScale: number,
    x: number,
    y: number,
    pressure: number,
    angle: number,
    tilt: number,
    brush: Brush,
    grainOffsetX: number,
    grainOffsetY: number,
    container: PIXI.Container
  ) {
    //
    //
    // brush params
    //
    let nodeSize = size - (1 - pressure) * size * brush.settings.pressureSize
    let tiltSizeMultiple = (((tilt / 90.0) * brush.settings.tiltSize) * 3) + 1
    nodeSize *= tiltSizeMultiple
    // nodeSize = this.brushSize

    let nodeOpacity = 1 - (1 - pressure) * brush.settings.pressureOpacity
    let tiltOpacity = 1 - tilt / 90.0 * brush.settings.tiltOpacity
    nodeOpacity *= tiltOpacity * nodeOpacityScale

    let nodeRotation: number
    if (brush.settings.azimuth) {
      nodeRotation = angle * Math.PI / 180.0 - this.sketchPaneContainer.rotation
    } else {
      nodeRotation = 0 - this.sketchPaneContainer.rotation
    }
    
    let uBleed = Math.pow(1 - pressure, 1.6) * brush.settings.pressureBleed

    //
    //
    // brush node drawing
    //
    if (this.efficiencyMode) {
      // brush node with a single sprite

      // eslint-disable-next-line new-cap
      let sprite = new PIXI.Sprite(
        this.images.brush[brush.settings.efficiencyBrushImage].texture
      )

      // let iS = Math.ceil(spriteSize)
      // x -= iS / 2
      // y -= iS / 2
      // sprite.x = Math.floor(x)
      // sprite.y = Math.floor(y)
      // sprite.width = iS
      // sprite.height = iS
      // 
      // let dX = x - sprite.x
      // let dY = y - sprite.y
      // let dS = nodeSize / sprite.width
      // 
      // let oXY = [dX, dY]
      // let oS = [dS, dS]

      // position
      sprite.position.set(x, y)

      // centering
      sprite.anchor.set(0.5)

      // color
      sprite.tint = PIXI.utils.rgb2hex([r, g, b])

      // opacity
      sprite.alpha = nodeOpacity

      // rotation
      // TODO

      // bleed
      // TODO

      // scale
      sprite.scale.set(nodeSize / sprite.width)

      container.addChild(sprite)

    } else {
      // brush node with shaders

      // eslint-disable-next-line new-cap
      let sprite = new PIXI.Sprite(
        this.images.brush[brush.settings.brushImage].texture
      )

      // sprite must fit a texture rotated by up to 45 degrees
      let rad = Math.PI * 45 / 180 // extreme angle in radians
      let spriteSize = Math.abs(nodeSize * Math.sin(rad)) + Math.abs(nodeSize * Math.cos(rad))

      // the brush node
      // is larger than the texture size
      // because, although the x,y coordinates must be integers,
      //   we still want to draw sub-pixels,
      //     so we pad 1px
      //       allowing us to draw a on positive x, y offset
      // and, although, the dimensions must be integers,
      //   we want to have a sub-pixel texture size,
      //     so we sometimes make the node larger than necessary
      //       and scale the texture down to correct
      // to allow us to draw a rotated texture,
      //   we increase the size to accommodate for up to 45 degrees of rotation
      let iS = Math.ceil(spriteSize)
      x -= iS / 2
      y -= iS / 2
      sprite.x = Math.floor(x)
      sprite.y = Math.floor(y)
      sprite.width = iS
      sprite.height = iS

      let dX = x - sprite.x
      let dY = y - sprite.y
      let dS = nodeSize / sprite.width

      let oXY = [dX, dY]
      let oS = [dS, dS]

      // filter setup
      //
      // TODO can we avoid creating a new grain sprite for each render?
      //      used for rendering grain filter texture at correct position
      let grainSprite = this.images.grain[brush.settings.grainImage]
      this.offscreenContainer.addChild(grainSprite)
      // hacky fix to calculate vFilterCoord properly
      this.offscreenContainer.getLocalBounds()
      let filter = new BrushNodeFilter(grainSprite)

      filter.uniforms.uRed = r
      filter.uniforms.uGreen = g
      filter.uniforms.uBlue = b
      filter.uniforms.uOpacity = nodeOpacity

      filter.uniforms.uRotation = nodeRotation

      filter.uniforms.uBleed = uBleed

      filter.uniforms.uGrainScale = brush.settings.scale

      // DEPRECATED
      filter.uniforms.uGrainRotation = brush.settings.rotation

      filter.uniforms.u_x_offset = grainOffsetX * brush.settings.movement
      filter.uniforms.u_y_offset = grainOffsetY * brush.settings.movement

      // subpixel offset
      filter.uniforms.u_offset_px = oXY // TODO multiply by app.stage.scale if zoomed
      // console.log('iX', iX, 'iY', iY, 'u_offset_px', oXY)
      // subpixel scale AND padding AND rotation accomdation
      filter.uniforms.u_node_scale = oS // desired scale
      filter.padding = 1 // for filterClamp

      sprite.filters = [filter]
      // via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#bleeding-problem
      // @popelyshev this property is for Sprite, not for filter. Thans to TypeScript!
      // @popelyshev at the same time, the fix only makes it worse :(
      // sprite.filterArea = this.app.screen

      container.addChild(sprite)
    }
  }

  pointerDown = false

  down (e: PointerEvent, options = {}) {
    this.pointerDown = true
    this.strokeBegin(e, options)

    this.app.view.style.cursor = 'none'
    this.cursor.renderCursor(e)
  }

  move (e: PointerEvent) {
    if (this.pointerDown) {
      this.strokeContinue(e)
    }

    this.app.view.style.cursor = 'none'
    this.cursor.renderCursor(e)
  }

  up (e: PointerEvent) {
    if (this.pointerDown) {
      this.strokeEnd(e)
    }

    this.app.view.style.cursor = 'none'
    this.cursor.renderCursor(e)
  }

  strokeState: IStrokeState
  brushColor: number
  nodeOpacityScale: number
  strokeOpacityScale: number
  brush: Brush

  strokeBegin (e: PointerEvent, options: IStrokeSettings) {
    // initialize stroke state
    this.strokeState = {
      isErasing: !!options.erase,
      // which layers will be stamped / dirtied by this stroke?
      layerIndices: options.erase
        ? options.erase // array of layers which will be erased
        : [this.layers.currentIndex], // single layer dirtied
      points: [] as any,
      path: new paper.Path(),
      lastStaticIndex: 0,
      lastSpacing: undefined,
      grainOffset: this.brush.settings.randomOffset
        ? {x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100)}
        : {x: 0, y: 0},

      // snapshot brush configuration
      size: this.brushSize,
      color: this.brushColor,

      nodeOpacityScale: this.nodeOpacityScale,
      strokeOpacityScale: this.strokeOpacityScale,
      layerOpacity: this.getLayerOpacity(this.layers.currentIndex)
    }

    this.onStrokeBefore && this.onStrokeBefore(this.strokeState)

    this.addPointerEventAsPoint(e)

    // don't show the live container or stroke sprite while erasing
    if (this.strokeState.isErasing) {
      if (this.liveContainer.parent) {
        this.liveContainer.parent.removeChild(this.liveContainer)
      }
      if (this.strokeSprite.parent) {
        this.strokeSprite.parent.removeChild(this.strokeSprite)
      }
    } else {
      // NOTE
      // at beginning of stroke, sets liveContainer.alpha
      // move this code to `drawStroke` if layer opacity can ever change _during_ the stroke
      this.liveContainer.alpha = this.strokeState.layerOpacity * 
        // because shaders are not composited with alpha on the live container,
        // we fake the effect of stroke opacity on the live shaders, which build up in intensity.
        // this exp value is just tweaked by eye
        // in the future we could relate the exp to the spacing value for better results
        Math.pow(this.strokeState.strokeOpacityScale, 5)

      this.strokeSprite.alpha = this.strokeState.strokeOpacityScale

      // switch from sprite alpha to alpha filter
      this.setLayerOpacity(this.layers.currentIndex, 1)
      this.alphaFilter.alpha = this.strokeState.layerOpacity
      this.layers[this.layers.currentIndex].container.filters = [this.alphaFilter]
      this.updateLayerDepths()
    }

    this.drawStroke()
  }

  strokeContinue (e: PointerEvent) {
    this.addPointerEventAsPoint(e)
    this.drawStroke()
  }

  strokeEnd (e: PointerEvent) {
    this.addPointerEventAsPoint(e)
    this.stopDrawing()
  }

  // public
  stopDrawing () {
    this.drawStroke(true) // finalize

    this.layers.markDirty(this.strokeState.layerIndices)

    // switch from alpha filter back to sprite alpha
    this.setLayerOpacity(this.layers.currentIndex, this.strokeState.layerOpacity)
    this.layers[this.layers.currentIndex].container.filters = []
    this.updateLayerDepths()

    this.pointerDown = false

    this.onStrokeAfter && this.onStrokeAfter(this.strokeState)
  }

  getInterpolatedStrokeInput (strokeInput: Array<IStrokePoint>, path: paper.Path) {
    let interpolatedStrokeInput: Array<Array<any>> = []

    // get lookups for each segment so we know how to interpolate

    // for every segment,
    //  find the segments's location on the path,
    //  and find the offset
    //    where 'offset' means the length from
    //    the beginning of the path
    //    up to the segment's location
    let segmentLookup: Array<number> = []

    // console.log(path.length)

    for (let i = 0; i < path.segments.length; i++) {
      if (path.segments[i].location) {
        segmentLookup.push(path.segments[i].location.offset)
      }
    }

    // console.log(segmentLookup)

    let currentSegment = 0

    // let nodeSize = this.brushSize - ((1-pressure)*this.brushSize*brush.settings.pressureSize)

    let spacing = Math.max(1, this.strokeState.size * 
      (this.efficiencyMode
        ? this.brush.settings.efficiencySpacing
        : this.brush.settings.spacing)
    )

    // console.log(spacing)

    if (this.strokeState.lastSpacing == null) this.strokeState.lastSpacing = spacing
    let start = (spacing - this.strokeState.lastSpacing)
    let len = path.length
    let i = 0
    // default. pushes along in-between spacing when spacing - this.strokeState.lastSpacing is > path.length
    let k = len + -(this.strokeState.lastSpacing + len)

    let singlePoint = false
    if (len === 0) {
      // single point
      start = 0
      len = spacing
      singlePoint = true
    }
    for (i = start; i < len; i += spacing) {
      let point = path.getPointAt(i)

      for (let z = currentSegment; z < segmentLookup.length; z++) {
        if (segmentLookup[z] < i) {
          currentSegment = z
          // @popelyshev : Why continue?
          continue
        }
      }

      let pressure: number
      let tiltAngle: number
      let tilt: number

      if (singlePoint) {
        pressure = strokeInput[currentSegment].pressure
        tiltAngle = strokeInput[currentSegment].tiltAngle
        tilt = strokeInput[currentSegment].tilt
      } else {
        let segmentPercent =
          (i - segmentLookup[currentSegment]) /
          (segmentLookup[currentSegment + 1] - segmentLookup[currentSegment])

        pressure = Util.lerp(
          strokeInput[currentSegment].pressure,
          strokeInput[currentSegment + 1].pressure,
          segmentPercent
        )
        tiltAngle = Util.lerp(
          strokeInput[currentSegment].tiltAngle,
          strokeInput[currentSegment + 1].tiltAngle,
          segmentPercent
        )
        tilt = Util.lerp(
          strokeInput[currentSegment].tilt,
          strokeInput[currentSegment + 1].tilt,
          segmentPercent
        )
      }

      interpolatedStrokeInput.push([
        this.strokeState.isErasing ? 0 : ((this.strokeState.color >> 16) & 255) / 255,
        this.strokeState.isErasing ? 0 : ((this.strokeState.color >> 8) & 255) / 255,
        this.strokeState.isErasing ? 0 : (this.strokeState.color & 255) / 255,
        this.strokeState.size,
        this.strokeState.nodeOpacityScale,
        point.x,
        point.y,
        pressure,
        tiltAngle,
        tilt,
        this.brush,
        this.strokeState.grainOffset.x,
        this.strokeState.grainOffset.y
      ])
      k = i
    }
    this.strokeState.lastSpacing = len - k

    return interpolatedStrokeInput
  }

  addStrokeNodes (strokeInput: Array<IStrokePoint>, path: paper.Path, container: PIXI.Container) {
    // we have 2+ StrokeInput points (with x, y, pressure, etc),
    // and 2+ matching path segments (with location and handles)
    //  e.g.: strokeInput[0].x === path.segments[0].point.x
    let interpolatedStrokeInput = this.getInterpolatedStrokeInput(strokeInput, path)

    for (let args of interpolatedStrokeInput) {
      ;(this.addStrokeNode as any)(...args, container)
    }
  }

  // public
  localizePoint (point: {x: number, y: number}) {
    return this.sketchPaneContainer.toLocal(new PIXI.Point(
      point.x - this.viewClientRect.left,
      point.y - this.viewClientRect.top
    ),
    this.app.stage)
  }

  addPointerEventAsPoint (e: PointerEvent) {
    let corrected = this.localizePoint(e)

    let pressure = e.pointerType === 'mouse'
      ? e.pressure > 0 ? 0.5 : 0
      : e.pressure

    let tiltAngle = e.pointerType === 'mouse'
      ? {angle: -90, tilt: 37}
      : Util.calcTiltAngle(e.tiltY, e.tiltX) // NOTE we intentionally reverse these args

    this.strokeState.points.push({
      x: corrected.x,
      y: corrected.y,
      pressure: pressure,
      tiltAngle: tiltAngle.angle,
      tilt: tiltAngle.tilt
    })

    // we added a new point, so decrement lastStaticIndex
    this.strokeState.lastStaticIndex = Math.max(0, this.strokeState.lastStaticIndex - 1)

    // only keep track of input that hasn't been rendered static yet
    this.strokeState.points = this.strokeState.points.slice(
      Math.max(0, this.strokeState.lastStaticIndex - 1),
      this.strokeState.points.length
    )
    this.strokeState.path = new paper.Path(
      this.strokeState.points
    )
    // only smooth if we have more than 1 point
    // resulting in a slight performance improvement for initial `down` event
    if (this.strokeState.points.length > 1) {
      // @popelyshev: paper typings are wrong
      ;(this.strokeState.path.smooth as any)({type: 'catmull-rom', factor: 0.5}) // centripetal
    }
  }

  // render the live strokes
  // TODO instead of slices, could pass offset and length?
  drawStroke (finalize = false) {
    let len = this.strokeState.points.length

    // finalize
    // draws all remaining points we know of
    // called on up
    // useful for drawing a dot for only two points
    //   e.g.: on quick up/down press with no move
    if (finalize) {
      // the index of the last static point we drew
      let a = this.strokeState.lastStaticIndex
      // the last point we know of
      let b = this.strokeState.points.length - 1

      // console.log(
      //   '\n',
      //   'rendering to texture.\n',
      //   len, 'points in the array.\n',
      //   // this.strokeState.points, '\n',
      //   'drawing stroke from point idx', a,
      //   'to point idx', b, '\n'
      // )
      
      
      // TODO refactor / DRY with similar code below
      //
      // add the last segment
      this.addStrokeNodes(
        this.strokeState.points.slice(a, b + 1),
        new paper.Path(this.strokeState.path.segments.slice(a, b + 1)),
        this.segmentContainer
      )
      this.app.renderer.render(
        this.segmentContainer,
        this.strokeSprite.texture as PIXI.RenderTexture,
        false
      )

      // stamp
      if (this.strokeState.isErasing) {
        // stamp to erase texture
        this.updateMask(this.segmentContainer, true)
      } else {
        // stamp to layer texture
        this.stampStroke(
          this.strokeSprite,
          this.layers.getCurrentLayer()
        )
      }
      this.disposeContainer(this.segmentContainer)
      this.offscreenContainer.removeChildren()

      // clear any sprites from live or stroke
      this.disposeContainer(this.liveContainer)
      this.disposeContainer(this.strokeSprite)
      // clear the strokeSprite texture
      this.app.renderer.render(
        new PIXI.Sprite(PIXI.Texture.EMPTY),
        this.strokeSprite.texture as PIXI.RenderTexture,
        true
      )
      this.offscreenContainer.removeChildren()

      return
    }

    // static
    // do we have enough points to render a static stroke to the texture?
    if (len >= 3) {
      let last = this.strokeState.points.length - 1
      let a = last - 2
      let b = last - 1

      // draw to the segment container
      this.addStrokeNodes(
        this.strokeState.points.slice(a, b + 1),
        new paper.Path(this.strokeState.path.segments.slice(a, b + 1)),
        this.segmentContainer
      )

      // stamp
      if (this.strokeState.isErasing) {
        // stamp to the erase texture
        this.updateMask(this.segmentContainer)
      } else {
        // render to stroke texture
        this.app.renderer.render(
          this.segmentContainer,
          this.strokeSprite.texture as PIXI.RenderTexture,
          false
        )
      }
      this.disposeContainer(this.segmentContainer)
      this.offscreenContainer.removeChildren()

      this.strokeState.lastStaticIndex = b
    }

    // live
    // do we have enough points to draw a live stroke to the container?
    if (len >= 2) {
      this.disposeContainer(this.liveContainer)

      let last = this.strokeState.points.length - 1
      let a = last - 1
      let b = last

      // render the current stroke live
      if (this.strokeState.isErasing) {
        // TODO find a good way to add live strokes to erase mask
        // this.updateMask(this.liveContainer)
      } else {
        // store the current spacing
        let tmpLastSpacing = this.strokeState.lastSpacing
        // draw a live stroke
        this.addStrokeNodes(
          this.strokeState.points.slice(a, b + 1),
          new paper.Path(this.strokeState.path.segments.slice(a, b + 1)),
          this.liveContainer
        )
        // revert the spacing so the real stroke will be correct
        this.strokeState.lastSpacing = tmpLastSpacing
      }
    }
  }

  updateMask (source: any, finalize = false) {
    // find the top-most active layer
    const descending = (a: number, b: number) => b - a
    let layer = this.strokeState.layerIndices
      .map(i => this.layers[i])
      .sort(
        (a, b) => descending(
          a.sprite.parent.getChildIndex(a.sprite),
          b.sprite.parent.getChildIndex(b.sprite)
        )
      )[0]

    // TODO move this to an initialize step
    // starting a new round
    if (!layer.sprite.mask) {
      // add the mask on top of all layers
      this.layersContainer.addChild(this.eraseMask)

      // reset the mask with a solid red background
      let graphics = new PIXI.Graphics()
        .beginFill(0xff0000, 1.0)
        .drawRect(0, 0, this.width, this.height)
        .endFill()
      this.app.renderer.render(
        graphics,
        this.eraseMask.texture as PIXI.RenderTexture,
        true
      )

      // use the mask
      for (let i of this.strokeState.layerIndices) {
        let layer = this.layers[i]
        layer.sprite.mask = this.eraseMask
      }
    }

    // render the white strokes onto the red filled erase mask texture
    this.app.renderer.render(
      source,
      this.eraseMask.texture as PIXI.RenderTexture,
      false
    )

    // if finalizing,
    if (finalize) {
      for (let i of this.strokeState.layerIndices) {
        // apply the erase texture to the actual layer texture
        let layer = this.layers[i]
        // add child so transform is correct
        layer.sprite.addChild(this.eraseMask)
        layer.sprite.mask = this.eraseMask
        // stamp mask'd version of layer sprite to its own texture
        this.layers[i].rewrite()
        // cleanup
        layer.sprite.mask = null
        layer.sprite.removeChild(this.eraseMask)
      }

      // TODO GC the eraseMask texture?
    }
  }

  // TODO handle crop / center
  // TODO mark dirty?
  replaceLayer (index: number, source: any, clear = true) {
    index = (index == null) ? this.layers.getCurrentIndex() : index

    this.layers[index].replace(source, clear)
  }

  // DEPRECATED
  getLayerCanvas (index: number) {
    console.warn('SketchPane#getLayerCanvas is deprecated. Please fix the caller to use a different method.')
    console.trace()
    index = (index == null) ? this.layers.getCurrentIndex() : index

    // #canvas reads the raw pixels and converts to an HTMLCanvasElement
    // see: http://pixijs.download/release/docs/PIXI.extract.WebGLExtract.html
    return this.app.renderer.plugins.extract.canvas(this.layers[index].sprite.texture)
  }

  exportLayer (index: number, format = 'base64') {
    index = (index == null) ? this.layers.getCurrentIndex() : index

    return this.layers[index].export(format)
  }

  extractThumbnailPixels (width: number, height: number, indices : Array<number> = []) {
    return this.layers.extractThumbnailPixels(width, height, indices)
  }

  clearLayer (index: number) {
    index = (index == null) ? this.layers.getCurrentIndex() : index

    this.layers[index].clear()
  }

  getNumLayers () {
    return this.layers.length - 1
  }

  // get current layer
  getCurrentLayerIndex (index: number) {
    return this.layers.getCurrentIndex()
  }

  // set layer by index (0-indexed)
  setCurrentLayerIndex (index: number) {
    if (this.pointerDown) return // prevent layer change during draw

    this.layers.setCurrentIndex(index)
  }

  _brushSize: number

  // TODO setState instead?
  set brushSize (value) {
    this._brushSize = value
    this.cursor.updateSize()
  }

  get brushSize () {
    return this._brushSize
  }

  isDrawing () {
    return this.pointerDown
  }

  // getIsErasing () {
  //   return this.isErasing
  // }
  //
  // setIsErasing (value) {
  //   if (this.pointerDown) return // prevent erase mode change during draw
  //
  //   this.isErasing = value
  // }
  //
  // setErasableLayers (indices) {
  //   this.layers.setActiveIndices(indices)
  // }

  getLayerOpacity (index: number) {
    return this.layers[index].getOpacity()
  }

  setLayerOpacity (index: number, opacity: number) {
    this.layers[index].setOpacity(opacity)
  }

  markLayersDirty (indices: Array<number>) {
    return this.layers.markDirty(indices)
  }

  clearLayerDirty (index: number) {
    this.layers[index].setDirty(false)
  }

  getLayerDirty (index: number) {
    return this.layers[index].getDirty()
  }

  isLayerEmpty (index: number) {
    return this.layers[index].isEmpty()
  }

  // getActiveLayerIndices () {
  //   return this.layers.getActiveIndices()
  // }

  getDOMElement () {
    return this.app.view
  }

  //
  // operations
  //
  //
  flipLayers (vertical = false) {
    this.layers.flip(vertical)
  }
}
