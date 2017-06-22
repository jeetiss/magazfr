const {
  addPlugins, performance, defineConstants, createConfig, entryPoint, env, setOutput, sourceMaps, webpack
} = require('@webpack-blocks/webpack2')

const babel = require('@webpack-blocks/babel6')
const devServer = require('@webpack-blocks/dev-server2')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const basePlugins = [
  new HtmlWebpackPlugin({
    inject: true,
    template: './index.html'
  })
]

const productionPlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      comments: false
    },
    screwIe8: true,
    sourceMap: false
  })
]

module.exports = createConfig([
  setOutput('./build/bundle.js'),
  defineConstants({
    'process.env.NODE_ENV': process.env.NODE_ENV || 'development',
    'process.env.SERVER': process.env.SERVER || 'http://localhost:3000',
    'process.env.GMKEY': process.env.GMKEY || 'AIzaSyCPM5heM7Iq3fm0MrDLitsT-PjavDBE8nk'
  }),
  addPlugins(basePlugins),
  env('development', [
    babel({
      plugins: [ 'react-hot-loader/babel' ],
      presets: [
        ['env', {
          'targets': {
            'chrome': 52
          },
          'modules': false
        }],
        'react'
      ]
    }),
    entryPoint('./src/index.dev.js'),
    sourceMaps(),
    devServer(),
    devServer.proxy({
      '/api/*': { target: 'http://localhost:8080' }
    }),
    performance({
      maxAssetSize: 3000000,
      maxEntrypointSize: 3000000
    })
  ]),
  env('production', [
    babel({
      plugins: [],
      presets: [
        ['env', {
          'browsers': ['last 2 versions, not ie > 9, not ie_mob > 9'],
          'modules': false
        }],
        'react'
      ]
    }),
    entryPoint('./src/index.js'),
    addPlugins(productionPlugins)
  ])
])
