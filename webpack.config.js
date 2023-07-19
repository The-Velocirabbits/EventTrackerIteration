const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './client/index.js',
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /.(css|scss)$/,
        exclude: [/node_modules/],
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    //removes all files under output.path and all unused assets after every successful rebuild
    new CleanWebpackPlugin(),
    // we want our bundle.js file to be loaded into an HTMl file
    new HtmlWebpackPlugin({
      //where to inject the bundle.js file
      inject: false,
      template: path.resolve('./client/index.html'),
    }),
    // generates a manifest.json file
    new WebpackManifestPlugin({
      fileName: 'manifest.json',
    }),
  ],
  devServer: {
    host: 'localhost',
    port: 8080,
    hot: false,
    liveReload: false,
    historyApiFallback: true,
    static: {
      // what the public sees so they dont know the path
      publicPath: '/build',
      directory: path.join(__dirname, './build'),
    },
    proxy: {
      //TODO: change to route that you need
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
};
