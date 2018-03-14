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

        dimensions: { type: 'vec2', value: [0.0, 0.0] }
      }
    )

    this.padding = 0
    this.blendMode = PIXI.BLEND_MODES.NORMAL

    // via http://www.html5gamedevs.com/topic/29327-guide-to-pixi-v4-filters/
    this.autoFit = false
  }

  // TODO move this to sketch-pane.js?
  // via http://www.html5gamedevs.com/topic/29327-guide-to-pixi-v4-filters/
  apply (filterManager, input, output, clear) {
    this.uniforms.dimensions[0] = input.sourceFrame.width
    this.uniforms.dimensions[1] = input.sourceFrame.height

    // TODO use this
    // this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(
    //   new PIXI.Matrix(),
    //   this.brushImageSprites[brush.settings.brushImage]
    // )

    // TODO use this
    // this.uniforms.grainFilterMatrix = filterManager.calculateSpriteMatrix(
    //   new PIXI.Matrix(),
    //   this.grainImageSprites[brush.settings.grainImage]
    // )

    filterManager.applyFilter(this, input, output, clear)
  }
}
