import Layer from './layer'
import Util from './util'

// see: https://github.com/wesbos/es6-articles/blob/master/54%20-%20Extending%20Arrays%20with%20Classes%20for%20Custom%20Collections.md
export default class LayersCollection extends Array {
  currentIndex: number
  renderer: PIXI.WebGLRenderer
  width: number
  height: number
  onAdd: (x: number) => {}
  onSelect: (x: number) => {}

  [index: number]: any

  // via https://blog.simontest.net/extend-array-with-typescript-965cc1134b3
  private constructor () {
    super()
  }
  static create(params: {
    renderer: PIXI.WebGLRenderer,
    width: number,
    height: number,
    onAdd: (x: number) => any,
    onSelect: (x: number) => any
  }): LayersCollection {
    let layersCollection = Object.create(LayersCollection.prototype)
    layersCollection.renderer = params.renderer
    layersCollection.width = params.width
    layersCollection.height = params.height
    layersCollection.onAdd = params.onAdd
    layersCollection.onSelect = params.onSelect
    return layersCollection
  }

  create (options: any) : Layer {
    let layer = new Layer({
      renderer: this.renderer,
      width: this.width,
      height: this.height,
      ...options
    })
    this.add(layer)
    return layer
  }

  add (layer: Layer) : Layer {
    let index = this.length
    this.push(layer)
    layer.index = index
    this.onAdd && this.onAdd(layer.index)
    return layer
  }

  markDirty (indices: any) {
    for (let index of indices) {
      this[index].setDirty(true)
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

  setCurrentIndex (index: number) {
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
  extractThumbnailPixels (width: number, height: number, indices: Array<number> = []) {
    let rt = PIXI.RenderTexture.create(width, height)
    return this.renderer.plugins.extract.pixels(
      this.generateCompositeTexture(width, height, indices, rt)
    )
  }

  generateCompositeTexture (width: number, height: number, indices: Array<number> = [], rt: PIXI.RenderTexture) {
    for (let layer of this) {
      // if indices are specified, include only selected layers
      if (indices.length && indices.includes(layer.index)) {
        // make a new Sprite from the layer texture
        let sprite = new PIXI.Sprite(layer.sprite.texture)
        // copy the layer's alpha
        sprite.alpha = layer.sprite.alpha
        // resize
        sprite.scale.set(width / this.width, height / this.height)
        this.renderer.render(
          sprite,
          rt,
          false
        )
      }
    }
    return rt
  }

  findByName (name:string) : Layer {
    return this.find(layer => layer.name === name)
  }

  // merge
  //
  // sources is an array of layer indices, ordered back to front
  // destination is the index of the destination layer
  merge (sources: Array<any>, destination: number) {
    let rt = PIXI.RenderTexture.create(this.width, this.height)

    rt = this.generateCompositeTexture(
      this.width,
      this.height,
      sources,
      rt
    )

    // clear destination
    this[destination].clear()

    // stamp composite onto destination
    // TODO would it be better to write raw pixel data?
    // TODO would it be better to destroy layer texture and assign rt as layer texture?
    this[destination].replace(rt)

    // clear the source layers
    for (let index of sources) {
      if (index !== destination) {
        this[index].clear()
      }
    }
  }
}
