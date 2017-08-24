module.exports = config => {
    config.set({
        basePath: '',
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
            'test/test.spec.js',
            'src/index.js'
        ],
        preprocessors: {
            'test/test.spec.js': ['webpack'],
            'src/index.js': ['webpack']
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            reporters: [
                // generates ./coverage/lcov.info
                {type:'lcov', dir: './test/coverage/', subdir: '.'},
                {type: 'text-summary', dir: './test/coverage/' , subdir: '.'}
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
                extensions: ['.js']
            },
            module: {
                rules: [{
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