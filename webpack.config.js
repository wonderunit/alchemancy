const path = require('path')

module.exports = {
  mode: process.env.MODE,
  entry: {
    'sketch-pane': './src/js/index.js'
  },
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
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'SketchPane',
    libraryTarget: 'var',
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
  ...process.env.MODE === 'development'
    ? {
      serve: {
        dev: {
          publicPath: '/dist'
        }
      }
    }
    : {}
}
