/* global paper PIXI tinycolor */
const Util = require('./util.js')
const brushes = require('./brush/brushes.js')
const BrushNodeFilter = require('./brush/brush-node-filter.js')

/*

  TODO:

  set size


  live drawing
  spacing between nodes
  get rid of grid
  erase by setting the alpha of the current layer
  save layers to png



    loadPreview
      load texture
      display

*/

module.exports = class SketchPane {
  constructor () {
    this.layerSprites = []
    this.layerBackground = null
  }

  saveLayer () {
    console.log('SAVE!')

    //     //renderer.bindRenderTarget(textureBuffer)
    //     //console.log(BYTES_PER_PIXEL)
    //     const webglPixels = new Uint8Array(4 * this.width * this.height);

    //     console.log(this.app.renderer)

    //    const gl = this.app.renderer.view.getContext("webgl", {
    //   premultipliedAlpha: true, alpha: true  // Ask for non-premultiplied alpha
    // });

    //    let texture = (this.layerContainer.children[this.layer].texture.baseTexture._glTextures[0].texture)

    //   var fb = gl.createFramebuffer();
    //   gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    // // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    // gl.clearColor(1,1,1,1);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // // Turn off rendering to alpha
    // gl.colorMask(true, true, true, true);
    //  gl.enable(gl.BLEND);
    //  //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //   gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    //  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    //   gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // // gl.disable(gl.BLEND);
    // //   gl.disable(gl.DEPTH_TEST);

    // //gl.enable(gl.BLEND);
    // //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    //   // this.app.renderer.bindRenderTexture(this.layerContainer.children[this.layer].texture)

    //     console.log(webglPixels)

    //     gl.readPixels(0,0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, webglPixels)

    //    console.log(webglPixels)

    //    const background = new PIXI.CanvasRenderTarget(this.width, this.height)
    //    const canvasData = background.context.getImageData(0, 0, this.width, this.height);
    //    console.log(canvasData)
    //    canvasData.data.set(webglPixels);
    //    background.context.putImageData(canvasData, 0, 0)

    //    console.log(background)
    //    document.body.appendChild(background.canvas)
    //    // new PIXI.extract.WebGLExtract()

    //     console.log()
    //     document.body.appendChild(this.app.renderer.plugins.extract.image(this.layerContainer.children[this.layer].texture))

    // const app = new PIXI.Application({transparent: true, backgroundColor: 0x000, width: 150, height: 150, preserveDrawingBuffer: true});

    // const graphics = new PIXI.Graphics()
    //     .beginFill(0xFFffcc,0.5)
    //     .drawCircle(0, 0, 50);

    // //app.renderer.render(graphics)
    // app.stage.position.set(0,0)
    //  app.stage.addChild(new PIXI.Sprite(this.layerContainer.children[this.layer].texture))
    //  app.stage.addChild(graphics)

    // // Render the graphics as an HTMLImageElement
    // //const image = app.renderer.plugins.extract.image(graphics);
    //  document.body.appendChild(app.view);
    //   console.log("asdasd")

    //  setTimeout(()=>{
    //   console.log("asdasd")
    //   console.log(app.view)
    //   const image = app.view.toDataURL()
    //   console.log(image)
    //   let i = new Image()
    //   i.src = image
    //   document.body.appendChild(i);

    //  }, 1000)

    // document.body.appendChild(this.app.renderer.plugins.extract.image(new PIXI.Sprite(this.layerContainer.children[this.layer].texture)))
  }

  async load () {
    await new Promise((resolve, reject) => {
      brushes.brushResources.onComplete.add(resolve)
      brushes.brushResources.onError.add(reject)
      brushes.brushResources.load()
    })

    await this.loadTextureSprites({ brushImagePath: './src/img/brush' })

    this.setup()

    this.setSize(1200, 900)

    this.newLayer()
    this.newLayer()
    this.newLayer()

    this.setLayer(1)

    // this.loadLayers(['grid', 'layer01', 'layer02', 'layer03'])
    // this.loadLayers(['grid', 'layer01'])
  }
  setup () {
    paper.setup()
    PIXI.settings.FILTER_RESOLUTION = 1
    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
    PIXI.settings.MIPMAP_TEXTURES = true
    PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.REPEAT
    PIXI.utils.skipHello()

    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      // antialias: false,
      // preserveDrawingBuffer: true,
      // transparent: true,
      antialias: false
      // powerPreference: 'high-performance'
    })

    this.app.renderer.roundPixels = false

    // this.app.renderer.transparent = true
    document.body.appendChild(this.app.view)

    this.brushes = brushes
    this.brush = this.brushes.brushes.default

    this.brushColor = { r: 0, g: 0, b: 0 }
    this.brushSize = 49
    this.brushOpacity = 0.41

    this.brush = this.brushes.brushes.pen
    this.brushSize = 4
    this.brushOpacity = 0.9
    this.brushColor = { r: 0, g: 0, b: 0 }

    this.sketchpaneContainer = new PIXI.Container()

    // layer
    this.layerContainer = new PIXI.Container()
    this.sketchpaneContainer.addChild(this.layerContainer)

    // static stroke
    this.strokeContainer = new PIXI.Container()
    this.strokeContainer.name = 'static'
    this.layerContainer.addChild(this.strokeContainer)

    // live stroke
    this.liveStrokeContainer = new PIXI.Container()
    this.liveStrokeContainer.name = 'live'
    this.layerContainer.addChild(this.liveStrokeContainer)

    // off-screen container
    this.offscreenContainer = new PIXI.Container()
    this.offscreenContainer.name = 'offscreen'
    this.layerContainer.addChild(this.offscreenContainer)

    this.app.stage.addChild(this.sketchpaneContainer)
    this.sketchpaneContainer.scale.set(1)

    this.counter = 0

    this.strokeInput = []
    this.strokePath = undefined
    this.lastStaticIndex = 0

    this.app.ticker.add(e => {
      // this.brushSize = Math.sin(this.counter/30)*200+300

      if (this.spin) {
        this.sketchpaneContainer.rotation += 0.01
        this.sketchpaneContainer.scale.set(
          Math.sin(this.counter / 30) * 1 + 1.8
        )
      } else {
        this.sketchpaneContainer.rotation = 0
        this.sketchpaneContainer.scale.set(1)
      }
      this.counter++
    })

    // this.spin = true
  }

  setSize (width, height, color) {
    this.width = width
    this.height = height

    let mask = new PIXI.Graphics()
    mask.beginFill(0x0, 1)
    mask.drawRect(0, 0, this.width, this.height)
    mask.endFill()
    this.layerContainer.mask = mask
    this.sketchpaneContainer.addChild(mask)

    if (!color) {
      color = 'white'
    }
    let bgColor = tinycolor(color)
    bgColor.toHex()
    let background = new PIXI.Graphics()
    background.beginFill('0x' + bgColor.toHex())
    background.drawRect(0, 0, this.width, this.height)
    background.endFill()
    background.name = 'background'
    this.layerContainer.addChild(background)
    this.layerBackground = background
    this.centerContainer()
  }

  newLayer () {
    this.layerContainer.position.set(0, 0)
    let renderTexture = PIXI.RenderTexture.create(this.width, this.height)
    // renderTexture.baseTexture.premultipliedAlpha = false
    let renderTextureSprite = new PIXI.Sprite(renderTexture)
    renderTextureSprite.name = `Layer ${this.layerSprites.length}`
    this.layerContainer.addChild(renderTextureSprite)
    this.layerSprites.push(renderTextureSprite)
    this.centerContainer()
  }

  // loadLayers (layers) {
  //   this.layers = layers
  // 
  //   layers.forEach(layer => {
  //     PIXI.loader.add(layer, './src/img/layers/' + layer + '.png')
  //   })
  //   PIXI.loader.load((loader, resources) => {
  //     console.log(resources)
  // 
  //     this.width = 1000
  //     this.height = 800
  // 
  //     let mask = new PIXI.Graphics()
  //     mask.beginFill(0x0, 1)
  //     mask.drawRect(0, 0, this.width, this.height)
  //     mask.endFill()
  //     this.layerContainer.mask = mask
  //     this.sketchpaneContainer.addChild(mask)
  // 
  //     this.layers.forEach((layer, index) => {
  //       this.layerContainer.position.set(0, 0)
  //       let renderTexture = PIXI.RenderTexture.create(this.width, this.height)
  //       let renderTextureSprite = new PIXI.Sprite(renderTexture)
  //       this.app.renderer.render(
  //         new PIXI.Sprite(resources[layer].texture),
  //         renderTexture
  //       )
  //       this.layerContainer.addChild(renderTextureSprite)
  //     })
  // 
  //     this.centerContainer()
  // 
  //     this.layer = 1
  // 
  //     this.layerContainer.setChildIndex(this.strokeContainer, this.layer + 1)
  //   })
  // }

  centerContainer () {
    this.sketchpaneContainer.pivot.set(this.width / 2, this.height / 2)
    this.sketchpaneContainer.position.set(
      Math.floor(this.app.renderer.width / 2),
      Math.floor(this.app.renderer.height / 2)
    )
  }

  // per http://www.html5gamedevs.com/topic/29327-guide-to-pixi-v4-filters/
  // for each brush, add a sprite with the brush and grain images, so we can get the actual transformation matrix for those image textures
  async loadTextureSprites ({ brushImagePath }) {
    let brushImageNames = [...new Set(Object.values(brushes.brushes).map(b => b.settings.brushImage))]
    let grainImageNames = [...new Set(Object.values(brushes.brushes).map(b => b.settings.grainImage))]

    this.brushImageSprites = []
    this.grainImageSprites = []

    let promises = []
    for (let [names, dict] of [[ brushImageNames, this.brushImageSprites ], [ grainImageNames, this.grainImageSprites ]]) {
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
              texture.on('loaded', (result) => resolve(texture))
              texture.on('error', (err) => reject(err))
            })
          )
        } else {
          promises.push(Promise.reject(new Error()))
        }
      }

      await Promise.all(promises)
    }
  }

  stampStroke (strokeContainer, texture) {
    this.app.renderer.render(
      strokeContainer,
      texture,
      false
    )
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

    // let brushNodeSprite = new PIXI.Sprite(PIXI.Texture.WHITE) // PIXI.Texture.EMPTY

    // eslint-disable-next-line new-cap
    let sprite = new PIXI.Sprite.from(
      // brushes.brushResources.resources[brush.settings.brushImage].data
      brushes.brushResources.resources[brush.settings.brushImage].texture
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
    // TODO can we avoid generating a new sprite each time?
    //      (only used for texture, positioning, transform matrix)
    let grainSprite = new PIXI.Sprite(this.grainImageSprites[brush.settings.grainImage].texture)
    this.offscreenContainer.addChild(grainSprite)

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

    filter.uniforms.uGrainRotation =
      brush.settings.rotation
    filter.uniforms.uGrainScale = brush.settings.scale

    // DEPRECATED
    filter.uniforms.u_texture_size = Util.nearestPow2(
      nodeSize
    )
    filter.uniforms.u_size = nodeSize
    //

    filter.uniforms.u_x_offset =
      (x + grainOffsetX) * brush.settings.movement
    filter.uniforms.u_y_offset =
      (y + grainOffsetY) * brush.settings.movement

    filter.uniforms.u_brushTex =
      this.brushImageSprites[brush.settings.brushImage]._texture

    // passed as sprite, in filter, instead
    // filter.uniforms.u_grainTex =
    //   this.grainImageSprites[brush.settings.grainImage]._texture

    // subpixel offset
    filter.uniforms.u_offset_px = oXY // TODO multiply by app.stage.scale if zoomed
    // console.log('iX', iX, 'iY', iY, 'u_offset_px', oXY)
    // subpixel scale AND padding AND rotation accomdation
    filter.uniforms.u_node_scale = oS // desired scale
    filter.padding = 1 // for filterClamp

    sprite.filters = [filter]

    strokeContainer.addChild(sprite)
  }

  resize () {
    this.app.renderer.resize(window.innerWidth, window.innerHeight)
    this.sketchpaneContainer.position.set(
      this.app.renderer.width / 2,
      this.app.renderer.height / 2
    )
  }

  pointerdown (e) {
    this.pointerDown = true

    this.strokeInput = []
    this.strokePath = new paper.Path()
    this.lastStaticIndex = 0
    this.lastSpacing = undefined

    if (e.target === this.app.view) {
      this.addMouseEventAsPoint(e)
      this.renderLive()

      this.app.view.style.cursor = 'crosshair'
    }
  }

  pointermove (e) {
    // to prevent off-canvas move events:
    // if (e.target !== this.app.view) return

    if (this.pointerDown) {
      this.addMouseEventAsPoint(e)
      this.renderLive()
      this.app.view.style.cursor = 'crosshair'
    }
  }

  pointerup (e) {
    if (e.target === this.app.view) {
      if (this.pointerDown) {
        this.addMouseEventAsPoint(e)
        this.renderLive(true) // forceRender

        this.disposeContainer(this.liveStrokeContainer)
        this.disposeContainer(this.offscreenContainer)
      }
    }

    this.pointerDown = false
    this.app.view.style.cursor = 'auto'
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

    let grainOffset = { x: 0, y: 0 }
    if (this.brush.settings.randomOffset) {
      grainOffset.x = Math.floor(Math.random() * 100)
      grainOffset.y = Math.floor(Math.random() * 100)
    }

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
        this.brushColor.r,
        this.brushColor.g,
        this.brushColor.b,
        this.brushSize,
        this.brushOpacity,
        point.x,
        point.y,
        pressure,
        tiltAngle,
        tilt,
        this.brush,
        grainOffset.x,
        grainOffset.y
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

  addMouseEventAsPoint (e) {
    let pressure = e.pressure
    let x =
      (e.x - this.sketchpaneContainer.x) / this.sketchpaneContainer.scale.x +
      this.width / 2
    let y =
      (e.y - this.sketchpaneContainer.y) / this.sketchpaneContainer.scale.y +
      this.height / 2
    let corrected = Util.rotatePoint(
      x,
      y,
      this.width / 2,
      this.height / 2,
      -this.sketchpaneContainer.rotation
    )
    let tiltAngle = Util.calcTiltAngle(e.tiltX, e.tiltY)

    // debug
      // this.brushColor.r = 0
      // this.brushColor.g = 0
      // this.brushColor.b = 0
      // this.addStrokeNode(
      //   this.brushColor.r,
      //   this.brushColor.g,
      //   this.brushColor.b,
      //   this.brushSize * 3,
      //   0.5, // this.brushOpacity,
      //   corrected.x,
      //   corrected.y,
      //   pressure,
      //   tiltAngle.angle,
      //   tiltAngle.tilt,
      //   this.brush,
      //   0,
      //   0,
      //   this.strokeContainer
      // )

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

    // debug
      // console.log('\n')
      // console.log('   add @', len - 1)

    // forceRender is called on pointerup
    if (forceRender) {
      // debug
        // this.brushColor.r = 1
        // this.brushColor.g = 0
        // this.brushColor.b = 0

      let final = this.strokeInput.length - 1
      let a = this.lastStaticIndex
      let b = final

      if ((b + 1) - a <= 1) {
        console.warn('1 or fewer points remaining')
        return
      }

      // debug
        // console.log('force  @', '[', a, '...', b, ']')
      this.renderStroke(
        this.strokeInput.slice(a, b + 1),
        new paper.Path(this.strokePath.segments.slice(a, b + 1)),
        this.strokeContainer
      )

      // stamp to layer texture
      this.stampStroke(
        this.strokeContainer,
        this.layerContainer.children[this.layer].texture
      )
      this.disposeContainer(this.strokeContainer)

      return
    }

    // can we render static?
    if (len >= 3) {
      let last = this.strokeInput.length - 1
      let a = last - 2
      let b = last - 1

      // render to the static container

      // debug
        // this.brushColor.r = 0
        // this.brushColor.g = 0
        // this.brushColor.b = 1

      this.renderStroke(
        this.strokeInput.slice(a, b + 1),
        new paper.Path(this.strokePath.segments.slice(a, b + 1)),
        this.strokeContainer
      )

      // stamp to layer texture
      this.stampStroke(
        this.strokeContainer,
        this.layerContainer.children[this.layer].texture
      )
      this.disposeContainer(this.strokeContainer)

      this.lastStaticIndex = b

      // debug
        // console.log('static @', '[', a, '...', b, ']')
    }

    // can we render live?
    if (len >= 2) {
      this.disposeContainer(this.liveStrokeContainer)

      let last = this.strokeInput.length - 1
      let a = last - 1
      let b = last

      // debug
        // console.log('  live @', '[', a, '...', b, ']')

      // render the current stroke live

      // debug
        // this.brushColor.r = 1
        // this.brushColor.g = 0
        // this.brushColor.b = 1

      //
      // TODO for 1...3 points (both live AND forceRender) render a curve?
      //

      // debug
        // let tmpSize = this.brushSize
        // let tmpSpacing = this.brush.settings.spacing
        // this.brushSize *= 2
        // this.brush.settings.spacing = 1
      let tmpLastSpacing = this.lastSpacing
      this.renderStroke(
        this.strokeInput.slice(a, b + 1),
        new paper.Path(this.strokePath.segments.slice(a, b + 1)),
        this.liveStrokeContainer
      )
      this.lastSpacing = tmpLastSpacing
        // this.brushSize = tmpSize
        // this.brush.settings.spacing = tmpSpacing
    }
  }

  // set layer by number (1-indexed)
  setLayer (number) {
    let layerSprite = this.layerSprites[number - 1]

    this.layerContainer.setChildIndex(this.layerBackground, 0)

    let n = 0
    for (let layer of this.layerSprites) {
      this.layerContainer.setChildIndex(layer, ++n)
      if (layer === layerSprite) {
        this.layer = n

        this.layerContainer.setChildIndex(this.offscreenContainer, ++n)
        this.layerContainer.setChildIndex(this.strokeContainer, ++n)
        this.layerContainer.setChildIndex(this.liveStrokeContainer, ++n)
      }
    }
  }

  clearLayer (layer) {
    if (!layer) {
      layer = this.layer
    }
    this.app.renderer.render(
      this.strokeContainer,
      this.layerContainer.children[layer].texture,
      true
    )
  }
}
