const path = require('path');
const webpackConfig = require('../webpack');

/* eslint no-process-env:0 */
process.env.CHROME_BIN = require('puppeteer').executablePath();

// Deleting output.library to avoid "Uncaught SyntaxError: Unexpected token /" error
// when running testes (var test/foo_test.js = ...)
delete webpackConfig.output.library;

// Code coverage
webpackConfig.module.rules.push({
  test: /\.js$/,
  include: path.resolve('./src/'),
  loader: 'istanbul-instrumenter-loader',
  query: {
    esModules: true
  }
});

module.exports = {
  basePath: '../../',
  frameworks: ['mocha', 'karma-typescript'],
  reporters: ['karma-typescript', 'progress', 'coverage'],
  files: [
    'src/**/*.ts',
    'test/**/*_test.ts'
  ],

  // karma typescript configuration 
  karmaTypescriptConfig: {
    // tsconfig: "../../tsconfig.json",
    bundlerOptions: {
        // set *.spec.ts files as entrypoints 
        // for correct code coverage
        entrypoints: /_test\.ts$/
    },
    coverageOptions: {
        // exclude the index.ts and *.spec.ts files
        // for correct code coverage
        exclude: [/index\.ts$/, /_test\.ts$/]
    },
    reports: {
        html: "coverage",
        text: ""
    },
    compilerOptions: {
        baseUrl: ".",
    }
  },

  preprocessors: {
    'src/**/*.ts': ['karma-typescript'],
    'test/**/*_test.ts': ['karma-typescript']
  },

  webpack: webpackConfig,

  webpackMiddleware: {
    noInfo: false,
    stats: {
      chunks: false,
      timings: false,
      errorDetails: true
    }
  },

  coverageReporter: {
    dir: './coverage',
    reporters: [
      {type: 'html', subdir: 'html'},
      {type: 'lcov', subdir: '.'},
      {type: 'text', subdir: '.', file: 'text.txt'},
      {type: 'text-summary', subdir: '.', file: 'text-summary.txt'}
    ]
  }
};