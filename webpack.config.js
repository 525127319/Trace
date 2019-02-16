var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var TransformModulesPlugin = require('webpack-transform-modules-plugin')
var config = require("./src/config/setfilename");
  
   
module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "./dist", "[hash]"),
     filename: process.env.NODE_ENV === 'production'
      ? config.build.filename
      : config.dev.filename
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {}
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]"
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: "file-loader"
      },
      
    ]
  },
  plugins: [
    new TransformModulesPlugin(),
    new HtmlWebpackPlugin({
      title: "",
      filename: "./index.html",
      template: "./index.html",
      inject: "body",
      favicon: "",
      minify: {
        caseSensitive: false,
        collapseBooleanAttributes: true,
        collapseWhitespace: true
      },
      hash: true,
      cache: true,
      showErrors: true,
      chunks: "",
      chunksSortMode: "auto",
      excludeChunks: "",
      xhtml: false
    })
  ],
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
      'cube-ui': 'cube-ui/lib',
      assets: path.resolve(__dirname, "../src/assets")
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    port: 9099
  },
  performance: {
    hints: false
  }
  // devtool: "#eval-source-map"
};

if (process.env.NODE_ENV === "production") {
  // module.exports.devtool = "#source-map";
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
