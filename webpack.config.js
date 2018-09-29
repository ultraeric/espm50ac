const path = require('path');
const webpack = require('webpack');
const _ = require('lodash');
const os = require('os');
const fs = require('fs');
const UglifyEsPlugin = require('uglify-es-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');


/** Shared aliases for building both the backend and frontend JS bundles. **/
const aliases = {
  static: path.resolve(__dirname, './static'),
  src: path.resolve(__dirname, './src'),
  common: path.resolve(__dirname, './src/common'),
  frontend: path.resolve(__dirname, './src/frontend'),
  backend: path.resolve(__dirname, './src/backend'),
  utils: path.resolve(__dirname, './src/shared/utils'),
  shared: path.resolve(__dirname, './src/shared')
};

const optimization = {
  minimize: true
};

function createImageRule() {
  function createSubRule(test, sizes) {
    return {
      test: test,
        loader: 'responsive-loader',
      options: {
      sizes: sizes ? sizes : [10000],
        name: '[path][name]-[hash]-[width].[ext]',
        adapter: require('responsive-loader/sharp')
      }
    }
  }

  return {
    test: /\.(jpe?g|png)$/i,
    oneOf: [
      createSubRule(/headshot/, [200, 300, 400]),
      createSubRule(/slide/, [800, 1200, 1600, 2400]),
      createSubRule(/\.(jpe?g|png)$/i, null)
    ]
  };
}

const mod_client = {
  rules: [
    {
      test: [/\.jsx?$/],
      loader: 'babel-loader',
      exclude: path.resolve(__dirname, 'node_modules'),
      query: { presets:[ 'env', 'react'] }
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader',
      ],
    },
    {
      test: /\.(gif|svg)$/,
      loaders: [
        {
          loader: 'file-loader',
          query: { name:'[path][name]-[hash].[ext]' }
        },
        {
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: { progressive: true },
            optipng: { optimizationLevel: 7 },
            gifsicle: { interlaced: false },
            pngquant: { quality: '65-90', speed: 4 }
          }
        },
      ]
    },
    createImageRule()
  ]
};

const mod = {
  rules: [
    {
      test: [/\.jsx?$/],
      loader: 'babel-loader',
      exclude: path.resolve(__dirname, 'node_modules'),
      query: { presets:[ 'env', 'react'] }
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader',
      ],
    },
    {
      test: /\.(gif|svg)$/,
      loaders: [
        {
          loader: 'file-loader',
          query: { name:'[path][name]-[hash].[ext]', emitFile: false }
        }
      ]
    },
    createImageRule()
  ]
};

const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new UglifyEsPlugin(),
  new webpack.optimize.AggressiveMergingPlugin(),
  new CompressionPlugin({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.js$|\.css$|\.html$/,
    threshold: 10240,
    minRatio: 0.8
  })
];
var plugins_client = plugins.slice();
plugins_client.push(
  new CopyWebpackPlugin([
    {from: path.resolve(__dirname, 'static/images/logos'),
    to: path.resolve(__dirname, 'public/static/images/logos')}
  ])
);


var nodeModules = {'@google-cloud/language': 'commonjs @google-cloud/language'};

fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = [
{
  mode: 'production',
  entry: {bundle: './src/frontend/ClientApp.js'},
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    alias: aliases,
    extensions: [
      '.js', '.jsx', '.css', '.scss'
    ]
  },
  optimization: optimization,
  module: mod_client,
  plugins: plugins_client
},
{
  entry: {
    testServerBundle: './src/backend/testServer.js'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: '/',
    filename: '../deploy/[name].js'
  },
  resolve: {
    alias: aliases,
    extensions: [
      '.js', '.jsx'
    ]
  },
  externals: nodeModules,
  module: mod,
  plugins: plugins
}];
