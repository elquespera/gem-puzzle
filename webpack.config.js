const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

const source_folder = 'src';
const dist_folder = 'dist';  

const commonConfig = {
    entry: {
        bundle: path.join(__dirname, source_folder, 'index.js')
    },

    output: {
        path: path.join(__dirname, dist_folder),
        filename: '[name].[contenthash].js',
        clean: true,
        assetModuleFilename: 'assets/[name][ext]'
    },    
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|svg|mp3)$/i,
                type: 'asset'
            },
        ]
    },
    plugins: [
        new ESLintPlugin({
            fix: true,
        }),
        new HtmlPlugin({
            title: 'Gem Puzzle',
            filename: 'index.html',
            template: path.join(source_folder, 'template.html'),
            favicon: path.join(__dirname, source_folder, 'favicon.svg'),
        }),
    ]
}

const developmentConfig =  {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
    },
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, dist_folder)
        },
        liveReload: true,  
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true
    },
    module: {
      rules: [
          {
              test: /\.scss$/,
              use: [
                  'style-loader',
                  'css-loader',
                  'sass-loader'
              ]
          },
        ]
    }
}

const productionConfig =  {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[id].css",
      }),
    ],

    module: {
      rules: [
          {
              test: /\.scss$/,
              use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  'sass-loader'
              ]
          },
        ]
    },
  
    optimization: {
        minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin(),
      ],
    },
}

module.exports = (env, args) => {
    switch(args.mode) {
      case 'development':
        return merge(commonConfig, developmentConfig);
      case 'production':
        return merge(commonConfig, productionConfig);
      default:
        throw new Error('No matching configuration was found!');
    }
}

