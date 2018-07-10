const merge = require('./merge');
const baseConfig = require('./webpack-base');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const prodConfig = {
  output: {
    filename: '[name].min.js'
  },
  mode: "production",
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true
      })
    ]
  }
};

module.exports = merge(baseConfig, prodConfig);