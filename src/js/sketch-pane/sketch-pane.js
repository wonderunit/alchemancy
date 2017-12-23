import Util from "./util.js"
import brushes from './brush/brushes.js'
import BrushNodeFilter from './brush/brush-node-filter.js'

/*

  TODO:

    loadPreview
      load texture
      display

*/

export default class SketchPane {

  constructor() {
    this.setup()
    this.loadLayers(['grid', 'layer01', 'layer02', 'layer03'])
  }

  setup() {
    PIXI.settings.FILTER_RESOLUTION = 2
    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
    PIXI.settings.MIPMAP_TEXTURES = true
    PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.REPEAT
    PIXI.utils.skipHello()

    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight, 
      antialias: false, 
      //antialias: true, 
      //powerPreference: 'high-performance'
    })

    this.app.renderer.roundPixels = false
    this.app.renderer.transparent = false
    document.body.appendChild(this.app.view)

    this.brushes = brushes
    this.brush = this.brushes.brushes.default

    this.color = {r: 0, g: 0, b: 0}
    this.size = 180
    this.opacity = 0.6
    this.brushNodeFilter = new BrushNodeFilter()

    this.sketchpaneContainer = new PIXI.Container()
    this.layerContainer = new PIXI.Container()
    this.sketchpaneContainer.addChild(this.layerContainer)

    this.strokeContainer = new PIXI.Container()
    this.layerContainer.addChild(this.strokeContainer)

    this.app.stage.addChild(this.sketchpaneContainer)
    this.sketchpaneContainer.scale.set(1)

    this.counter = 0

    this.app.ticker.add((e) => {
      this.brushSize = Math.sin(this.counter/30)*400+400
      if (this.spin) {
        this.sketchpaneContainer.rotation += 0.01
        this.sketchpaneContainer.scale.set(Math.sin(this.counter/30)*1+1.8)
      } else {
        this.sketchpaneContainer.rotation = 0
        this.sketchpaneContainer.scale.set(1)
      }
      this.counter++
    })

    this.spin = true
  }

  loadLayers(layers) {
    this.layers = layers

    layers.forEach((layer)=> {
      PIXI.loader.add(layer, './src/img/layers/' + layer + '.png')
      console.log(layer)
    })
    PIXI.loader.load((loader, resources)=>{

      console.log(resources)

      this.width = 1000
      this.height = 800

      let mask = new PIXI.Graphics()
      mask.beginFill(0x0, 1)
      mask.drawRect(0, 0, this.width, this.height)
      mask.endFill()
      this.layerContainer.mask = mask
      this.sketchpaneContainer.addChild(mask)

      this.layers.forEach((layer, index)=> {
        this.layerContainer.position.set(0,0)
        let renderTexture = PIXI.RenderTexture.create(this.width, this.height)
        let renderTextureSprite = new PIXI.Sprite(renderTexture)
        this.app.renderer.render(new PIXI.Sprite(resources[layer].texture), renderTexture)
        this.layerContainer.addChild(renderTextureSprite)
      })

      this.centerContainer()

      this.layer = 2

      this.layerContainer.setChildIndex(this.strokeContainer, this.layer+1)

    })
  }

  centerContainer() {
    this.sketchpaneContainer.pivot.set(this.width/2, this.height/2)
    this.sketchpaneContainer.position.set(this.app.renderer.width/2,this.app.renderer.height/2)
  }

  stampStroke() {
    this.app.renderer.render(this.strokeContainer, this.layerContainer.children[this.layer].texture, false)
  }

  addStrokeNode (r, g, b, size, opacity, x, y, pressure, angle, tilt, brush) {

    let brushNodeSprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    let nodeSize = size
    // = Math.floor(10 + (pressure*100))
    //size = brushSize
    //size = 500
    brushNodeSprite.width = nodeSize
    brushNodeSprite.height = nodeSize

    brushNodeSprite.position = new PIXI.Point(0, 0)

    this.brushNodeFilter.shader.uniforms.uRed = r
    this.brushNodeFilter.shader.uniforms.uGreen = g
    this.brushNodeFilter.shader.uniforms.uBlue = b
    this.brushNodeFilter.shader.uniforms.u_texture_size = Util.nearestPow2(nodeSize)
    this.brushNodeFilter.shader.uniforms.u_size = nodeSize
    this.brushNodeFilter.shader.uniforms.u_x_offset = x
    this.brushNodeFilter.shader.uniforms.u_y_offset = y
    this.brushNodeFilter.shader.uniforms.u_brushTex = brushes.brushResources.resources[brush.settings.brushImage].texture
    this.brushNodeFilter.shader.uniforms.u_grainTex = brushes.brushResources.resources[brush.settings.grainImage].texture
    brushNodeSprite.filters = [this.brushNodeFilter.shader]

    let renderTexture = PIXI.RenderTexture.create(nodeSize, nodeSize)
    this.app.renderer.render(brushNodeSprite, renderTexture)

    let node = new PIXI.Sprite(renderTexture)
    node.position = new PIXI.Point(x, y)
    node.rotation = Math.PI/4/4
    //node.rotation = 0
    node.anchor.set(0.5)

    this.strokeContainer.addChild(node)
  }

  resize() {
    this.app.renderer.resize(window.innerWidth,window.innerHeight)
    this.sketchpaneContainer.position.set(this.app.renderer.width/2,this.app.renderer.height/2)
  }

  pointerdown(e) {
    this.pointerDown = true
  }

  pointerup(e) {
    this.pointerDown = false
    this.stampStroke()
    this.strokeContainer.removeChildren()
  }

  pointermove(e) {
    if (this.pointerDown) {
      let x = (e.x - this.sketchpaneContainer.x)/this.sketchpaneContainer.scale.x + (this.width/2)
      let y = (e.y - this.sketchpaneContainer.y)/this.sketchpaneContainer.scale.y + (this.height/2)
      let corrected = Util.rotatePoint(x, y, this.width/2, this.height/2, -this.sketchpaneContainer.rotation)
      let tiltAngle = Util.calcTiltAngle(e.tiltX, e.tiltY)
      console.log(this.brush)
      this.addStrokeNode(this.color.r, this.color.g, this.color.b, this.size, this.opacity, corrected.x, corrected.y, e.pressure, tiltAngle.angle, tiltAngle.tilt, this.brush)
    }
  }

  setLayer(layer) {
    this.layer = layer
    this.layerContainer.setChildIndex(this.strokeContainer, this.layer+1)
  }

  clearLayer(layer) {
    if (!layer) { layer = this.layer }
    this.app.renderer.render(this.strokeContainer, this.layerContainer.children[layer].texture, true)
  }

}