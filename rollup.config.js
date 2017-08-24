import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import eslint from 'rollup-plugin-eslint'

export default [{
  input: './src/index.js',
  output: {
    file: 'dist/promise.es5.js',
    format: 'umd',
    name: 'APromise'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}, {
  input: './src/index.js',
  output: {
    file: 'dist/promise.es.js',
    format: 'es'
  },
  plugins: [
    eslint({
      throwOnError: true,
      throwOnWarning: true,
      include: ['src/**'],
      exclude: ['node_modules/**']
    })
  ]
}]