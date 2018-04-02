const path = require('path')

const createConfig = opt => {
  return {
    mode: process.env.MODE,
    entry: {
      'sketch-pane': './src/js/index.js'
    },
    optimization: opt.optimization,
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
    externals: opt.externals,
    ...process.env.WEBPACK_SERVE === 'development'
      ? {
        serve: {
          dev: {
            publicPath: '/dist'
          }
        }
      }
      : {}
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
    }
  }),
  createConfig({ output: { filename: '[name].common.js', libraryTarget: 'commonjs2' },
    externals: {
      'pixi.js': 'pixi.js',
      'paper': 'paper'
    }
  })
]
