var ZipPlugin = require('zip-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader'
        }
      }
    ]
  },
  output: {
    filename: 'bundle.js',
  },
  plugins: [
    new ZipPlugin({
      filename: 'final.zip',
    })
  ]
};
