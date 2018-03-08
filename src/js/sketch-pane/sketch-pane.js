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
    this.brushNodeFilter = new BrushNodeFilter(
      './src/js/sketch-pane/brush/brushnode.frag'
    )
    await this.brushNodeFilter.load()
    await new Promise((resolve, reject) => {
      brushes.brushResources.onComplete.add(resolve)
      brushes.brushResources.onError.add(reject)
      brushes.brushResources.load()
    })

    this.setup()

    this.setSize(1200, 900)
    this.newLayer()
    this.newLayer()
    this.newLayer()

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
    this.layerContainer = new PIXI.Container()
    this.sketchpaneContainer.addChild(this.layerContainer)

    // static stroke container
    this.strokeContainer = new PIXI.Container()
    this.layerContainer.addChild(this.strokeContainer)

    // live stroke container
    this.liveStrokeContainer = new PIXI.Container()
    this.sketchpaneContainer.addChild(this.liveStrokeContainer)

    this.app.stage.addChild(this.sketchpaneContainer)
    this.sketchpaneContainer.scale.set(1)

    this.counter = 0

    this.brushRotation = 0

    this.strokeInput = []
    this.strokePath = undefined

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
    this.layerContainer.addChild(background)
    this.centerContainer()
  }

  newLayer () {
    this.layerContainer.position.set(0, 0)
    let renderTexture = PIXI.RenderTexture.create(this.width, this.height)
    // renderTexture.baseTexture.premultipliedAlpha = false
    let renderTextureSprite = new PIXI.Sprite(renderTexture)
    this.layerContainer.addChild(renderTextureSprite)
    this.centerContainer()
    this.layer = 1
    this.layerContainer.setChildIndex(this.strokeContainer, this.layer + 1)
  }

  loadLayers (layers) {
    this.layers = layers

    layers.forEach(layer => {
      PIXI.loader.add(layer, './src/img/layers/' + layer + '.png')
    })
    PIXI.loader.load((loader, resources) => {
      console.log(resources)

      this.width = 1000
      this.height = 800

      let mask = new PIXI.Graphics()
      mask.beginFill(0x0, 1)
      mask.drawRect(0, 0, this.width, this.height)
      mask.endFill()
      this.layerContainer.mask = mask
      this.sketchpaneContainer.addChild(mask)

      this.layers.forEach((layer, index) => {
        this.layerContainer.position.set(0, 0)
        let renderTexture = PIXI.RenderTexture.create(this.width, this.height)
        let renderTextureSprite = new PIXI.Sprite(renderTexture)
        this.app.renderer.render(
          new PIXI.Sprite(resources[layer].texture),
          renderTexture
        )
        this.layerContainer.addChild(renderTextureSprite)
      })

      this.centerContainer()

      this.layer = 1

      this.layerContainer.setChildIndex(this.strokeContainer, this.layer + 1)
    })
  }

  centerContainer () {
    this.sketchpaneContainer.pivot.set(this.width / 2, this.height / 2)
    this.sketchpaneContainer.position.set(
      this.app.renderer.width / 2,
      this.app.renderer.height / 2
    )
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
    let brushNodeSprite = new PIXI.Sprite(PIXI.Texture.WHITE)

    let nodeSize = size - (1 - pressure) * size * brush.settings.pressureSize
    let tiltSizeMultiple =
      Math.pow(tilt / 90.0, 2) * brush.settings.tiltSize * 3 + 1
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

    // nodeRotation = this.brushRotation

    brushNodeSprite.width = nodeSize
    brushNodeSprite.height = nodeSize

    brushNodeSprite.position = new PIXI.Point(0, 0)

    this.brushNodeFilter.shader.uniforms.uRed = r
    this.brushNodeFilter.shader.uniforms.uGreen = g
    this.brushNodeFilter.shader.uniforms.uBlue = b
    this.brushNodeFilter.shader.uniforms.uOpacity = nodeOpacity

    this.brushNodeFilter.shader.uniforms.uRotation = -nodeRotation

    this.brushNodeFilter.shader.uniforms.uBleed =
      Math.pow(1 - pressure, 1.6) * brush.settings.pressureBleed

    this.brushNodeFilter.shader.uniforms.uGrainRotation =
      brush.settings.rotation
    this.brushNodeFilter.shader.uniforms.uGrainScale = brush.settings.scale

    this.brushNodeFilter.shader.uniforms.u_texture_size = Util.nearestPow2(
      nodeSize
    )
    this.brushNodeFilter.shader.uniforms.u_size = nodeSize
    this.brushNodeFilter.shader.uniforms.u_x_offset =
      (x + grainOffsetX) * brush.settings.movement
    this.brushNodeFilter.shader.uniforms.u_y_offset =
      (y + grainOffsetY) * brush.settings.movement

    this.brushNodeFilter.shader.uniforms.u_brushTex =
      brushes.brushResources.resources[brush.settings.brushImage].texture
    this.brushNodeFilter.shader.uniforms.u_grainTex =
      brushes.brushResources.resources[brush.settings.grainImage].texture

    brushNodeSprite.filters = [this.brushNodeFilter.shader]

    let renderTexture = PIXI.RenderTexture.create(nodeSize, nodeSize)

    this.app.renderer.render(brushNodeSprite, renderTexture)

    brushNodeSprite.filters = null

    let node = new PIXI.Sprite(renderTexture)
    node.position = new PIXI.Point(x, y)
    node.rotation = nodeRotation
    node.anchor.set(0.5)

    strokeContainer.addChild(node)
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

    if (e.target === this.app.view) {
      this.addMouseEventAsPoint(e)
      this.renderLive()
    }
  }

  pointermove (e) {
    // to prevent off-canvas move events:
    // if (e.target === this.app.view) return

    if (this.pointerDown) {
      this.addMouseEventAsPoint(e)
      this.renderLive()
    }
  }

  pointerup (e) {
    if (e.target === this.app.view) {
      if (this.pointerDown) {
        this.addMouseEventAsPoint(e)
        this.renderLive(true) // forceRender

        // stamp to layer texture
        this.stampStroke(
          this.strokeContainer,
          this.layerContainer.children[this.layer].texture
        )

        // cleanup
        for (let child of this.strokeContainer.children) {
          child.destroy({
            children: true,
            texture: true,
            baseTexture: true
          })
        }
        this.strokeContainer.removeChildren()

        for (let child of this.liveStrokeContainer.children) {
          child.destroy({
            children: true,
            texture: true,
            baseTexture: true
          })
        }
        this.liveStrokeContainer.removeChildren()

        for (let child of this.strokeContainer.children) {
          child.destroy({
            children: true,
            texture: true,
            baseTexture: true
          })
        }
        this.strokeContainer.removeChildren()
      }
    }

    this.pointerDown = false
  }

  getInterpolatedStrokeInput (strokeInput, path) {
    let interpolatedStrokeInput = []

    // get lookups for each segment so we know how to iterpolate

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

    for (let i = 0; i < path.length; i += spacing) {
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
    }

    return interpolatedStrokeInput
  }

  renderStroke (strokeInput, path, strokeContainer) {
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
    this.brushColor.r = 0
    this.brushColor.g = 0
    this.brushColor.b = 0
    this.addStrokeNode(
      this.brushColor.r,
      this.brushColor.g,
      this.brushColor.b,
      this.brushSize * 2,
      0.5, // this.brushOpacity,
      corrected.x,
      corrected.y,
      pressure,
      tiltAngle.angle,
      tiltAngle.tilt,
      this.brush,
      0,
      0,
      this.strokeContainer
    )

    this.strokeInput.push({
      x: corrected.x,
      y: corrected.y,
      pressure: pressure,
      tiltAngle: tiltAngle.angle,
      tilt: tiltAngle.tilt
    })

    this.strokePath.add([x, y])
    this.strokePath.smooth({ type: 'catmull-rom', factor: 0.5 }) // centripetal
  }

  // render the live strokes
  // TODO instead of slices, could pass offset and length?
  renderLive (forceRender = false) {
    // at which index do we start and end?
    let a = this.lastStaticIndex
    let b = this.strokeInput.length - 1

    // clear the live container of any existing sprites
    for (let child of this.liveStrokeContainer.children) {
      child.destroy({
        children: true,
        texture: true,
        baseTexture: true
      })
    }
    this.liveStrokeContainer.removeChildren()

    console.log('   add @', this.strokeInput.length - 1)

    // forceRender is called on pointerup
    if (forceRender) {
      // debug
      this.brushColor.r = 1
      this.brushColor.g = 0
      this.brushColor.b = 0

      if ((b + 1) - a <= 1) {
        // TODO handle this case
        console.warn('fewer than 1, not drawn')
      }

      this.renderStroke(
        this.strokeInput.slice(a, b),
        new paper.Path(this.strokePath.segments.slice(a, b)),
        this.strokeContainer
      )

      this.lastStaticIndex = b
      return
    }

    // do we have 8 (or more) un-static points?
    if ((b + 1) - a >= 8) {
      // grab points, stopping before the last 4
      let lastStaticIndex = b - 4

      // render them to the static container

      // debug
      this.brushColor.r = 0
      this.brushColor.g = 0
      this.brushColor.b = 1

      this.renderStroke(
        this.strokeInput.slice(a, lastStaticIndex + 1),
        new paper.Path(this.strokePath.segments.slice(a, lastStaticIndex + 1)),
        this.strokeContainer
      )
      console.log('static @', '[', a, '...', lastStaticIndex, ']', 'len:', this.strokeInput.slice(a, lastStaticIndex + 1).length)

      this.lastStaticIndex = lastStaticIndex
      a = lastStaticIndex
    }

    // do we have at least 4 points to render live?
    if ((b + 1) - a >= 4) {
      console.log('  live @', '[', a, '...', b, ']', 'len:', this.strokeInput.slice(a, b + 1).length)

      // render the current stroke live

      // debug
      this.brushColor.r = 1
      this.brushColor.g = 0
      this.brushColor.b = 1

      //
      // TODO for 1...3 points (both live AND forceRender) render a curve?
      //

      this.renderStroke(
        this.strokeInput.slice(a, b + 1),
        new paper.Path(this.strokePath.segments.slice(a, b + 1)),
        this.liveStrokeContainer
      )
    }
  }

  setLayer (layer) {
    this.layer = layer
    this.layerContainer.setChildIndex(this.strokeContainer, this.layer + 1)
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
