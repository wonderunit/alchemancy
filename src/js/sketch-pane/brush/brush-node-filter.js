/* global PIXI */
module.exports = class BrushNodeFilter {
  constructor (fragPath) {
    this.fragPath = fragPath
  }
  async load () {
    return new Promise((resolve, reject) => {
      const loader = new PIXI.loaders.Loader()
      loader.add('brushnode.frag', this.fragPath)
      loader.load((loader, resources) => {
        if (resources['brushnode.frag'].error) {
          reject(resources['brushnode.frag'].error)
        }
        let uniforms = {
          uRed: { type: '1f', value: 0.5 },
          uGreen: { type: '1f', value: 0.5 },
          uBlue: { type: '1f', value: 0.5 },
          uOpacity: { type: '1f', value: 1 },
          uRotation: { type: '1f', value: 0 },
          uBleed: { type: '1f', value: 0 },
          uGrainRotation: { type: '1f', value: 0 },
          uGrainScale: { type: '1f', value: 1 },
          u_size: { type: '1f', value: 100 },
          u_texture_size: { type: '1f', value: 100 },
          u_x_offset: { type: '1f', value: 0 },
          u_y_offset: { type: '1f', value: 0 },
          u_grain_zoom: { type: '1f', value: 1 },
          u_brushTex: { type: 'sampler2D', value: '' },
          u_grainTex: { type: 'sampler2D', value: '' },

          u_offset_px: { type: 'vec2', value: [0, 0] },

          dimensions: { type: 'vec2', value: [0, 0] }
        }
        this.shader = new PIXI.Filter(null, resources['brushnode.frag'].data, uniforms)
        this.shader.padding = 0
        this.shader.blendMode = PIXI.BLEND_MODES.NORMAL

        // via http://www.html5gamedevs.com/topic/29327-guide-to-pixi-v4-filters/
        this.shader.autoFit = false

        resolve(resources['brushnode.frag'])
      })
    })
  }
}
