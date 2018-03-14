const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/js/index.js',
  output: {
    filename: 'sketch-pane.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'SketchPane',
    libraryTarget: 'var',
    publicPath: '/dist',
    module: {
      rules: [
        {
          test: /\.(glsl|frag|vert)$/,
          loader: 'shader-loader'
        }
      ]
    }
  }
}
