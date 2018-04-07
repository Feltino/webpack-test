let path = require('path');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let HtmlWebpackPlugin = require('html-webpack-plugin');
let fs = require('fs');
let CopyWebpackPlugin = require('copy-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');

function generateHtmlPlugins(templateDir) {
  let templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    let parts = item.split('.');
    let name = parts[0];
    let extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    })
  })
}

let htmlPlugins = generateHtmlPlugins('./src/html/views')

let conf = {
    entry: [
      './src/js/index.js',
      './src/precss/style.scss',
      './src/precss/main.styl'
    ],
    output: {
      filename: './js/bundle.js',
    },
    devServer: {
        overlay: true
    },
    module: {
      rules: [
          {
              test: /\.js$/,
              include: path.resolve(__dirname, 'src/js'),
              use: {
              loader: 'babel-loader',
              options: {
                  "presets": [
                      "env",
                      "stage-3"
                  ]
              },
              //exclude: '/node_modules/' чтобы не перерабатывал уже прогнанные файлы
              }
          },
          {
              test: /\.(png|jpg|gif)$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {name: 'img/[name].[ext]'}  
                }
              ]
            },
            {
              test: /\.(woff|woff2|eot|ttf|otf)$/,
              use: [
                  {
                      loader: 'file-loader',
                      options: {
                          name: '[path][name].[ext]',
                      }
                  },
              ]
          },
          {
          test: /\.(sass|scss)$/,
          include: path.resolve(__dirname, 'src/precss'),
          use: ExtractTextPlugin.extract({
              use: [{
                  loader: "css-loader",
                  options: {
                  sourceMap: true,
                  minimize: true//,
                  //url: false
                  }
              },
              {
                loader: 'group-css-media-queries-loader'
              },
              {
                  loader: "resolve-url-loader"
              },
              {
                  loader: "sass-loader",
                  options: {
                  sourceMap: true
                  }
              }
              ]
          })
          },
          {
              test: /\.styl$/,
              include: path.resolve(__dirname, 'src/precss'),
              use: ExtractTextPlugin.extract({
                  use: [
                      {
                          loader: 'css-loader',
                          options:{ 
                              sourceMap: true,
                              minimize: true//,
                              //url: false
                           }
                      },
                      {
                          loader: 'group-css-media-queries-loader'
                      },
                      {
                          loader: "resolve-url-loader" 
                      },
                      {
                          loader: 'stylus-loader',
                          options:{ sourceMap: true }  
                      },
                  ]
              })
          },
          {
              test: /\.html$/,
              include: path.resolve(__dirname, 'src/html/includes'),
              use: ['raw-loader']
          },
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new ExtractTextPlugin({
          filename: './css/style.bundle.css',
          allChunks: true,
        }),
      new CopyWebpackPlugin([{
          from: './src/fonts',
          to: './fonts'
        },
        {
          from: './src/favicon',
          to: './favicon'
        },
        {
          from: './src/img',
          to: './img'
        },
        {
          from: './src/uploads',
          to: './uploads'
        }
      ]),
      new LiveReloadPlugin(),
    ].concat(htmlPlugins)
  };

module.exports = (env, options) => {
    let production = options.mode === 'production';
    conf.devtool = production
                    ? false
                    : 'eval-sourcemap';
    return conf;
}
