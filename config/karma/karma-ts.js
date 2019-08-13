// module.exports = function(config) {
//     config.set({
//         frameworks: ["jasmine", "karma-typescript"],
//         files: [
//             "src/**/*.ts" // *.tsx for React Jsx
//         ],
//         preprocessors: {
//             "**/*.ts": "karma-typescript" // *.tsx for React Jsx
//         },
//         reporters: ["progress", "karma-typescript"],
//         browsers: ["Chrome"]
//     });
// };

module.exports = function(config) {
    config.set({

        basePath: '../../',
        frameworks: ["jasmine", "karma-typescript"],
        plugins: ['karma-jasmine', "karma-typescript",
        'karma-webpack',
        'karma-mocha',
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-coverage'],

        files: [
            // 'test/*_test.ts',
            'test/**/*_test.ts'
        ],

        karmaTypescriptConfig: {
            compilerOptions: {
                module: "commonjs"
            },
            tsconfig: "./tsconfig.json",
        },

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },
        reporters: ["progress", "karma-typescript"],

        // reporters: ["progress", "kjhtml", "spec", "karma-typescript"],

        // browsers: ["Chrome"]
    });
};