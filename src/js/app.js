/* global dat PIXI SketchPane Stats */

const sketchPane = new SketchPane()
const gui = new dat.GUI()

sketchPane
  .load()
  .then(() => {
    window.sketchPane = sketchPane

    console.log('ready')

    let stats = new Stats()
    stats.showPanel(0)
    document.body.appendChild(stats.dom)

    window.addEventListener('resize', function (e) {
      sketchPane.resize()
    })

    window.addEventListener('pointerdown', function (e) {
      if (gui.domElement.contains(e.target)) return // ignore GUI pointer movement

      sketchPane.pointerdown(e)
    })

    window.addEventListener('pointerup', function (e) {
      if (gui.domElement.contains(e.target)) return // ignore GUI pointer movement

      sketchPane.pointerup(e)
    })

    window.addEventListener('pointermove', function (e) {
      if (gui.domElement.contains(e.target)) return // ignore GUI pointer movement

      // if (e.target.parentNode !== document.body) return
      sketchPane.pointermove(e)
    })

    window.addEventListener('keydown', function (e) {
      // console.log(e)
      switch (e.key) {
        case '.':
          sketchPane.brushSize = Math.round(sketchPane.brushSize * 1.5)
          console.log(sketchPane.brushSize)
          break
        case ',':
          sketchPane.brushSize = Math.round(sketchPane.brushSize / 1.5)
          console.log(sketchPane.brushSize)
          break
        case '1':
          sketchPane.color = {
            r: Math.random(),
            g: Math.random(),
            b: Math.random()
          }
          break
        case '2':
          sketchPane.size = 10
          break
        case '3':
          sketchPane.size = Math.random() * 300
          break
        case '4':
          sketchPane.opacity = Math.random() * 0.8 + 0.2
          break
        case '5':
          sketchPane.opacity = Math.random() * 0.8 + 0.2
          break
        case '6':
          sketchPane.brush = sketchPane.brushes.brushes.pen
          break
        case '7':
          sketchPane.brush = sketchPane.brushes.brushes.pencil
          break
        case 'c':
          sketchPane.clearLayer()
          break
        case 'e':
          sketchPane.setIsErasing(!sketchPane.getIsErasing())
          break
      }
    })

    document.getElementById('l-1').addEventListener('click', function (e) {
      sketchPane.setLayer(0)
    })

    document.getElementById('l-2').addEventListener('click', function (e) {
      sketchPane.setLayer(1)
    })

    document.getElementById('l-3').addEventListener('click', function (e) {
      sketchPane.setLayer(2)
    })

    document.getElementById('l-4').addEventListener('click', function (e) {
      sketchPane.setLayer(3)
    })

    document.getElementById('b-1').addEventListener('click', function (e) {
      sketchPane.brush = sketchPane.brushes.brushes.pencil
      sketchPane.brushSize = 4
      sketchPane.brushOpacity = 0.8
      sketchPane.brushColor = { r: 0.05, g: 0.05, b: 0.05 }
    })

    document.getElementById('b-2').addEventListener('click', function (e) {
      sketchPane.brush = sketchPane.brushes.brushes.pen
      sketchPane.brushSize = 4
      sketchPane.brushOpacity = 0.9
      sketchPane.brushColor = { r: 0, g: 0, b: 0 }
    })

    document.getElementById('b-copic').addEventListener('click', function (e) {
      sketchPane.brush = sketchPane.brushes.brushes.copic
      sketchPane.brushSize = 40
      sketchPane.brushOpacity = 0.6
      let val = 0.8
      let val2 = 1
      sketchPane.brushColor = { r: val, g: val, b: val2 }
    })

    document.getElementById('b-3').addEventListener('click', function (e) {
      sketchPane.brush = sketchPane.brushes.brushes.charcoal
      sketchPane.brushSize = 50
      sketchPane.brushOpacity = 0.6
      sketchPane.brushColor = { r: 0.6, g: 0.6, b: 1 }
    })

    document.getElementById('b-4').addEventListener('click', function (e) {
      sketchPane.brush = sketchPane.brushes.brushes.watercolor
      sketchPane.brushSize = 100
      sketchPane.brushOpacity = 0.4
      sketchPane.brushColor = { r: 0.8, g: 0.8, b: 1 }
    })

    document.getElementById('b-5').addEventListener('click', function (e) {
      sketchPane.brush = sketchPane.brushes.brushes.clouds
    })

    document.getElementById('b-6').addEventListener('click', function (e) {
      sketchPane.brush = sketchPane.brushes.brushes.slate
    })

    document.getElementById('b-7').addEventListener('click', function (e) {
      sketchPane.brush = sketchPane.brushes.brushes.brushpen
      sketchPane.brushSize = 15
      sketchPane.brushOpacity = 1
      sketchPane.brushColor = { r: 0, g: 0, b: 0 }
    })

    document.getElementById('c-1').addEventListener('click', function (e) {
      let val = 0
      sketchPane.brushColor = { r: val, g: val, b: val }
    })

    document.getElementById('c-2').addEventListener('click', function (e) {
      let val = 0.0
      let val2 = 0.2
      sketchPane.brushColor = { r: val, g: val, b: val2 }
    })

    document.getElementById('c-3').addEventListener('click', function (e) {
      let val = 0.3
      let val2 = 0.6
      sketchPane.brushColor = { r: val, g: val, b: val2 }
    })

    document.getElementById('c-4').addEventListener('click', function (e) {
      let val = 0.7
      let val2 = 0.8
      sketchPane.brushColor = { r: val, g: val, b: val2 }
    })

    document.getElementById('c-5').addEventListener('click', function (e) {
      let val = 0.8
      let val2 = 1
      sketchPane.brushColor = { r: val, g: val, b: val2 }
    })

    document.getElementById('c-6').addEventListener('click', function (e) {
      let val = 0.3
      let val2 = 1
      sketchPane.brushColor = { r: val2, g: val2, b: val }
    })

    document.getElementById('c-7').addEventListener('click', function (e) {
      // let val = Math.random() * 0.4 + 0.6
      // let val2 = Math.random() * 0.4 + 0.2
      sketchPane.brushColor = { r: 1, g: 1, b: 1 }
    })

    document.getElementById('s-1').addEventListener('click', function (e) {
      sketchPane.brushSize = 3
    })

    document.getElementById('s-2').addEventListener('click', function (e) {
      sketchPane.brushSize = 6
    })

    document.getElementById('s-3').addEventListener('click', function (e) {
      sketchPane.brushSize = 40
    })

    document.getElementById('s-4').addEventListener('click', function (e) {
      sketchPane.brushSize = 100
    })

    document.getElementById('o-1').addEventListener('click', function (e) {
      sketchPane.brushOpacity = 0.1
    })

    document.getElementById('o-2').addEventListener('click', function (e) {
      sketchPane.brushOpacity = 0.3
    })

    document.getElementById('o-3').addEventListener('click', function (e) {
      sketchPane.brushOpacity = 0.5
    })

    document.getElementById('o-4').addEventListener('click', function (e) {
      sketchPane.brushOpacity = 0.8
    })

    document.getElementById('o-5').addEventListener('click', function (e) {
      sketchPane.brushOpacity = 1
    })

    document.getElementById('clear').addEventListener('click', function (e) {
      sketchPane.clearLayer()
    })

    document.getElementById('spin').addEventListener('click', function (e) {
      sketchPane.spin = !sketchPane.spin
    })

    document.getElementById('save').addEventListener('click', function (e) {
      let image = sketchPane.saveLayer()
      console.log('got image', image)
    })

    const onSpacingClick = e => {
      sketchPane.brush.settings.spacing = parseFloat(e.target.textContent)
    }
    document
      .getElementById('spacing-1')
      .addEventListener('click', onSpacingClick)
    document
      .getElementById('spacing-2')
      .addEventListener('click', onSpacingClick)
    document
      .getElementById('spacing-3')
      .addEventListener('click', onSpacingClick)
    document
      .getElementById('spacing-4')
      .addEventListener('click', onSpacingClick)
    document
      .getElementById('spacing-5')
      .addEventListener('click', onSpacingClick)

    // fake some pointer movements
    const fakeEvent = ({ x, y, pressure = 1.0 }) => ({
      x,
      y,
      pressure,
      tiltX: 0,
      tiltY: 0,
      target: sketchPane.app.view
    })

    const drawStrokes = () => {
      // sketchPane.brush = sketchPane.brushes.brushes.pen
      // sketchPane.brushSize = 30
      // sketchPane.brushOpacity = 0.9
      // sketchPane.brushColor = { r: 0, g: 0, b: 0 }
      // sketchPane.brush.settings.spacing = 0.7

      for (let i = 0; i < Math.PI * 2 * 2; i++) {
        let x = 350 + i * 50
        let y = 400 + Math.cos(i) * 50
        sketchPane.addMouseEventAsPoint(fakeEvent({ x, y }))
        sketchPane.renderLive()
      }

      ;(async function () {
        // let dur = 100
        sketchPane.pointerdown(fakeEvent({ x: 350, y: 300 }))
        // await new Promise(resolve => setTimeout(resolve, dur))
        sketchPane.pointermove(fakeEvent({ x: 350 + 70, y: 305 }))
        // await new Promise(resolve => setTimeout(resolve, dur))
        sketchPane.pointermove(fakeEvent({ x: 350 + 70 + 70, y: 310 }))
        // await new Promise(resolve => setTimeout(resolve, dur))
        sketchPane.pointermove(fakeEvent({ x: 350 + 70 + 70 + 70, y: 310 }))
        // await new Promise(resolve => setTimeout(resolve, dur))
        sketchPane.pointermove(
          fakeEvent({ x: 350 + 70 + 70 + 70 + 70, y: 310 })
        )
        // await new Promise(resolve => setTimeout(resolve, dur))
        sketchPane.pointermove(
          fakeEvent({ x: 350 + 70 + 70 + 70 + 70 + 70, y: 310 })
        )
        // await new Promise(resolve => setTimeout(resolve, dur))
        sketchPane.pointerup(fakeEvent({ x: 700, y: 310 }))
      })()
    }

    const plotLines = (px = 550, py = 400) => {
      // sketchPane.brush = sketchPane.brushes.brushes.pen
      // sketchPane.brushSize = 4
      // sketchPane.brushOpacity = 0.9
      // sketchPane.brushColor = { r: 0, g: 0, b: 0 }

      // sketchPane.brush = sketchPane.brushes.brushes.brushpen
      // sketchPane.brushSize = 15
      // sketchPane.brushOpacity = 1
      // sketchPane.brushColor = { r: 0, g: 0, b: 0 }

      // sketchPane.brush = sketchPane.brushes.brushes.watercolor
      // sketchPane.brushSize = 50
      // sketchPane.brushOpacity = 0.4
      // sketchPane.brushColor = { r: 0.8, g: 0.8, b: 1 }

      let angle = 0
      const plot = (x, y) => {
        angle = (angle + sketchPane.brushSize) % 360
        sketchPane.addStrokeNode(
          sketchPane.brushColor.r,
          sketchPane.brushColor.g,
          sketchPane.brushColor.b,
          sketchPane.brushSize,
          sketchPane.brushOpacity,
          x,
          y,
          1.0, // pressure
          angle, // angle
          0, // tilt
          sketchPane.brush,
          0, // grainOffset
          0, // grainOffset
          sketchPane.strokeContainer
        )
      }

      let origin
      let m
      let spacing

      // Line #1
      origin = [px, py]
      m = 3 / 400
      spacing = 1
      for (let x = 0; x <= 400; x += spacing) {
        let y = m * x
        plot(x + origin[0], y + origin[1])
      }

      // Line #2
      origin = [px, py + 100]
      m = 3 / 400
      spacing = sketchPane.brushSize // 4
      for (let x = 0; x <= 400; x += spacing) {
        let y = m * x
        plot(x + origin[0], y + origin[1])
      }

      // Line #3
      origin = [px, py + 200]
      m = 3 / 400
      spacing = 5
      for (let x = 0; x <= 400; x += spacing) {
        let y = m * x
        plot(x + origin[0], y + origin[1])
      }

      // Line #4
      origin = [px, py + 300]
      m = 3 / 400
      spacing = 10
      for (let x = 0; x <= 400; x += spacing) {
        let y = m * x
        plot(x + origin[0], y + origin[1])
      }
    }
    document.getElementById('plot-lines').addEventListener('click', event => {
      event.preventDefault()
      plotLines()
    })

    document.getElementById('draw-strokes').addEventListener('click', event => {
      event.preventDefault()
      drawStrokes()
    })

    document
      .getElementById('draw-pressure')
      .addEventListener('click', event => {
        event.preventDefault()
        drawPressureLine()
      })

    // const drawPressureWave = (px = 350, py = 400) => {
    //   let end = Math.PI * 2 * 4
    //   let x
    //   let y
    //   let pressure
    //   for (let i = 0; i < end; i++) {
    //     x = px + i * (100 / Math.PI)
    //     y = py + (Math.cos(i) * 50)
    //     pressure = i / end
    //     // sketchPane.addMouseEventAsPoint(fakeEvent({ x, y, pressure }))
    //     // sketchPane.renderLive()
    //     if (i === 0) {
    //       sketchPane.pointerdown(fakeEvent({ x, y, pressure }))
    //     }
    //     sketchPane.pointermove(fakeEvent({ x, y, pressure }))
    //   }
    //   sketchPane.pointerup(fakeEvent({ x, y, pressure }))
    // }

    // a direct sprite test
    const drawSpriteLineTest = (px = 350.5, py = 400.5) => {
      let x
      let y
      // let pressure
      // let step = 0.1
      let t
      let max = 400
      let i = 0
      let nodeSize = 1
      while (i <= max) {
        t = i / max
        x = px + (i * guiState.spriteLineTest.spacing)
        y = py + (t * 0)
        // pressure = t

        // eslint-disable-next-line new-cap
        let sprite = new PIXI.Sprite.from(
          sketchPane.brushes.brushResources.resources[sketchPane.brush.settings.brushImage].texture.clone()
        )

        let iS = Math.ceil(nodeSize)
        x -= iS / 2
        y -= iS / 2
        sprite.x = Math.floor(x)
        sprite.y = Math.floor(y)
        // sprite.anchor.set(0.5)
        sprite.width = iS
        sprite.height = iS
        sketchPane.strokeContainer.addChild(sprite)

        let dX = x - sprite.x
        let dY = y - sprite.y
        let dS = nodeSize / sprite.width

        let filter = new PIXI.Filter(
          null,
          `
          varying vec2 vTextureCoord;
          varying vec2 vFilterCoord;
          uniform sampler2D uSampler;
          uniform vec2 u_offset_px;
          uniform float u_node_scale;
          uniform vec4 filterArea;
          uniform vec2 dimensions;
          uniform vec4 filterClamp;
          vec2 mapCoord (vec2 coord) {
            coord *= filterArea.xy;
            return coord;
          }

          vec2 unmapCoord (vec2 coord) {
            coord /= filterArea.xy;
            return coord;
          }
          vec2 scale (vec2 v, vec2 _scale) {
            mat2 m = mat2(_scale.x, 0.0, 0.0, _scale.y);
            return m * v;
          }
          void main (void) {
            vec3 PINK = vec3(1., 0., 1.);

            vec2 coord = mapCoord(vTextureCoord) / dimensions;

            coord -= 0.5;
            coord *= u_node_scale;
            coord += 0.5;

            // translate by the subpixel
            coord -= u_offset_px / dimensions;

            coord = unmapCoord(coord) * dimensions;

            if (coord == clamp(coord, filterClamp.xy, filterClamp.zw)) {
              vec4 sample = texture2D(uSampler, coord);
              gl_FragColor = vec4(PINK, 1.0) * sample.r;
            } else {
              gl_FragColor = vec4(0.);
            }

            // to diagnose
            // vec4 sample = texture2D(uSampler, coord);
            // gl_FragColor = sample;
          }
          `,
          {
            u_offset_px: { type: 'vec2', value: [0.0, 0.0] },
            u_node_scale: { type: '1f', value: 1.0 },
            dimensions: { type: 'vec2', value: [0.0, 0.0] }
          })
        filter.apply = (filterManager, input, output, clear) => {
          filter.uniforms.dimensions[0] = input.sourceFrame.width
          filter.uniforms.dimensions[1] = input.sourceFrame.height
          filterManager.applyFilter(filter, input, output, clear)
        }
        filter.padding = guiState.spriteLineTest.padding // for pixel offset
        filter.autoFit = false

        filter.uniforms.u_offset_px = [dX, dY]
        filter.uniforms.u_node_scale = 1.0 / dS

        sprite.filters = [filter]

        i += nodeSize
        nodeSize += guiState.spriteLineTest.scale
      }
    }

    const drawPressureLine = (px = 350, py = 400) => {
      let x
      let y
      let pressure
      let steps = 10
      let t
      for (let i = 0; i <= steps; i += 1) {
        t = i / steps
        x = t * 600 + px
        y = t * 1 + py
        pressure = t
        if (t === 0) {
          sketchPane.pointerdown(fakeEvent({ x, y, pressure }))
        }
        sketchPane.pointermove(fakeEvent({ x, y, pressure }))
        if (t === 1) {
          sketchPane.pointerup(fakeEvent({ x, y, pressure }))
        }
      }
    }

    const drawNodeTest = (state) => {
      let x = Math.floor(sketchPane.sketchpaneContainer.width / 2)
      let y = Math.floor(sketchPane.sketchpaneContainer.height / 2)

      sketchPane.addStrokeNode(
        sketchPane.brushColor.r,
        sketchPane.brushColor.g,
        sketchPane.brushColor.b,
        sketchPane.brushSize,
        sketchPane.brushOpacity,
        x + guiState.nodeTest.offsetX,
        y + guiState.nodeTest.offsetY,
        state.pressure, // pressure
        state.angle, // angle
        0, // tilt
        sketchPane.brush,
        0, // grainOffset
        0, // grainOffset
        guiState.nodeTest.container
      )
    }

    const drawTexturedBackgroundTest = (state) => {
      let container = guiState.drawTexturedBackgroundTest.container

      container.removeChildren()
      for (let child of container.children) {
        child.destroy({
          children: true,

          texture: false,
          baseTexture: false
        })
      }

      let sprite = PIXI.Sprite.from(sketchPane.grainImageSprites[sketchPane.brush.settings.grainImage].texture)
      container.addChild(sprite)
    }

    /*
    setTimeout(() => {
      // sketchPane.brushSize = 8

      // sketchPane.brush = sketchPane.brushes.brushes.watercolor
      // sketchPane.brushSize = 75
      // sketchPane.brushOpacity = 0.4
      // sketchPane.brushColor = { r: 0.8, g: 0.8, b: 1 }
      // drawPressureWave(550, 350)

      // sketchPane.brush = sketchPane.brushes.brushes.watercolor
      // sketchPane.brushSize = 75
      // sketchPane.brushOpacity = 0.4
      // sketchPane.brushColor = { r: 0.8, g: 0.8, b: 1 }
      // drawPressureLine(550, 350)

      // let p1 = sketchPane.strokeContainer.toGlobal({
      //   x: (sketchPane.sketchpaneContainer.width - 400) / 2,
      //   y: (sketchPane.sketchpaneContainer.height - 400) / 2
      // })
      // plotLines(p1.x, p1.y)

      // sketchPane.brush = sketchPane.brushes.brushes.watercolor
      // sketchPane.brushSize = 50
      // sketchPane.brushOpacity = 0.4
      // sketchPane.brushColor = { r: 0.8, g: 0.8, b: 1 }
      // plotLines(550, 450)

      // draw a line from center with pressure
      // ;(function () {
      //   let { x, y } = sketchPane.strokeContainer.toGlobal({
      //     x: sketchPane.sketchpaneContainer.parent.width / 2 - 540 / 2,
      //     y: sketchPane.sketchpaneContainer.parent.height / 2
      //   })
      //   sketchPane.brushSize = 10
      //   sketchPane.brush.settings.spacing = 0.5
      //   drawPressureLine(x, y)
      // })()
    }, 10)
    */

    let onRender

    let guiState = {
      brush: sketchPane.brush.settings.name,

      nodeTest: {
        enabled: false,
        container: sketchPane.liveStrokeContainer,

        offsetX: 0,
        offsetY: 0,

        pressure: 1.0,
        angle: 45
      },

      pressureLineTest: {
        enabled: false
      },

      spriteLineTest: {
        enabled: false,
        spacing: 0.5,
        scale: 0.4,
        padding: 1
      },

      plotLineTest: {
        enabled: false
      },

      delayedTextureRenderTest: {
        enabled: false
      },

      drawTexturedBackgroundTest: {
        enabled: false,
        container: sketchPane.sketchpaneContainer.addChild(new PIXI.Container())
      },

      calculated: {
        color: { r: sketchPane.brushColor.r * 255, g: sketchPane.brushColor.g * 255, b: sketchPane.brushColor.b * 255 }
      }
    }
    const initGUI = (gui) => {
      let sketchPaneFolder = gui.addFolder('sketchPane')
      sketchPaneFolder.add(guiState, 'brush')
        .options(Object.keys(sketchPane.brushes.brushes))
        .onChange(function (value) {
          sketchPane.brush = sketchPane.brushes.brushes[value]
        })
      sketchPaneFolder.add(sketchPane, 'brushSize', 0.5, 256).listen()
      sketchPaneFolder.add(sketchPane, 'brushSize', 0.5, 16).name('brushSize (fine)').listen()
      sketchPaneFolder.add(sketchPane, 'brushOpacity', 0, 1.0).listen()
      // sketchPaneFolder.add(sketchPane.brushColor, 'r', 0, 1.0).name('brushColor (r)').listen()
      // sketchPaneFolder.add(sketchPane.brushColor, 'g', 0, 1.0).name('brushColor (g)').listen()
      // sketchPaneFolder.add(sketchPane.brushColor, 'b', 0, 1.0).name('brushColor (b)').listen()
      sketchPaneFolder.open()

      let brushSettingsFolder = gui.addFolder('brush.settings')
      brushSettingsFolder.add(sketchPane.brush.settings, 'spacing', 0.001, 8.0).listen()
      brushSettingsFolder.add(sketchPane.brush.settings, 'spacing', 0.001, 1.0).name('spacing (fine)').listen()
      brushSettingsFolder.open()

      let nodeTestFolder = gui.addFolder('node test')
      nodeTestFolder.add(guiState.nodeTest, 'enabled').onChange(function (enabled) {
        if (!enabled) {
          // clear it
          sketchPane.disposeContainer(guiState.nodeTest.container)
        }
      }).listen()
      nodeTestFolder.add(guiState.nodeTest, 'offsetX', -1, 1).step(0.001).listen()
      nodeTestFolder.add(guiState.nodeTest, 'offsetY', -1, 1).step(0.001).listen()
      nodeTestFolder.add(guiState.nodeTest, 'pressure', 0, 1.0).listen()
      nodeTestFolder.add(guiState.nodeTest, 'angle', 0, 360).step(15).listen()
      nodeTestFolder.addColor(guiState.calculated, 'color')
        .onChange(function (value) {
          sketchPane.brushColor.r = value.r / 255
          sketchPane.brushColor.g = value.g / 255
          sketchPane.brushColor.b = value.b / 255
        })
        .listen()
      nodeTestFolder.open()

      let pressureLineTestFolder = gui.addFolder('pressure line test (uses paths)')
      pressureLineTestFolder.add(guiState.pressureLineTest, 'enabled').onChange(function (enabled) {
        if (!enabled) {
          // clear it
          sketchPane.clearLayer()
        }
      }).listen()
      pressureLineTestFolder.open()

      let spriteLineTestFolder = gui.addFolder('sprite line test (no paths)')
      spriteLineTestFolder.add(guiState.spriteLineTest, 'enabled').onChange(function (enabled) {
        if (!enabled) {
          // clear it
          sketchPane.disposeContainer(sketchPane.strokeContainer)
          sketchPane.clearLayer()
        }
      }).listen()
      spriteLineTestFolder.add(guiState.spriteLineTest, 'spacing', 0.001, 2.0).listen()
      spriteLineTestFolder.add(guiState.spriteLineTest, 'scale', 0.001, 2.0).listen()
      spriteLineTestFolder.add(guiState.spriteLineTest, 'padding', 0, 16).step(1).listen()
      spriteLineTestFolder.open()

      let plotLineTestFolder = gui.addFolder('plot line test (rotation)')
      plotLineTestFolder.add(guiState.plotLineTest, 'enabled').onChange(function (enabled) {
        if (!enabled) {
          // clear it
          sketchPane.disposeContainer(sketchPane.strokeContainer)
          sketchPane.clearLayer()
        }
      }).listen()
      plotLineTestFolder.open()

      let delayedTextureRenderTestFolder = gui.addFolder('render-to-texture test (with delay)')
      delayedTextureRenderTestFolder.add(guiState.delayedTextureRenderTest, 'enabled').onChange(function (enabled) {
        if (!enabled) {
          // clear it
          sketchPane.disposeContainer(sketchPane.strokeContainer)
          sketchPane.clearLayer()
        }
      }).listen()
      delayedTextureRenderTestFolder.open()

      let drawTexturedBackgroundTestFolder = gui.addFolder('grain background test')
      drawTexturedBackgroundTestFolder.add(guiState.drawTexturedBackgroundTest, 'enabled').onChange(function (enabled) {
        if (!enabled) {
          if (guiState.drawTexturedBackgroundTest.container) {
            sketchPane.disposeContainer(guiState.drawTexturedBackgroundTest.container)
          }
        }
      }).listen()
      drawTexturedBackgroundTestFolder.open()

      // HACK sync values every 250 msecs
      setInterval(() => {
        guiState.calculated.color = {
          r: sketchPane.brushColor.r * 255,
          g: sketchPane.brushColor.g * 255,
          b: sketchPane.brushColor.b * 255
        }
      }, 250)

      gui.width = 285
      gui.close()

      onRender = elapsed => {
      }

      setInterval(() => {
        if (guiState.drawTexturedBackgroundTest.enabled) {
          drawTexturedBackgroundTest()
        }

        if (guiState.pressureLineTest.enabled) {
          sketchPane.clearLayer()
          drawPressureLine()
        }

        if (guiState.spriteLineTest.enabled) {
          sketchPane.disposeContainer(sketchPane.strokeContainer)
          // sketchPane.clearLayer()
          drawSpriteLineTest()
          // setTimeout(() => {
          //   sketchPane.renderToLayer(
          //     sketchPane.strokeContainer,
          //     sketchPane.layers[sketchPane.layer]
          //   )
          //   sketchPane.disposeContainer(sketchPane.strokeContainer)
          // }, 500)
        }

        if (guiState.plotLineTest.enabled) {
          // clear and draw plot lines to sprites
          sketchPane.disposeContainer(sketchPane.strokeContainer)
          sketchPane.clearLayer()
          let p1 = sketchPane.strokeContainer.toGlobal({
            x: (sketchPane.sketchpaneContainer.width - 400) / 2,
            y: (sketchPane.sketchpaneContainer.height - 400) / 2
          })
          plotLines(p1.x, p1.y)
        }
      }, 100)
    }

    setInterval(() => {
      if (guiState.delayedTextureRenderTest.enabled) {
        // clear and draw plot lines to sprites
        sketchPane.disposeContainer(sketchPane.strokeContainer)
        sketchPane.clearLayer()
        let p1 = sketchPane.strokeContainer.toGlobal({
          x: (sketchPane.sketchpaneContainer.width - 400) / 2,
          y: (sketchPane.sketchpaneContainer.height - 400) / 2
        })
        plotLines(p1.x, p1.y)

        // to detect small pixel shifts on texture render,
        //   wait for a bit, then render to the actual texture
        setTimeout(() => {
          // hacky fix to calculate vFilterCoord properly
          sketchPane.strokeContainer.getLocalBounds()
          sketchPane.liveStrokeContainer.getLocalBounds()
          sketchPane.offscreenContainer.getLocalBounds()

          sketchPane.renderToLayer(
            sketchPane.strokeContainer,
            sketchPane.layers[sketchPane.layer]
          )
          sketchPane.disposeContainer(sketchPane.strokeContainer)
          sketchPane.disposeContainer(sketchPane.offscreenContainer)
        }, 375)
      }

      if (guiState.nodeTest.enabled) {
        sketchPane.clearLayer()
        sketchPane.disposeContainer(guiState.nodeTest.container)
        drawNodeTest(guiState.nodeTest)

        setTimeout(() => {
          // hacky fix to calculate vFilterCoord properly
          sketchPane.strokeContainer.getLocalBounds()
          sketchPane.liveStrokeContainer.getLocalBounds()
          sketchPane.offscreenContainer.getLocalBounds()

          sketchPane.renderToLayer(
            guiState.nodeTest.container,
            sketchPane.layers[sketchPane.layer]
          )
          sketchPane.disposeContainer(guiState.nodeTest.container)
          sketchPane.disposeContainer(sketchPane.offscreenContainer)
        }, 250)
      }
    }, 750)

    let start = null
    function animate (timestamp) {
      if (start == null) start = timestamp
      let elapsed = timestamp - start
      stats.begin()
      onRender && onRender(elapsed)
      stats.end()
      window.requestAnimationFrame(animate)
    }

    initGUI(gui)

    //
    //
    // OVERRIDES
    //
    // sketchPane.brushSize = 13
    // sketchPane.brush.settings.spacing = 0.25
    // gui.open()
    sketchPane.brushSize = 32

    window.requestAnimationFrame(animate)
  })
  .catch(err => console.error(err))
