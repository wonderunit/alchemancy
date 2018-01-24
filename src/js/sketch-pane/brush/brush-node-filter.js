export default class BrushNodeFilter {

  constructor() {
    const loader = new PIXI.loaders.Loader()
    loader.add("brushnode.frag", "./src/js/sketch-pane/brush/brushnode.frag")
    loader.load((loader, resources) => {
      let uniforms = {
        uRed: {type: '1f', value: 0.5},
        uGreen: {type: '1f', value: 0.5},
        uBlue: {type: '1f', value: 0.5},
        uOpacity: {type: '1f', value: 1},
        uRotation: {type: '1f', value: 0},
        uBleed: {type: '1f', value: 0},
        uGrainRotation: {type: '1f', value: 0},
        uGrainScale: {type: '1f', value: 1},
        u_size: {type: '1f', value: 100},
        u_texture_size: {type: '1f', value: 100},
        u_x_offset: {type: '1f', value: 0},
        u_y_offset: {type: '1f', value: 0},
        u_grain_zoom: {type: '1f', value: 1},
        u_brushTex: {type: 'sampler2D', value: ''},
        u_grainTex: {type: 'sampler2D', value: ''},
      }
      this.shader = new PIXI.Filter(null, resources['brushnode.frag'].data, uniforms)
      //this.shader.autoFit = false
      this.shader.padding = 0
      this.shader.blendMode = PIXI.BLEND_MODES.NORMAL
    })
  }
}
