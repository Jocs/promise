module.exports = config => {
    config.set({
        basePath: __dirname,
        singleRun: true,
        frameworks: ['jasmine'],
        browsers: ['Chrome'], // PhantomJs 有可能不支持Promise，所以还是使用Chrome了
        files: [
            'test/**/*.spec.js'
        ],
        preprocessors: {
            'test/**/*.spec.js': ['webpack'],
            'src/index.js': 'coverage'
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            reporters: [{
                type:'text-summary'
            }, {
                type: 'html',
                dir: 'test/coverage'
            }, {
                type: 'cobertura',
                subdir: '.',
                dir: 'test/coverage'
            }]
        },
        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-verbose-reporter',
            'karma-chrome-launcher',
            'karma-webpack'
        ],
        port: 9876,
        webpack: {
            resolve: {
                extensions: ['', '.js'],
                modulesDirectories: ['node_modules', 'src']
            },
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel-loader'
                }]
            }
        },
        webpackMiddleware: {
            stats: {
                color: true,
                chunkModules: false,
                modules: false
            }
        }
    })
}