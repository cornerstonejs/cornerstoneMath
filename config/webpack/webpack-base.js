const path = require('path');
const rootPath = process.cwd();
const context = path.join(rootPath, "src");
const outputPath = path.join(rootPath, 'dist');
const bannerPlugin = require(path.join(__dirname, 'plugins', 'banner.js'));

module.exports = {
  mode: 'development',
  context: context,
  entry: {
    cornerstoneMath: './index.ts'
  },
  target: 'web',
  output: {
    filename: '[name].js',
    library: {
      commonjs: "cornerstone-math",
      amd: "cornerstone-math",
      root: 'cornerstoneMath'
    },
    libraryTarget: 'umd',
    path: outputPath,
    umdNamedDefine: true
  },
  resolve: {
    // Add '.ts' as resolvable extensions.
    extensions: ['.ts'],
    modules: ['./src', 'node_modules']
  },
  // A SourceMap is added as a DataUrl to the bundle.
  devtool: '#inline-source-map',
  // devtool: 'source-map',
  module: {
    rules: [
      // All files with a '.ts' extension will be handled by 'ts-loader'.
      { 
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
    // rules: [{
    //   enforce: 'pre',
    //   test: /\.js$/,
    //   exclude: /(node_modules)/,
    //   loader: 'eslint-loader',
    //   options: {
    //     failOnError: false
    //   }
    // }, {
    //   test: /\.js$/,
    //   exclude: /(node_modules)/,
    //   use: [{
    //     loader: 'babel-loader'
    //   }]
    // }]
  },
  plugins: [
    bannerPlugin()
  ]
};
