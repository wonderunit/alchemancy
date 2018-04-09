const PIXI = require('pixi.js')
const paper = require('paper')

const Util = require('./util')
const brushes = require('./brush/brushes')
const BrushNodeFilter = require('./brush/brush-node-filter')

module.exports = class SketchPane {
  constructor () {
    this.layers = []
    this.layerMask = undefined
    this.layerBackground = undefined

    this.images = {
      brush: {},
      grain: {}
    }

    this.isErasing = false
    this.erasableLayers = []

    this.brushes = brushes

    this.viewportRect = undefined

    this.setup()
  }

  setup () {
    paper.setup()
    PIXI.settings.FILTER_RESOLUTION = 1
    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
    PIXI.settings.MIPMAP_TEXTURES = true
    PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.REPEAT
    PIXI.utils.skipHello()

    this.app = new PIXI.Application({
      // width: window.innerWidth,
      // height: window.innerHeight,

      // antialias: false,

      // preserveDrawingBuffer: true,  // for toDataUrl on the webgl context

      transparent: true,
      // resolution: 2,
      antialias: false
      // powerPreference: 'high-performance'
    })

    this.app.renderer.roundPixels = false

    // this.app.renderer.transparent = true

    this.sketchpaneContainer = new PIXI.Container()
    this.sketchpaneContainer.name = 'sketchpaneContainer'

    // layer
    this.layerContainer = new PIXI.Container()
    this.layerContainer.name = 'layerContainer'
    this.sketchpaneContainer.addChild(this.layerContainer)

    // static stroke
    // - not shown to user
    // - used only as a temporary area to setup for texture rendering
    this.strokeContainer = new PIXI.Container()
    this.strokeContainer.name = 'static'

    // live stroke
    // - shown to user
    this.liveStrokeContainer = new PIXI.Container()
    this.liveStrokeContainer.name = 'live'
    this.layerContainer.addChild(this.liveStrokeContainer)

    // off-screen container
    // - used for placement of grain sprites
    this.offscreenContainer = new PIXI.Container()
    this.offscreenContainer.name = 'offscreen'
    this.offscreenContainer.renderable = false
    this.layerContainer.addChild(this.offscreenContainer)

    // erase mask
    this.eraseMask = new PIXI.Sprite()
    this.eraseMask.name = 'eraseMask'

    this.app.stage.addChild(this.sketchpaneContainer)
    this.sketchpaneContainer.scale.set(1)

    this.counter = 0

    this.strokeInput = []
    this.strokePath = undefined
    this.lastStaticIndex = 0
    this.strokeGrainOffset = { x: 0, y: 0 }
  }

  setImageSize (width, height) {
    this.width = width
    this.height = height

    this.layerMask = new PIXI.Graphics()
      .beginFill(0x0, 1)
      .drawRect(0, 0, this.width, this.height)
      .endFill()
    this.layerMask.name = 'layerMask'
    this.layerContainer.mask = this.layerMask
    this.sketchpaneContainer.addChild(this.layerMask)

    this.layerBackground = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, this.width, this.height)
      .endFill()
    this.layerBackground.name = 'background'
    this.layerContainer.addChild(this.layerBackground)

    this.eraseMask.texture = PIXI.RenderTexture.create(this.width, this.height)

    this.centerContainer()
  }

  newLayer () {
    let index = this.layers.length

    let layer = {
      index,
      name: `Layer ${index + 1}`,
      sprite: new PIXI.Sprite(PIXI.RenderTexture.create(this.width, this.height))
    }
    layer.sprite.name = layer.name

    this.layerContainer.position.set(0, 0)
    // layer.sprite.texture.baseTexture.premultipliedAlpha = false
    this.layerContainer.addChild(layer.sprite)
    this.centerContainer()

    this.layers[index] = layer

    return this.layers[index]
  }

  newLayerFrom (image) {
    // TODO handle crop / center
    this.renderToLayer(
      new PIXI.Sprite.from(image), // eslint-disable-line new-cap
      this.newLayer()
    )
  }

  centerContainer () {
    this.sketchpaneContainer.pivot.set(this.width / 2, this.height / 2)
    this.sketchpaneContainer.position.set(
      Math.floor(this.app.renderer.width / 2),
      Math.floor(this.app.renderer.height / 2)
    )
  }

  // resizeToParent () {
  //   this.resizeToElement(this.app.view.parentElement)
  // }
  //
  // resizeToElement (element) {
  //   const { width, height } = element.getBoundingClientRect()
  //   this.resize(width, height)
  // }

  resize (width, height) {
    this.app.renderer.resize(width, height)

    // fit aspect ratio, set scale
    const frameAspectRatio = width / height
    const imageAspectRatio = this.width / this.height
    let dim = (frameAspectRatio > imageAspectRatio)
      ? [this.width * height / this.height, height]
      : [width, this.height * width / this.width]
    let scale = dim[0] / this.width
    this.sketchpaneContainer.scale.set(scale)

    this.sketchpaneContainer.position.set(
      Math.floor(this.app.renderer.width / 2),
      Math.floor(this.app.renderer.height / 2)
    )

    this.viewportRect = this.app.view.getBoundingClientRect()
  }

  // per http://www.html5gamedevs.com/topic/29327-guide-to-pixi-v4-filters/
  // for each brush, add a sprite with the brush and grain images, so we can get the actual transformation matrix for those image textures
  async loadBrushes ({ brushImagePath }) {
    // get unique file names
    let brushImageNames = [...new Set(Object.values(this.brushes).map(b => b.settings.brushImage))]
    let grainImageNames = [...new Set(Object.values(this.brushes).map(b => b.settings.grainImage))]

    let promises = []
    for (let [names, dict] of [[ brushImageNames, this.images.brush ], [ grainImageNames, this.images.grain ]]) {
      for (let name of names) {
        let sprite = PIXI.Sprite.fromImage(`${brushImagePath}/${name}.png`)
        sprite.renderable = false

        dict[name] = sprite

        let texture = sprite._texture.baseTexture
        if (texture.hasLoaded) {
          promises.push(Promise.resolve(sprite))
        } else if (texture.isLoading) {
          promises.push(
            new Promise((resolve, reject) => {
              texture.on('loaded', result => resolve(texture))
              texture.on('error', err => reject(err))
            })
          )
        } else {
          promises.push(Promise.reject(new Error()))
        }
      }
    }
    await Promise.all(promises)

    this.setDefaultBrush()
  }

  // set default brush
  setDefaultBrush () {
    this.brush = this.brushes.pencil
    this.brushColor = { r: 0, g: 0, b: 0 }
    this.brushSize = 4
    this.brushOpacity = 0.9
  }

  renderToLayer (source, layer, clear = undefined) {
    this.app.renderer.render(
      source,
      layer.sprite.texture,
      clear
    )
  }

  // for clarity. never clears texture when rendering.
  stampStroke (source, layer) {
    this.renderToLayer(source, layer, false)
  }

  disposeContainer (container) {
    for (let child of container.children) {
      child.destroy({
        children: true,

        // because we re-use the brush texture
        texture: false,
        baseTexture: false
      })
    }
    container.removeChildren()
  }

  addStrokeNode (
    r,
    g,
    b,
    size,
    opacity,
    x,
    y,
    pressure,
    angle,
    tilt,
    brush,
    grainOffsetX,
    grainOffsetY,
    strokeContainer
  ) {
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

    // eslint-disable-next-line new-cap
    let sprite = new PIXI.Sprite.from(
      this.images.brush[brush.settings.brushImage].texture
    )

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
    nodeOpacity *= tiltOpacity * opacity

    let nodeRotation
    if (brush.settings.azimuth) {
      nodeRotation = angle * Math.PI / 180.0 - this.sketchpaneContainer.rotation
    } else {
      nodeRotation = 0 - this.sketchpaneContainer.rotation
    }

    //
    //
    // sprite setup
    //
    // sprite must fit a texture rotated by up to 45 degrees
    let rad = Math.PI * 45 / 180 // extreme angle in radians
    let spriteSize = Math.abs(nodeSize * Math.sin(rad)) + Math.abs(nodeSize * Math.cos(rad))

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

    //
    //
    // filter setup
    //
    // TODO can we avoid creating a new grain sprite for each render?
    //      used for rendering grain filter texture at correct position
    let grainSprite = this.images.grain[brush.settings.grainImage]
    this.offscreenContainer.addChild(grainSprite)
    // hacky fix to calculate vFilterCoord properly
    this.offscreenContainer.getLocalBounds()
    let filter = new BrushNodeFilter(grainSprite)

    // via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#bleeding-problem
    filter.filterArea = this.app.screen

    filter.uniforms.uRed = r
    filter.uniforms.uGreen = g
    filter.uniforms.uBlue = b
    filter.uniforms.uOpacity = nodeOpacity

    filter.uniforms.uRotation = nodeRotation

    filter.uniforms.uBleed =
      Math.pow(1 - pressure, 1.6) * brush.settings.pressureBleed

    filter.uniforms.uGrainScale = brush.settings.scale

    //
    //
    // DEPRECATED
    //
    filter.uniforms.uGrainRotation = brush.settings.rotation
    //
    //
    //

    filter.uniforms.u_x_offset = grainOffsetX * brush.settings.movement
    filter.uniforms.u_y_offset = grainOffsetY * brush.settings.movement

    // subpixel offset
    filter.uniforms.u_offset_px = oXY // TODO multiply by app.stage.scale if zoomed
    // console.log('iX', iX, 'iY', iY, 'u_offset_px', oXY)
    // subpixel scale AND padding AND rotation accomdation
    filter.uniforms.u_node_scale = oS // desired scale
    filter.padding = 1 // for filterClamp

    sprite.filters = [filter]

    strokeContainer.addChild(sprite)
  }

  down (e) {
    this.pointerDown = true

    this.strokeInput = []
    this.strokePath = new paper.Path()
    this.lastStaticIndex = 0
    this.lastSpacing = undefined
    this.strokeGrainOffset = this.brush.settings.randomOffset
      ? { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) }
      : { x: 0, y: 0 }

    if (e.target === this.app.view) {
      this.addPointerEventAsPoint(e)

      if (this.isErasing) {
        if (this.liveStrokeContainer.parent) {
          this.liveStrokeContainer.parent.removeChild(this.liveStrokeContainer)
        }
      } else {
        this.layerContainer.addChild(this.liveStrokeContainer)
      }

      this.renderLive()

      this.app.view.style.cursor = 'crosshair'
    }
  }

  move (e) {
    // to prevent off-canvas move events:
    // if (e.target !== this.app.view) return

    if (this.pointerDown) {
      this.addPointerEventAsPoint(e)
      this.renderLive()
      this.app.view.style.cursor = 'crosshair'
    }
  }

  up (e) {
    if (e.target === this.app.view) {
      if (this.pointerDown) {
        this.addPointerEventAsPoint(e)

        this.layerContainer.addChild(this.liveStrokeContainer)

        this.renderLive(true) // forceRender

        this.disposeContainer(this.liveStrokeContainer)
        this.offscreenContainer.removeChildren()
      }
    }

    this.pointerDown = false
    this.app.view.style.cursor = 'auto'
  }

  getInterpolatedStrokeInput (strokeInput, path) {
    let interpolatedStrokeInput = []

    // get lookups for each segment so we know how to interpolate

    // for every segment,
    //  find the segments's location on the path,
    //  and find the offset
    //    where 'offset' means the length from
    //    the beginning of the path
    //    up to the segment's location
    let segmentLookup = []

    // console.log(path.length)

    for (let i = 0; i < path.segments.length; i++) {
      if (path.segments[i].location) {
        segmentLookup.push(path.segments[i].location.offset)
      }
    }

    // console.log(segmentLookup)

    let currentSegment = 0

    // let nodeSize = this.brushSize - ((1-pressure)*this.brushSize*brush.settings.pressureSize)

    let spacing = Math.max(1, this.brushSize * this.brush.settings.spacing)

    // console.log(spacing)

    if (this.lastSpacing == null) this.lastSpacing = spacing
    let start = (spacing - this.lastSpacing)
    let i = 0
    // default. pushes along in-between spacing when spacing - this.lastSpacing is > path.length
    let k = path.length + -(this.lastSpacing + path.length)
    for (i = start; i < path.length; i += spacing) {
      let point = path.getPointAt(i)

      for (var z = currentSegment; z < segmentLookup.length; z++) {
        if (segmentLookup[z] < i) {
          currentSegment = z
          continue
        }
      }

      let segmentPercent =
        (i - segmentLookup[currentSegment]) /
        (segmentLookup[currentSegment + 1] - segmentLookup[currentSegment])

      let pressure = Util.lerp(
        strokeInput[currentSegment].pressure,
        strokeInput[currentSegment + 1].pressure,
        segmentPercent
      )
      let tiltAngle = Util.lerp(
        strokeInput[currentSegment].tiltAngle,
        strokeInput[currentSegment + 1].tiltAngle,
        segmentPercent
      )
      let tilt = Util.lerp(
        strokeInput[currentSegment].tilt,
        strokeInput[currentSegment + 1].tilt,
        segmentPercent
      )

      interpolatedStrokeInput.push([
        this.isErasing ? 0 : this.brushColor.r,
        this.isErasing ? 0 : this.brushColor.g,
        this.isErasing ? 0 : this.brushColor.b,
        this.brushSize,
        this.brushOpacity,
        point.x,
        point.y,
        pressure,
        tiltAngle,
        tilt,
        this.brush,
        this.strokeGrainOffset.x,
        this.strokeGrainOffset.y
      ])
      k = i
    }
    this.lastSpacing = path.length - k

    return interpolatedStrokeInput
  }

  renderStroke (strokeInput, path, strokeContainer) {
    // we have 2+ StrokeInput points (with x, y, pressure, etc),
    // and 2+ matching path segments (with location and handles)
    //  e.g.: strokeInput[0].x === path.segments[0].point.x
    let interpolatedStrokeInput = this.getInterpolatedStrokeInput(strokeInput, path)

    for (let args of interpolatedStrokeInput) {
      this.addStrokeNode(...args, strokeContainer)
    }
  }

  addPointerEventAsPoint (e) {
    let corrected = this.sketchpaneContainer.toLocal(
      { x: e.x - this.viewportRect.x, y: e.y - this.viewportRect.y },
      this.app.stage)

    let pressure = e.pointerType === 'mouse'
      ? e.pressure > 0 ? 0.5 : 0
      : e.pressure

    let tiltAngle = e.pointerType === 'mouse'
      ? { angle: -90, tilt: 37 }
      : Util.calcTiltAngle(e.tiltX, e.tiltY)

    this.strokeInput.push({
      x: corrected.x,
      y: corrected.y,
      pressure: pressure,
      tiltAngle: tiltAngle.angle,
      tilt: tiltAngle.tilt
    })

    // only keep track of input that hasn't been rendered static yet
    this.strokeInput = this.strokeInput.slice(
      Math.max(0, this.lastStaticIndex - 2),
      this.strokeInput.length
    )
    this.strokePath = new paper.Path(
      this.strokeInput
    )
    this.strokePath.smooth({ type: 'catmull-rom', factor: 0.5 }) // centripetal
  }

  // render the live strokes
  // TODO instead of slices, could pass offset and length?
  renderLive (forceRender = false) {
    let len = this.strokeInput.length

    // forceRender is called on up
    if (forceRender) {
      let final = this.strokeInput.length - 1
      let a = this.lastStaticIndex
      let b = final

      if ((b + 1) - a <= 1) {
        console.warn('1 or fewer points remaining')
        return
      }

      this.renderStroke(
        this.strokeInput.slice(a, b + 1),
        new paper.Path(this.strokePath.segments.slice(a, b + 1)),
        this.strokeContainer
      )

      if (this.isErasing) {
        // stamp to erase texture
        this.updateMask(this.strokeContainer, true)
      } else {
        // stamp to layer texture
        this.stampStroke(
          this.strokeContainer,
          this.layers[this.layer]
        )
      }
      this.disposeContainer(this.strokeContainer)
      this.offscreenContainer.removeChildren()

      return
    }

    // can we render static?
    if (len >= 3) {
      let last = this.strokeInput.length - 1
      let a = last - 2
      let b = last - 1

      // render to the static container
      this.renderStroke(
        this.strokeInput.slice(a, b + 1),
        new paper.Path(this.strokePath.segments.slice(a, b + 1)),
        this.strokeContainer
      )

      if (this.isErasing) {
        this.updateMask(this.strokeContainer)
      } else {
        // stamp to layer texture
        this.stampStroke(
          this.strokeContainer,
          this.layers[this.layer]
        )
      }
      this.disposeContainer(this.strokeContainer)
      this.offscreenContainer.removeChildren()

      this.lastStaticIndex = b
    }

    // can we render live?
    if (len >= 2) {
      this.disposeContainer(this.liveStrokeContainer)

      let last = this.strokeInput.length - 1
      let a = last - 1
      let b = last

      // render the current stroke live
      if (this.isErasing) {
        // TODO find a good way to add live strokes to erase mask
        // this.updateMask(this.liveStrokeContainer)
      } else {
        // store the current spacing
        let tmpLastSpacing = this.lastSpacing
        // draw a live stroke
        this.renderStroke(
          this.strokeInput.slice(a, b + 1),
          new paper.Path(this.strokePath.segments.slice(a, b + 1)),
          this.liveStrokeContainer
        )
        // revert the spacing so the real stroke will be correct
        this.lastSpacing = tmpLastSpacing
      }
    }
  }

  updateMask (source, finalize = false) {
    // note which layers will be erased when finalized
    // if empty, default to current layer
    if (!this.erasableLayers.length) {
      this.erasableLayers = [
        this.layers[this.layer]
      ]
    }

    // find the top-most layer
    let layer = this.erasableLayers.sort((a, b) => b.index - a.index)[0]

    // we're starting a new round
    if (!layer.sprite.mask) {
      this.layerContainer.addChild(this.eraseMask)

      // start the mask with a solid red background
      let graphics = new PIXI.Graphics()
        .beginFill(0xff0000, 1.0)
        .drawRect(0, 0, this.width, this.height)
        .endFill()
      this.app.renderer.render(
        graphics,
        this.eraseMask.texture,
        true
      )

      // start using the mask
      for (let layer of this.erasableLayers) {
        layer.sprite.mask = this.eraseMask
      }
    }

    // render the white strokes onto the red filled erase mask texture
    this.app.renderer.render(
      source,
      this.eraseMask.texture,
      false
    )

    // if finalizing,
    if (finalize) {
      for (let layer of this.erasableLayers) {
        layer.sprite.mask = this.eraseMask
        this.stampMask(layer.sprite)
        layer.sprite.mask = null
      }

      // TODO GC the eraseMask texture?
      this.layerContainer.removeChild(this.eraseMask)
    }
  }

  // apply the erase texture to the actual layer texture
  //
  // FIXME why are transforms so convoluted?
  stampMask (sprite) {
    // render the masked sprite to a temporary render texture
    let renderTexture = PIXI.RenderTexture.create(this.width, this.height)
    this.app.renderer.render(
      sprite,
      renderTexture,
      true,
      // reverse the transform so we're rendering at 0,0
      sprite.transform.worldTransform.invert(),
      true // skipUpdateTransform
    )
    let finalizedSprite = new PIXI.Sprite.from(renderTexture) // eslint-disable-line new-cap

    // replace the layer sprite's texture with the "baked" finalizedTexture
    this.app.renderer.render(
      finalizedSprite,
      sprite.texture,
      true
    )

    finalizedSprite.destroy({ texture: true, baseTexture: false })
  }

  saveLayer (index) {
    index = (index == null) ? this.layer : index

    // render the current layer as an HTMLImageElement
    // see: http://pixijs.download/release/docs/PIXI.extract.WebGLExtract.html
    // #image calls #canvas and then converts to #base64 and finally returns an HTMLImageElement (no onload)
    // #canvas reads the raw pixels and converts to an HTMLCanvasElement
    // #pixels just reads the raw pixels via gl.readPixels and returns a Uint8ClampedArray
    return this.app.renderer.plugins.extract.image(this.layers[index].sprite)
  }

  clearLayer (layer) {
    if (!layer) {
      layer = this.layer
    }
    this.renderToLayer(
      this.strokeContainer,
      this.layers[layer],
      true
    )
  }

  // set layer by index (0-indexed)
  selectLayer (index) {
    if (this.pointerDown) return // prevent layer change during draw

    let layerSprite = this.layers[index].sprite

    this.layerContainer.setChildIndex(this.layerBackground, 0)

    let childIndex = 1
    for (let layer of this.layers) {
      this.layerContainer.setChildIndex(layer.sprite, childIndex)

      if (layer.sprite === layerSprite) {
        this.layer = childIndex - 1
        this.layerContainer.setChildIndex(this.offscreenContainer, ++childIndex)
        this.layerContainer.setChildIndex(this.liveStrokeContainer, ++childIndex)
      }
      childIndex++
    }
  }

  getIsErasing () {
    return this.isErasing
  }

  setIsErasing (value) {
    if (this.pointerDown) return // prevent erase mode change during draw

    this.isErasing = value
  }

  setErasableLayers (indexes) {
    this.erasableLayers = []
    for (let layer of this.layers) {
      if (indexes.includes(layer.index)) {
        this.erasableLayers.push(layer)
      }
    }
  }

  getDOMElement () {
    return this.app.view
  }
}
