/* global PIXI */

const fragment = require('./brushnode.frag')

module.exports = class BrushNodeFilter extends PIXI.Filter {
  constructor () {
    super(
      null,
      fragment,
      {
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

        u_offset_px: { type: 'vec2' },
        u_brush_size: { type: 'vec2', value: [0.0, 0.0] },

        dimensions: { type: 'vec2', value: [0.0, 0.0] }
      }
    )

    this.padding = 2
    this.blendMode = PIXI.BLEND_MODES.NORMAL

    // via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#fitting-problem
    this.autoFit = false
  }

  // via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#filter-area
  apply (filterManager, input, output, clear) {
    this.uniforms.dimensions[0] = input.sourceFrame.width
    this.uniforms.dimensions[1] = input.sourceFrame.height
    filterManager.applyFilter(this, input, output, clear)
  }
}
