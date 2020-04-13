const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const dirPublic = path.resolve(__dirname, 'public')
const dirSrc = path.resolve(__dirname, 'src')
const dirBuild = path.resolve(__dirname, 'build')

module.exports = {
  entry: path.resolve(dirSrc, 'index.js'),
  output: {
    path: dirBuild,
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: dirBuild,
    host: '0.0.0.0',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: dirPublic }, // to: output.path
    ]),
  ],
  stats: {
    colors: true,
  },
  mode: 'development',
  // Sourcemaps for the bundle
  devtool: 'source-map',
}
