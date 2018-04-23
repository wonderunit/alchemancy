const Layer = require('./layer')

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
