const path = require('path')

const createConfig = opt => {
  return {
    mode: process.env.MODE,
    entry: {
      'sketch-pane': './src/ts/index.ts'
    },
    ...opt.optimization ? { optimization: opt.optimization } : {},
    output: {
      filename: opt.output.filename,
      path: path.resolve(__dirname, 'dist'),
      library: 'SketchPane',
      libraryTarget: opt.output.libraryTarget,
      publicPath: '/dist'
    },
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    module: {
      rules: [
        {
          test: /\.(glsl|frag|vert)$/,
          loader: 'shader-loader'
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader'
        }
	    ]
    },
    ...opt.externals ? { externals: opt.externals } : {},
    ...opt.serve ? { serve: opt.serve } : {}
  }
}

const browserConfig = createConfig({ output: { filename: '[name].browser.js', libraryTarget: 'var' },
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
})

const nodeConfig = createConfig({ output: { filename: '[name].common.js', libraryTarget: 'commonjs2' },
  externals: {
    'pixi.js': 'pixi.js',
    'paper': 'paper'
  },
  optimization: {
    minimize: false
  }
})

module.exports = process.env.WEBPACK_SERVE
  // always produce browser output
  ? browserConfig
  // only produce commonjs output if we're not in the dev server mode
  : [ browserConfig, nodeConfig ]
