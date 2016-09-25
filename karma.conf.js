module.exports = config => {
    config.set({
        basePath: __dirname,
        singleRun: true,
        frameworks: ['jasmine'],
        browsers: ['PhantomJS', 'PhantomJS_custom'],

        // you can define custom flags
        customLaunchers: {
          'PhantomJS_custom': {
            base: 'PhantomJS',
            options: {
              windowName: 'my-window',
              settings: {
                webSecurityEnabled: false
              },
            },
            flags: ['--load-images=true'],
            debug: true
          }
        },

        phantomjsLauncher: {
          // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
          exitOnResourceError: true
        },
        files: [
            'test/**/*.spec.js'
        ],
        preprocessors: {
            'test/**/*.spec.js': ['webpack'],
            'src/index.js': 'coverage'
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            reporters: [
                // generates ./coverage/lcov.info
                {type:'lcovonly', subdir: '.'},
                // generates ./coverage/coverage-final.json
                {type:'json', subdir: '.'},
                {type: 'text-summary', subdir: '.'}
            ]
        },
        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-verbose-reporter',
            'karma-phantomjs-launcher',
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