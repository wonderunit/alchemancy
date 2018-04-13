const PIXI = require('pixi.js')

const Util = require('./util')

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
  export (index) {
    // get pixels as Uint8Array
    // see: http://pixijs.download/release/docs/PIXI.extract.WebGLExtract.html
    let pixels = this.renderer.plugins.extract.pixels(this.sprite.texture)

    // un-premultiply
    Util.arrayPostDivide(pixels)

    // convert to base64 PNG by writing to a canvas
    const canvasBuffer = new PIXI.CanvasRenderTarget(this.width, this.height)
    let canvasData = canvasBuffer.context.getImageData(0, 0, this.width, this.height)
    canvasData.data.set(pixels)
    canvasBuffer.context.putImageData(canvasData, 0, 0)

    // return the bas64 data
    return canvasBuffer.canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '')
  }
  draw (source, clear = false) {
    this.renderer.render(
      source,
      this.sprite.texture,
      clear
    )
  }
  clear () {
    this.renderer.clearRenderTexture(this.sprite.texture)
  }
  // see also: PIXI's `generateTexture`
  replaceTextureWithSelfRender () {
    let rt = PIXI.RenderTexture.create(this.width, this.height)
    this.renderer.render(
      this.sprite,
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
}
