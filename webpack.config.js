const path = require('path')

const createConfig = opt => {
  return {
    mode: process.env.MODE,
    entry: {
      'sketch-pane': './src/js/index.js'
    },
    ...opt.optimization ? { optimization: opt.optimization } : {},
    output: {
      filename: opt.output.filename,
      path: path.resolve(__dirname, 'dist'),
      library: 'SketchPane',
      libraryTarget: opt.output.libraryTarget,
      publicPath: '/dist'
    },
    module: {
      rules: [
        {
          test: /\.(glsl|frag|vert)$/,
          loader: 'shader-loader'
        }
      ]
    },
    ...opt.externals ? { externals: opt.externals } : {},
    ...opt.serve ? { serve: opt.serve } : {}
  }
}

module.exports = [
  createConfig({ output: { filename: '[name].browser.js', libraryTarget: 'var' },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      }
    },
    ...process.env.WEBPACK_SERVE
      ? {
        serve: {
          dev: {
            publicPath: '/dist'
          },
          // to force serving development dist/ when production files exist on filesystem
          add: (app, middleware, options) => {
            middleware.webpack()
            middleware.content()
          }
        }
      }
      : {}
  }),
  ...process.env.WEBPACK_SERVE
    ? []
    : [ createConfig({ output: { filename: '[name].common.js', libraryTarget: 'commonjs2' },
      externals: {
        'pixi.js': 'pixi.js',
        'paper': 'paper'
      }
    }) ]
]
