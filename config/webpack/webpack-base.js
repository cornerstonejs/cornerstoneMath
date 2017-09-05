const path = require('path');
const webpack = require('webpack');
const rootPath = process.cwd();
const context = path.join(rootPath, "src");
const outputPath = path.join(rootPath, 'dist');
const bannerPlugin = require(path.join(__dirname, 'plugins', 'banner.js'));

module.exports = {
  context: context,
  entry: {
    cornerstoneMath: path.join(context, 'index.js')
  },
  target: 'web',
  output: {
    filename: '[name].js',
    library: {
      commonjs: "cornerstone-math",
      commonjs2: "cornerstone-math",
      amd: "cornerstone-math",
      root: 'cornerstoneMath'
    },
    libraryTarget: 'umd',
    path: outputPath,
    umdNamedDefine: true
  },
  devtool: 'source-map',
  externals: {
    jquery: {
      root: '$'
    }
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'eslint-loader',
      options: {
        failOnError: false
      }
    }, {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'babel-loader'
      }]
    }]
  },
  plugins: [
    bannerPlugin()
  ]
};
