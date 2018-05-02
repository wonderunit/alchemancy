const PIXI = require('pixi.js')

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
    this.getLocalBounds() // hacky fix to avoid texture clipping
  }
}
