const PIXI = require('pixi.js')

module.exports = class Cursor extends PIXI.Sprite {
  constructor (container) {
    super(PIXI.Texture.EMPTY)
    this.container = container

    this.name = 'cursorSprite'

    // enabled
    this._enabled = true

    // don't show until at least one move/render
    this.visible = false

    this.canvas = document.createElement('canvas')
    this._parentScale = 1
    this.updateSize()
  }

  render (e) {
    let point = {
      x: e.x - this.container.viewportRect.x,
      y: e.y - this.container.viewportRect.y
    }

    this.position.set(point.x, point.y)
    this.anchor.set(0.5)

    // show (only when moved)
    if (this._enabled) {
      this.visible = true
    }
  }

  // updateSize
  //
  // RE: drawing anti-aliased shapes, see:
  // https://github.com/pixijs/pixi.js/issues/1011
  // https://github.com/pixijs/pixi.js/issues/4509#issuecomment-359339890
  // https://github.com/pixijs/pixi.js/issues/4155
  //
  // FIXME sometimes throws INVALID_VALUE: texSubImage2D: no pixels
  //       see: https://github.com/pixijs/pixi.js/issues/3705
  updateSize () {
    console.log('SketchPane#updateSize _parentScale:', this._parentScale)
    if (!this.container.brushSize) return
    if (!this._enabled) return

    // for smoother antialiasing, draw double size and scale down
    let resolution = 2

    let size = this.container.brushSize / 0.7 // optical, approx.

    // minimum useful cursor size
    size = Math.max(8, size)

    this.context = this.canvas.getContext('2d')
    // update canvas width and height (also clears)
    this.canvas.width = (size * resolution) + (resolution * 2)
    this.canvas.height = (size * resolution) + (resolution * 2)

    // go to the middle of the canvas
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2)

    // 2px of padding to avoid texture clipping
    let radius = (this.canvas.width / 2) - 2

    // this.context.strokeStyle = '#fff'
    // this.context.beginPath()
    // this.context.lineWidth = resolution * 2
    // this.context.arc(0, 0, w - resolution, h - resolution, 0, Math.PI * 2)
    // this.context.stroke()

    // smaller white circle
    this.context.strokeStyle = '#fff'
    this.context.beginPath()
    this.context.lineWidth = resolution
    this.context.arc(0, 0, radius - resolution - resolution, 0, Math.PI * 2)
    this.context.stroke()

    // actual size black circle
    this.context.strokeStyle = '#000'
    this.context.beginPath()
    this.context.lineWidth = resolution
    this.context.arc(0, 0, radius - resolution, 0, Math.PI * 2)
    this.context.stroke()

    this.context.translate(-this.canvas.width / 2, -this.canvas.height / 2)

    this.texture.destroy(true) // prevent canvas caching
    this.texture = PIXI.Texture.from(this.canvas)

    // scale down to anti-alias
    this.scale.set((1 / resolution) * this._parentScale)
  }

  setEnabled (value) {
    this._enabled = value
    if (this._enabled) {
      // NOTE when re-enabled,
      //      we wait for mouse move
      //      before setting visible:true again
    } else {
      // immediately hide when disabled
      this.visible = false
    }
  }

  getEnabled () {
    return this._enabled
  }
}
