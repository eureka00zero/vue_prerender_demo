var path = require('path')
var webpack = require('webpack')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var htmlWebpackPlugin = require('html-webpack-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {presets: ['es2015', 'stage-3']}
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir:path.join(__dirname,'src',"static"),//模板index所在位置，指定到文件夹即可
        // Optional - The path your rendered app should be output to.
        // (Defaults to staticDir.)
        outputDir: path.join(__dirname,'dist'),//最终的index生成目录
  
        // Optional - The location of index.html
        //indexPath: path.join(rootPath(`dist/${entry}`)),
  
        // Required - Routes to render.
        routes: [ '/', '/about', ],
  
        // Optional - Allows you to customize the HTML and output path before
        // writing the rendered contents to a file.
        // renderedRoute can be modified and it or an equivelant should be returned.
        // renderedRoute format:
        // {
        //   route: String, // Where the output file will end up (relative to outputDir)
        //   originalRoute: String, // The route that was passed into the renderer, before redirects.
        //   html: String, // The rendered HTML for this route.
        //   outputPath: String // The path the rendered HTML will be written to.
        // }
        // postProcess (renderedRoute) {
        //   // Ignore any redirects.
        //   renderedRoute.route = renderedRoute.originalPath
        //   // Basic whitespace removal. (Don't use this in production.)
        //   renderedRoute.html = renderedRoute.html.split(/>[\s]+</gmi).join('><')
        //   // Remove /index.html from the output path if the dir name ends with a .html file extension.
        //   // For example: /dist/dir/special.html/index.html -> /dist/dir/special.html
        //   if (renderedRoute.route.endsWith('.html')) {
        //     renderedRoute.outputPath = path.join(rootPath(`dist`), renderedRoute.route)
        //   }
  
        //   return renderedRoute
        // },
  
        // Optional - Uses html-minifier (https://github.com/kangax/html-minifier)
        // To minify the resulting HTML.
        // Option reference: https://github.com/kangax/html-minifier#options-quick-reference
        minify: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: true,
          keepClosingSlash: true,
          sortAttributes: true
        },
  
        // Server configuration options.
        // server: {
        //   // Normally a free port is autodetected, but feel free to set this if needed.
        //   port: 8001
        // },
  
        // The actual renderer to use. (Feel free to write your own)
        // Available renderers: https://github.com/Tribex/prerenderer/tree/master/renderers
        renderer: new Renderer({
          // Optional - The name of the property to add to the window object with the contents of `inject`.
        //   injectProperty: '__PRERENDER_INJECTED',
        //   // Optional - Any values you'd like your app to have access to via `window.injectProperty`.
        //   inject: {
        //     foo: 'bar'
        //   },
  
        //   // Optional - defaults to 0, no limit.
        //   // Routes are rendered asynchronously.
        //   // Use this to limit the number of routes rendered in parallel.
        //   maxConcurrentRoutes: 4,
  
        //   // Optional - Wait to render until the specified event is dispatched on the document.
        //   // eg, with `document.dispatchEvent(new Event('custom-render-trigger'))`
        //   renderAfterDocumentEvent: 'custom-render-trigger',
  
          // Optional - Wait to render until the specified element is detected using `document.querySelector`
        //   renderAfterElementExists: 'my-app-element',
  
          // Optional - Wait to render until a certain amount of time has passed.
          // NOT RECOMMENDED
          renderAfterTime: 5000, // Wait 5 seconds.
  
          // Other puppeteer options.
          // (See here: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
        //   headless: false // Display the browser window when rendering. Useful for debugging.
        })
      }),
    new htmlWebpackPlugin({
        template: 'index.html',
        filename: 'test/index.html',
        inject: 'head',
        hash: true
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
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
  ])
}
