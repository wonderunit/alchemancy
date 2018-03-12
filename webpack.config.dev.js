const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    filename: 'sketch-pane.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'SketchPane',
    libraryTarget: 'var',
    publicPath: '/dist'
  },
  serve: {
    dev: {
      publicPath: '/dist'
    }
  }
}
