/* global PIXI */

const fragment = require('./brushnode.frag')

module.exports = class BrushNodeFilter extends PIXI.Filter {
  constructor (grainSprite) {
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
        u_node_scale: { type: 'vec2', value: [0.0, 0.0] },

        dimensions: { type: 'vec2', value: [0.0, 0.0] },

        filterMatrix: { type: 'mat3' }
      }
    )

    this.padding = 0
    this.blendMode = PIXI.BLEND_MODES.NORMAL

    // via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#fitting-problem
    this.autoFit = false

    let grainMatrix = new PIXI.Matrix()

    grainSprite.renderable = false
    this.grainSprite = grainSprite
    this.grainMatrix = grainMatrix
    this.uniforms.u_grainTex = grainSprite._texture
    this.uniforms.filterMatrix = grainMatrix
  }

  // via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#filter-area
  apply (filterManager, input, output, clear) {
    this.uniforms.dimensions[0] = input.sourceFrame.width
    this.uniforms.dimensions[1] = input.sourceFrame.height

    this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.grainMatrix, this.grainSprite)

    filterManager.applyFilter(this, input, output, clear)

    // console.log('filterMatrix', this.uniforms.filterMatrix)

    // to log Filter-added uniforms:
    // let shader = this.glShaders[filterManager.renderer.CONTEXT_UID]
    // if (shader) {
      // console.log('dimensions', this.uniforms.dimensions)
      // console.log('filterArea', shader.uniforms.filterArea)
      // console.log('filterClamp', shader.uniforms.filterClamp)
      // console.log('vFilterCoord', shader.uniforms.vFilterCoord)
    // }
  }
}
