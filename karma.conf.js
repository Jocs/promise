module.exports = config => {
    config.set({
        basePath: __dirname,
        singleRun: true,
        frameworks: ['jasmine'],
        reporters: ['dots'],
        browsers: ['Chrome'], // PhantomJs 有可能不支持Promise，所以还是使用Chrome了
        files: [
            'test/**/*.spec.js'
        ],
        preprocessors: {
            'test/**/*.spec.js': ['webpack']
        },
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