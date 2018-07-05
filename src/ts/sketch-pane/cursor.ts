import * as PIXI from 'pixi.js'

export interface ICursorContainer {
  brushSize: number

  localizePoint(p: {x: number, y: number}): PIXI.Point
}

export class Cursor extends PIXI.Sprite {
  container: ICursorContainer
  _enabled: boolean
  gfx: PIXI.Graphics

  lastPointer: PIXI.Point

  constructor (container: ICursorContainer) {
    super()
    this.container = container

    this.name = 'cursorSprite'

    this.gfx = new PIXI.Graphics()
    // must be added as a child or the coordinates are incorrect
    this.addChild(this.gfx)

    // enabled
    this._enabled = true
    // don't show until at least one update
    this.visible = false

    this.updateSize()
  }

  renderCursor (e: {x: number, y: number}) {
    this.lastPointer.set(e.x, e.y)
    let point = this.container.localizePoint(this.lastPointer)
    this.position.set(point.x, point.y)
    this.anchor.set(0.5)

    // show (only when moved)
    if (this._enabled) {
      this.visible = true
    }
  }

  updateSize () {
    let resolution = 1
    let size = this.container.brushSize * 0.7 // optical, approx.

    let x = Math.ceil((size * resolution) / 2)
    let y = Math.ceil((size * resolution) / 2)

    this.gfx
      .clear()
      // pad to avoid texture clipping (hack)
      .lineStyle(resolution * 2, 0xffffff, 0.001)
      .drawCircle(x, y, Math.ceil(size * resolution) + (resolution * 2))
      .closePath()
      // smaller white circle
      .lineStyle(resolution, 0xffffff)
      .drawCircle(x, y, Math.ceil(size * resolution) - resolution)
      .closePath()
      // actual size black circle
      .lineStyle(resolution, 0x000000)
      .drawCircle(x, y, Math.ceil(size * resolution))
      .closePath()

    // destroy any old texture
    this.texture.destroy(true)
    // render to a canvas
    this.texture = this.gfx.generateCanvasTexture()
    // hacky fix to avoid texture clipping and resize sprite appropriately to texture
    this.getLocalBounds()
    // clear the temporary graphics
    this.gfx.clear()
  }

  setEnabled (value: boolean) {
    this._enabled = value
    // immediately hide when disabled, but wait for mouse move when re-enabled
    if (!this._enabled) this.visible = false
  }

  getEnabled () {
    return this._enabled
  }
}
