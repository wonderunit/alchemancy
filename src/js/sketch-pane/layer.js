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
  pixels () {
    // get pixels as Uint8Array
    // see: http://pixijs.download/release/docs/PIXI.extract.WebGLExtract.html
    return this.renderer.plugins.extract.pixels(this.sprite.texture)
  }
  // get PNG data
  export (index) {
    let pixels = this.pixels()

    // un-premultiply
    Util.arrayPostDivide(pixels)

    return Util.dataURLToFileContents(
      Util.pixelsToCanvas(
        pixels,
        this.width,
        this.height
      ).toDataURL()
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
    this.renderer.clearRenderTexture(this.sprite.texture)
  }
  replace (source, clear = true) {
    this.draw(
      new PIXI.Sprite.from(source), // eslint-disable-line new-cap
      clear
    )
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
