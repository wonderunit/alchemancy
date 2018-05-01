module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("pixi.js");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const PIXI = __webpack_require__(0)

module.exports = class Util {
  static rotatePoint (pointX, pointY, originX, originY, angle) {
    return {
      x:
        Math.cos(angle) * (pointX - originX) -
        Math.sin(angle) * (pointY - originY) +
        originX,
      y:
        Math.sin(angle) * (pointX - originX) +
        Math.cos(angle) * (pointY - originY) +
        originY
    }
  }

  static calcTiltAngle (tiltX, tiltY) {
    let angle = Math.atan2(tiltX, tiltY) * (180 / Math.PI)
    let tilt = Math.max(Math.abs(tiltX), Math.abs(tiltY))
    return { angle: angle, tilt: tilt }
  }

  static lerp (value1, value2, amount) {
    amount = amount < 0 ? 0 : amount
    amount = amount > 1 ? 1 : amount
    return value1 + (value2 - value1) * amount
  }

  // via https://github.com/pixijs/pixi.js/pull/4632/files#diff-e38c1de4b0f48ed1293bccc38b07e6c1R123
  // AKA un-premultiply
  static arrayPostDivide (pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
      const alpha = pixels[i + 3]
      if (alpha) {
        pixels[i] = Math.round(Math.min(pixels[i] * 255.0 / alpha, 255.0))
        pixels[i + 1] = Math.round(Math.min(pixels[i + 1] * 255.0 / alpha, 255.0))
        pixels[i + 2] = Math.round(Math.min(pixels[i + 2] * 255.0 / alpha, 255.0))
      }
    }
  }

  static pixelsToCanvas (pixels, width, height) {
    let canvasBuffer = new PIXI.CanvasRenderTarget(width, height)
    let canvasData = canvasBuffer.context.createImageData(width, height)
    canvasData.data.set(pixels)
    canvasBuffer.context.putImageData(canvasData, 0, 0)
    return canvasBuffer.canvas
  }

  static dataURLToFileContents (dataURL) {
    return dataURL.replace(/^data:image\/\w+;base64,/, '')
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const PIXI = __webpack_require__(0)

const Util = __webpack_require__(1)

module.exports = class Layer {
  constructor ({ renderer, width, height }) {
    this.renderer = renderer
    this.width = width
    this.height = height
    this.sprite = new PIXI.Sprite(PIXI.RenderTexture.create(this.width, this.height))
    this.dirty = false
  }
  getOpacity () {
    return this.sprite.alpha
  }
  setOpacity (opacity) {
    this.sprite.alpha = opacity
  }
  pixels () {
    // get pixels as Uint8Array
    // see: http://pixijs.download/release/docs/PIXI.extract.WebGLExtract.html
    return this.renderer.plugins.extract.pixels(this.sprite.texture)
  }
  toCanvas () {
    let pixels = this.pixels()

    // un-premultiply
    Util.arrayPostDivide(pixels)

    return Util.pixelsToCanvas(
      pixels,
      this.width,
      this.height
    )
  }
  // get data url in PNG format
  toDataURL () {
    return this.toCanvas().toDataURL()
  }
  // get PNG data for writing to a file
  export (index) {
    return Util.dataURLToFileContents(
      this.toDataURL()
    )
  }
  draw (source, clear = false) {
    this.renderer.render(
      source,
      this.sprite.texture,
      clear
    )
  }
  clear () {
    // FIXME why doesn't this work consistently?
    // clear the render texture
    // this.renderer.clearRenderTexture(this.sprite.texture)

    // HACK force clear :/
    this.draw(
      PIXI.Sprite.from(PIXI.Texture.EMPTY),
      true
    )
  }
  replace (source, clear = true) {
    this.draw(
      new PIXI.Sprite.from(source), // eslint-disable-line new-cap
      clear
    )
  }

  // used to draw grids on top of layers
  // source should be an HTMLCanvasElement
  replaceTextureFromCanvas (canvasElement) {
    this.sprite.texture.destroy(true) // prevent canvas caching
    this.sprite.texture = PIXI.Texture.from(canvasElement)
  }

  // write to texture (ignoring alpha)
  // TODO beter name for this?
  rewrite () {
    // temporarily reset the sprite alpha
    let alpha = this.sprite.alpha

    // write to the texture
    this.sprite.alpha = 1.0
    this.replaceTexture(this.sprite)

    // set the sprite alpha back
    this.sprite.alpha = alpha
  }
  // NOTE this will apply any source Sprite alpha (if present)
  // TODO might be a better way to do this.
  //      would be more efficient to .render over sprite instead (with clear:true)
  //      but attempting that resulted in a blank texture.
  // see also: PIXI's `generateTexture`
  replaceTexture (displayObject) {
    let rt = PIXI.RenderTexture.create(this.width, this.height)
    this.renderer.render(
      displayObject,
      rt,
      true
    )
    this.sprite.texture = rt
  }
  // NOTE this is slow
  isEmpty () {
    let pixels = this.renderer.plugins.extract.pixels(this.sprite.texture)
    for (let i of pixels) {
      if (i !== 0) return false
    }
    return true
  }
  getDirty () {
    return this.dirty
  }
  setDirty (value) {
    this.dirty = value
  }

  setVisible (value) {
    this.sprite.visible = value
  }
  getVisible () {
    return this.sprite.visible
  }

  //
  //
  // operations
  //
  flip (vertical = false) {
    let sprite = new PIXI.Sprite(this.sprite.texture)
    sprite.anchor.set(0.5, 0.5)
    if (vertical) {
      sprite.pivot.set(-sprite.width / 2, sprite.height / 2)
      sprite.scale.y *= -1
    } else {
      sprite.pivot.set(sprite.width / 2, -sprite.height / 2)
      sprite.scale.x *= -1
    }
    this.replaceTexture(sprite)
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Layer = __webpack_require__(2)

// see: https://github.com/wesbos/es6-articles/blob/master/54%20-%20Extending%20Arrays%20with%20Classes%20for%20Custom%20Collections.md
module.exports = class LayersCollection extends Array {
  constructor ({ renderer, width, height }) {
    super()
    this.renderer = renderer
    this.width = width
    this.height = height
    this.currentIndex = undefined // index of the current layer
    this.onAdd = undefined
    this.onSelect = undefined
  }
  create () {
    let layer = new Layer({
      renderer: this.renderer,
      width: this.width,
      height: this.height
    })
    this.add(layer)
    return layer
  }
  add (layer) {
    let index = this.length
    this.push(layer)
    layer.index = index
    layer.name = `Layer ${index + 1}`
    layer.sprite.name = layer.name
    this.onAdd && this.onAdd(layer.index)
    return layer
  }
  markDirty (indices) {
    for (let index of indices) {
      this[index].dirty = true
    }
  }
  // getActiveIndices () {
  //   return [...this.activeIndices]
  // }
  // setActiveIndices (indices) {
  //   this.activeIndices = [...indices]
  // }
  getCurrentIndex () {
    return this.currentIndex
  }
  setCurrentIndex (index) {
    this.currentIndex = index
    this.onSelect && this.onSelect(index)
  }
  getCurrentLayer () {
    return this[this.currentIndex]
  }

  //
  //
  // operations
  //
  flip (vertical = false) {
    for (let layer of this) {
      layer.flip(vertical)
    }
  }
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const PIXI = __webpack_require__(0)

module.exports = class Cursor extends PIXI.Sprite {
  constructor (container) {
    super()
    this.container = container

    this.name = 'cursorSprite'

    this.gfx = new PIXI.Graphics()
    this.addChild(this.gfx)

    this.updateSize()
  }
  render (e) {
    let point = this.container.localizePoint(e)
    this.position.set(point.x, point.y)
    this.anchor.set(0.5)
    this.container.app.view.style.cursor = 'none'
  }
  updateSize () {
    let resolution = 1
    let size = this.container.brushSize * 0.7 // optical, approx.

    this.gfx
      .clear()
      // increase bounds (hack to to avoid clipping)
      .lineStyle(resolution, 0xffffff, 0)
      .drawCircle(0, 0, Math.ceil(size * resolution) + (resolution * 2))
      .closePath()
      // increase bounds (smaller white circle)
      .lineStyle(resolution, 0xffffff)
      .drawCircle(0, 0, Math.ceil(size * resolution) - resolution)
      .closePath()
      // increase bounds (actual size black circle)
      .lineStyle(resolution, 0x000000)
      .drawCircle(0, 0, Math.ceil(size * resolution))
      .closePath()

    this.texture = this.gfx.generateCanvasTexture()
  }
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "precision highp float;\n\n// brush texture\nuniform sampler2D uSampler;\n// grain texture\nuniform sampler2D u_grainTex;\n\n// color\nuniform float uRed;\nuniform float uGreen;\nuniform float uBlue;\n\n// node\nuniform float uOpacity;\nuniform float uRotation;\n\n// grain\nuniform float uBleed;\nuniform float uGrainRotation;\nuniform float uGrainScale;\nuniform float u_x_offset;\nuniform float u_y_offset;\n\n// brush\nuniform vec2 u_offset_px;\nuniform vec2 u_node_scale;\n\n// from vert shader\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\n// from PIXI\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 filterClamp;\nuniform mat3 filterMatrix;\n\nvec2 rotate (vec2 v, float a) {\n\tfloat s = sin(a);\n\tfloat c = cos(a);\n\tmat2 m = mat2(c, -s, s, c);\n\treturn m * v;\n}\n\nvec2 scale (vec2 v, vec2 _scale) {\n\tmat2 m = mat2(_scale.x, 0.0, 0.0, _scale.y);\n\treturn m * v;\n}\n\nvec2 mapCoord (vec2 coord) {\n  coord *= filterArea.xy;\n  return coord;\n}\n\nvec2 unmapCoord (vec2 coord) {\n  coord /= filterArea.xy;\n  return coord;\n}\n\nvoid main(void) {\n  // user's intended brush color\n  vec3 color = vec3(uRed, uGreen, uBlue);\n\n\t//\n\t//\n\t// brush\n\t//\n  vec2 coord = mapCoord(vTextureCoord) / dimensions;\n\n\t// translate by the subpixel\n\tcoord -= u_offset_px / dimensions;\n\n  // move space from the center to the vec2(0.0)\n  coord -= vec2(0.5);\n\n  // rotate the space\n  coord = rotate(coord, uRotation);\n\n  // move it back to the original place\n  coord += vec2(0.5);\n\n\t// scale\n\tcoord -= 0.5;\n  coord *= 1.0 / u_node_scale;\n\tcoord += 0.5;\n\n\tcoord = unmapCoord(coord * dimensions);\n\n\t//\n\t//\n\t// grain\n\t//\n\tvec2 fcoord = vFilterCoord;\n\tfcoord -= vec2(u_x_offset, u_y_offset);\n\tfcoord /= uGrainScale;\n\tvec4 grainSample = texture2D(u_grainTex, fract(fcoord));\n\n\t//\n\t//\n\t// set gl_FragColor\n\t//\n\t// clamp (via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#bleeding-problem)\n\tif (coord == clamp(coord, filterClamp.xy, filterClamp.zw)) {\n\t\t// read a sample from the texture\n\t  vec4 brushSample = texture2D(uSampler, coord);\n\t  // tint\n\t  gl_FragColor = vec4(color, 1.);\n\t\tgl_FragColor *= ((brushSample.r * grainSample.r * (1.0+uBleed))- uBleed ) * (1.0+ uBleed) * uOpacity;\n\n\t\t// gl_FragColor = grain;\n\t} else {\n\t\t// don't draw\n\t\tgl_FragColor = vec4(0.);\n\t}\n}\n"

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* global PIXI */

const fragment = __webpack_require__(5)

module.exports = class BrushNodeFilter extends PIXI.Filter {
  constructor (grainSprite) {
    super(
      null,
      fragment,
      {
        // color
        uRed: { type: '1f', value: 0.5 },
        uGreen: { type: '1f', value: 0.5 },
        uBlue: { type: '1f', value: 0.5 },

        // node
        uOpacity: { type: '1f', value: 1 },
        uRotation: { type: '1f', value: 0 },

        // grain
        uBleed: { type: '1f', value: 0 },
        uGrainRotation: { type: '1f', value: 0 },
        uGrainScale: { type: '1f', value: 1 },
        u_x_offset: { type: '1f', value: 0 },
        u_y_offset: { type: '1f', value: 0 },

        // brush
        u_offset_px: { type: 'vec2' },
        u_node_scale: { type: 'vec2', value: [0.0, 0.0] },

        // grain texture
        u_grainTex: { type: 'sampler2D', value: '' },

        // environment (via PIXI and Filter)
        dimensions: { type: 'vec2', value: [0.0, 0.0] },
        filterMatrix: { type: 'mat3' }
      }
    )

    this.padding = 0
    this.blendMode = PIXI.BLEND_MODES.NORMAL

    // via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#fitting-problem
    this.autoFit = false

    let grainMatrix = new PIXI.Matrix()

    grainSprite.renderable = false
    this.grainSprite = grainSprite
    this.grainMatrix = grainMatrix
    this.uniforms.u_grainTex = grainSprite._texture
    this.uniforms.filterMatrix = grainMatrix
  }

  // via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#filter-area
  apply (filterManager, input, output, clear) {
    this.uniforms.dimensions[0] = input.sourceFrame.width
    this.uniforms.dimensions[1] = input.sourceFrame.height

    this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.grainMatrix, this.grainSprite)

    filterManager.applyFilter(this, input, output, clear)

    // console.log('filterMatrix', this.uniforms.filterMatrix)

    // to log Filter-added uniforms:
    // let shader = this.glShaders[filterManager.renderer.CONTEXT_UID]
    // if (shader) {
      // console.log('dimensions', this.uniforms.dimensions)
      // console.log('filterArea', shader.uniforms.filterArea)
      // console.log('filterClamp', shader.uniforms.filterClamp)
      // console.log('vFilterCoord', shader.uniforms.vFilterCoord)
    // }
  }
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

const defaultBrushSettings = {
  // GENERAL
  name: 'default', // Name of the brush preset
  blendMode: 'normal', // Blend mode of the stroke (not node) on the layer
  sizeLimitMax: 1, // UI limit for size
  sizeLimitMin: 0,
  opacityMax: 1, // UI limit for opacity
  opacityMin: 0,

  // STROKE
  spacing: 0, // spacing in between brush nodes

  // TEXTURES
  brushImage: 'brushcharcoal', // Name alias of brush alpha
  brushRotation: 0, // rotation of texture (0,90,180,270)
  brushImageInvert: false, // invert texture
  grainImage: 'graingrid', // Name alias of brush grain texture
  grainRotation: 0,
  grainImageInvert: false,

  // GRAIN
  // TODO rename grain* ?
  movement: 1, // % the grain is offset as the brush moves. 0 static. 100 rolling. 100 is like paper
  scale: 1, // Scale of the grain texture. 0 super tiny, 100 super large
  zoom: 0, // % Scale of the grain texture by the brush size.
  rotation: 0, // % Rotation grain rotation is multiplied by rotation
  randomOffset: true, // on strokeDown, choose a random grain offset

  // STYLUS
  azimuth: true,
  pressureOpacity: 1, // % Pressure affects opacity
  pressureSize: 1, // % Pressure affects size
  pressureBleed: 0, //
  tiltAngle: 0, // % the title angle affects the below params
  tiltOpacity: 1, // % opacity altered by the tilt
  tiltGradiation: 0, // % opacity is gradiated by the tilt
  tiltSize: 1, // % size altered by the tilt

  orientToScreen: true // orient the brush shape to the rotation of the screen
}

module.exports = class Brush {
  constructor (settings) {
    this.settings = Object.assign({}, defaultBrushSettings, settings)
  }
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("paper");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const PIXI = __webpack_require__(0)
const paper = __webpack_require__(8)

const Util = __webpack_require__(1)
const Brush = __webpack_require__(7)
const BrushNodeFilter = __webpack_require__(6)
const Cursor = __webpack_require__(4)

const LayersCollection = __webpack_require__(3)

class SketchPane {
  constructor (options = { backgroundColor: 0xffffff }) {
    this.layerMask = undefined
    this.layerBackground = undefined

    this.images = {
      brush: {},
      grain: {}
    }

    this.viewportRect = undefined

    // callbacks
    this.onStrokeBefore = options.onStrokeBefore
    this.onStrokeAfter = options.onStrokeAfter

    this.setup(options)
    this.setImageSize(options.imageWidth, options.imageHeight)
  }

  setup (options) {
    paper.setup()
    paper.view.setAutoUpdate(false)

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

      backgroundColor: options.backgroundColor,
      // resolution: 2,
      antialias: false
      // powerPreference: 'high-performance'
    })

    this.app.renderer.roundPixels = false

    // this.app.renderer.transparent = true

    this.sketchPaneContainer = new PIXI.Container()
    this.sketchPaneContainer.name = 'sketchPaneContainer'

    // layer
    this.layerContainer = new PIXI.Container()
    this.layerContainer.name = 'layerContainer'
    this.sketchPaneContainer.addChild(this.layerContainer)

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

    this.cursor = new Cursor(this)
    this.sketchPaneContainer.addChild(this.cursor)

    this.app.stage.addChild(this.sketchPaneContainer)
    this.sketchPaneContainer.scale.set(1)
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
    this.sketchPaneContainer.addChild(this.layerMask)

    this.layerBackground = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, this.width, this.height)
      .endFill()
    this.layerBackground.name = 'background'
    this.layerContainer.addChild(this.layerBackground)

    this.eraseMask.texture = PIXI.RenderTexture.create(this.width, this.height)

    this.centerContainer()

    this.layers = new LayersCollection({
      renderer: this.app.renderer,
      width: this.width,
      height: this.height
    })
    this.layers.onAdd = this.onLayersCollectionAdd.bind(this)
    this.layers.onSelect = this.onLayersCollectionSelect.bind(this)
  }

  onLayersCollectionAdd (index) {
    let layer = this.layers[index]

    // layer.sprite.texture.baseTexture.premultipliedAlpha = false
    this.layerContainer.position.set(0, 0)
    this.layerContainer.addChild(layer.sprite)

    this.centerContainer()
  }

  onLayersCollectionSelect (index) {
    this.updateLayerDepths()
  }

  updateLayerDepths () {
    let index = this.layers.getCurrentIndex()

    let selectedLayer = this.layers[index]

    this.layerContainer.setChildIndex(this.layerBackground, 0)

    let childIndex = 1
    for (let layer of this.layers) {
      this.layerContainer.setChildIndex(layer.sprite, childIndex)

      if (layer.sprite === selectedLayer.sprite) {
        this.layer = childIndex - 1
        this.layerContainer.setChildIndex(this.offscreenContainer, ++childIndex)
        this.layerContainer.setChildIndex(this.liveStrokeContainer, ++childIndex)
      }
      childIndex++
    }
  }

  newLayer () {
    return this.layers.create()
  }

  centerContainer () {
    this.sketchPaneContainer.pivot.set(this.width / 2, this.height / 2)
    this.sketchPaneContainer.position.set(
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
    this.sketchPaneContainer.scale.set(scale)

    this.sketchPaneContainer.position.set(
      Math.floor(this.app.renderer.width / 2),
      Math.floor(this.app.renderer.height / 2)
    )

    this.viewportRect = this.app.view.getBoundingClientRect()
  }

  // per http://www.html5gamedevs.com/topic/29327-guide-to-pixi-v4-filters/
  // for each brush, add a sprite with the brush and grain images, so we can get the actual transformation matrix for those image textures
  async loadBrushes ({ brushes, brushImagePath }) {
    this.brushes = brushes.reduce((brushes, brush) => {
      brushes[brush.name] = new Brush(brush)
      return brushes
    }, {})

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

    this.cursor.updateSize()
  }

  // stamp = don't clear texture
  stampStroke (source, layer) {
    layer.draw(source, false)
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
      nodeRotation = angle * Math.PI / 180.0 - this.sketchPaneContainer.rotation
    } else {
      nodeRotation = 0 - this.sketchPaneContainer.rotation
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

  down (e, options = {}) {
    this.pointerDown = true
    this.strokeBegin(e, options)
    this.cursor.render(e)
  }

  move (e) {
    if (this.pointerDown) {
      this.strokeContinue(e)
    }
    this.cursor.render(e)
  }

  up (e) {
    if (this.pointerDown) {
      this.strokeEnd(e)
      this.pointerDown = false
      this.app.view.style.cursor = 'auto'
    }
    this.cursor.render(e)
  }

  strokeBegin (e, options) {
    // initialize stroke state
    this.strokeState = {
      isErasing: !!options.erase,
      // which layers will be stamped / dirtied by this stroke?
      layerIndices: options.erase
        ? options.erase // array of layers which will be erased
        : [this.layers.currentIndex], // single layer dirtied
      points: [],
      path: new paper.Path(),
      lastStaticIndex: 0,
      lastSpacing: undefined,
      grainOffset: this.brush.settings.randomOffset
        ? { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) }
        : { x: 0, y: 0 },

      // snapshot brush configuration
      size: this.brushSize,
      color: this.brushColor,
      opacity: this.brushOpacity
    }

    this.onStrokeBefore && this.onStrokeBefore(this.strokeState)

    this.addPointerEventAsPoint(e)

    // don't show the live container while we're erasing
    if (this.strokeState.isErasing) {
      if (this.liveStrokeContainer.parent) {
        this.liveStrokeContainer.parent.removeChild(this.liveStrokeContainer)
      }
    } else {
      // NOTE only sets liveStrokeContainer.alpha at beginning of stroke
      //      if layer opacity can change during the stroke, we should move this to `drawStroke`
      this.liveStrokeContainer.alpha = this.getLayerOpacity(this.layers.currentIndex)
      this.layerContainer.addChild(this.liveStrokeContainer)
      // TODO can we determine the exact index and use addChildAt instead of brute-force updating all depths?
      this.updateLayerDepths()
    }

    this.drawStroke()
  }

  strokeContinue (e) {
    this.addPointerEventAsPoint(e)
    this.drawStroke()
  }

  strokeEnd (e) {
    this.addPointerEventAsPoint(e)

    this.drawStroke(true) // finalize

    this.disposeContainer(this.liveStrokeContainer)
    this.offscreenContainer.removeChildren()

    this.layers.markDirty(this.strokeState.layerIndices)

    // add the liveStrokeContainer back
    if (this.strokeState.isErasing) {
      this.layerContainer.addChild(this.liveStrokeContainer)
      // TODO can we determine the exact index and use addChildAt instead of brute-force updating all depths?
      this.updateLayerDepths()
    }

    this.onStrokeAfter && this.onStrokeAfter(this.strokeState)
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

    let spacing = Math.max(1, this.strokeState.size * this.brush.settings.spacing)

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

      for (var z = currentSegment; z < segmentLookup.length; z++) {
        if (segmentLookup[z] < i) {
          currentSegment = z
          continue
        }
      }

      let pressure
      let tiltAngle
      let tilt

      if (singlePoint) {
        pressure = strokeInput[currentSegment].pressure
        tiltAngle = strokeInput[currentSegment].tiltAngle
        tilt = strokeInput[currentSegment].tilt
      } else {
        let segmentPercent =
          (i - segmentLookup[currentSegment]) /
          (segmentLookup[currentSegment + 1] - segmentLookup[currentSegment])

        pressure = this.constructor.utils.lerp(
          strokeInput[currentSegment].pressure,
          strokeInput[currentSegment + 1].pressure,
          segmentPercent
        )
        tiltAngle = this.constructor.utils.lerp(
          strokeInput[currentSegment].tiltAngle,
          strokeInput[currentSegment + 1].tiltAngle,
          segmentPercent
        )
        tilt = this.constructor.utils.lerp(
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
        this.strokeState.opacity,
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

  addStrokeNodes (strokeInput, path, strokeContainer) {
    // we have 2+ StrokeInput points (with x, y, pressure, etc),
    // and 2+ matching path segments (with location and handles)
    //  e.g.: strokeInput[0].x === path.segments[0].point.x
    let interpolatedStrokeInput = this.getInterpolatedStrokeInput(strokeInput, path)

    for (let args of interpolatedStrokeInput) {
      this.addStrokeNode(...args, strokeContainer)
    }
  }

  localizePoint (point) {
    return this.sketchPaneContainer.toLocal({
      x: point.x - this.viewportRect.x,
      y: point.y - this.viewportRect.y
    },
    this.app.stage)
  }

  addPointerEventAsPoint (e) {
    let corrected = this.localizePoint(e)

    let pressure = e.pointerType === 'mouse'
      ? e.pressure > 0 ? 0.5 : 0
      : e.pressure

    let tiltAngle = e.pointerType === 'mouse'
      ? { angle: -90, tilt: 37 }
      : this.constructor.utils.calcTiltAngle(e.tiltX, e.tiltY)

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
    this.strokeState.path.smooth({ type: 'catmull-rom', factor: 0.5 }) // centripetal
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

      this.addStrokeNodes(
        this.strokeState.points.slice(a, b + 1),
        new paper.Path(this.strokeState.path.segments.slice(a, b + 1)),
        this.strokeContainer
      )

      // stamp
      if (this.strokeState.isErasing) {
        // stamp to erase texture
        this.updateMask(this.strokeContainer, true)
      } else {
        // stamp to layer texture
        this.stampStroke(
          this.strokeContainer,
          this.layers.getCurrentLayer()
        )
      }
      this.disposeContainer(this.strokeContainer)
      this.offscreenContainer.removeChildren()

      return
    }

    // static
    // do we have enough points to render a static stroke to the texture?
    if (len >= 3) {
      let last = this.strokeState.points.length - 1
      let a = last - 2
      let b = last - 1

      // draw to the static container
      this.addStrokeNodes(
        this.strokeState.points.slice(a, b + 1),
        new paper.Path(this.strokeState.path.segments.slice(a, b + 1)),
        this.strokeContainer
      )

      // stamp
      if (this.strokeState.isErasing) {
        // stamp to the erase texture
        this.updateMask(this.strokeContainer)
      } else {
        // stamp to layer texture
        this.stampStroke(
          this.strokeContainer,
          this.layers.getCurrentLayer()
        )
      }
      this.disposeContainer(this.strokeContainer)
      this.offscreenContainer.removeChildren()

      this.strokeState.lastStaticIndex = b
    }

    // live
    // do we have enough points to draw a live stroke to the container?
    if (len >= 2) {
      this.disposeContainer(this.liveStrokeContainer)

      let last = this.strokeState.points.length - 1
      let a = last - 1
      let b = last

      // render the current stroke live
      if (this.strokeState.isErasing) {
        // TODO find a good way to add live strokes to erase mask
        // this.updateMask(this.liveStrokeContainer)
      } else {
        // store the current spacing
        let tmpLastSpacing = this.strokeState.lastSpacing
        // draw a live stroke
        this.addStrokeNodes(
          this.strokeState.points.slice(a, b + 1),
          new paper.Path(this.strokeState.path.segments.slice(a, b + 1)),
          this.liveStrokeContainer
        )
        // revert the spacing so the real stroke will be correct
        this.strokeState.lastSpacing = tmpLastSpacing
      }
    }
  }

  updateMask (source, finalize = false) {
    // find the top-most active layer
    const descending = (a, b) => b - a
    let layer = this.strokeState.layerIndices
      .map(i => this.layers[i])
      .sort(
        (a, b) => descending(
          a.sprite.parent.getChildIndex(a.sprite),
          b.sprite.parent.getChildIndex(b.sprite)
        )
      )[0]

    // we're starting a new round
    if (!layer.sprite.mask) {
      // add the mask on top of all layers
      this.layerContainer.addChild(this.eraseMask)

      // reset the mask with a solid red background
      let graphics = new PIXI.Graphics()
        .beginFill(0xff0000, 1.0)
        .drawRect(0, 0, this.width, this.height)
        .endFill()
      this.app.renderer.render(
        graphics,
        this.eraseMask.texture,
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
      this.eraseMask.texture,
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
  replaceLayer (index, source, clear = true) {
    index = (index == null) ? this.layers.getCurrentIndex() : index

    this.layers[index].replace(source, clear)
  }

  // DEPRECATED
  getLayerCanvas (index) {
    console.warn('SketchPane#getLayerCanvas is deprecated. Please fix the caller to use a different method.')
    console.trace()
    index = (index == null) ? this.layers.getCurrentIndex() : index

    // #canvas reads the raw pixels and converts to an HTMLCanvasElement
    // see: http://pixijs.download/release/docs/PIXI.extract.WebGLExtract.html
    return this.app.renderer.plugins.extract.canvas(this.layers[index].sprite.texture)
  }

  exportLayer (index, format = 'base64') {
    index = (index == null) ? this.layers.getCurrentIndex() : index

    return this.layers[index].export(format)
  }

  // for given layers,
  // with specified opacity
  // render a composite texture
  // and return as *pixels*
  //
  // NOTE intentionally transparent. we use it to generate large images as well.
  //
  // TODO sort back to front
  // TODO better antialiasing
  // TODO rename extractCompositePixels ?
  // TODO move to LayersCollection ?
  extractThumbnailPixels (width, height, indices = []) {
    let rt = PIXI.RenderTexture.create(width, height)
    for (let layer of this.layers) {
      // if indices are specified, include only selected layers
      if (indices.length && indices.includes(layer.index)) {
        // make a new Sprite from the layer texture
        let sprite = new PIXI.Sprite(layer.sprite.texture)
        // copy the layer's alpha
        sprite.alpha = layer.sprite.alpha
        // resize
        sprite.scale.set(width / this.width, height / this.height)
        this.app.renderer.render(
          sprite,
          rt,
          false
        )
      }
    }
    return this.app.renderer.plugins.extract.pixels(rt)
  }

  clearLayer (index) {
    index = (index == null) ? this.layers.getCurrentIndex() : index

    this.layers[index].clear()
  }

  getNumLayers () {
    return this.layers.length - 1
  }

  // get current layer
  getCurrentLayerIndex (index) {
    return this.layers.getCurrentIndex()
  }

  // set layer by index (0-indexed)
  setCurrentLayerIndex (index) {
    if (this.pointerDown) return // prevent layer change during draw

    this.layers.setCurrentIndex(index)
  }

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

  getLayerOpacity (index) {
    return this.layers[index].getOpacity()
  }

  setLayerOpacity (index, opacity) {
    this.layers[index].setOpacity(opacity)
  }

  getLayerDirty (index) {
    return this.layers[index].getDirty()
  }
  clearLayerDirty (index) {
    this.layers[index].setDirty(false)
  }

  isLayerEmpty (index) {
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

SketchPane.utils = Util

module.exports = SketchPane


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const SketchPane = __webpack_require__(9)
module.exports = SketchPane


/***/ })
/******/ ]);