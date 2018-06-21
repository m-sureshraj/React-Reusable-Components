'use strict';

const webpack = require('webpack');
const glob = require('glob');
const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const HtmlWebpackHardDiskPlugin = require('html-webpack-harddisk-plugin');

// initialize html_webpack_plugin
const html_webpack_plugin_config = new HtmlWebpackPlugin({
    template: join(__dirname, 'public', 'index.html'),
    filename: join(__dirname, 'dist', 'index.html'),
    inject: 'body',
    alwaysWriteToDisk: true
});

// this plugin extract css as a separate file from bundle js
const extract_text_plugin_config = new ExtractTextPlugin({
    filename: 'css/[name].css'
});

// remove unused css
// { nodir: true } don't match the root dir's
const purify_css_plugin = new PurifyCSSPlugin({
    paths: glob.sync(join(__dirname, 'src', '**', '*'), { nodir: true })
});

module.exports = {
    // https://webpack.js.org/configuration/devtool/
    devtool: 'eval-source-map',

    // Where to start bundling
    entry: {
        app: [join(__dirname, 'src', 'index.js')]
    },

    // where to output
    output: {
        path: join(__dirname, 'dist', 'assets'),
        filename: 'js/[name].js',
        publicPath: '/assets/'
    },

    // resolve encountered imports
    module: {
        rules: [
            // bundle js
            { test: /\.(js|jsx)$/, exclude: /node_modules/, use: 'babel-loader' },
            // bundle css
            {
                test: /\.css$/,
                use: extract_text_plugin_config.extract({
                    use: 'css-loader',
                    fallback: 'style-loader',
                })
            },
            // bundle fonts
            {
                test: /\.(eot|ttf|woff|woff2|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }
            },
            // bundle img's
            {
                test: /\.(jpg|png|svg|gif)$/,
                include: join(__dirname, 'public', 'assets', 'img'),
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000, // if file is less then 10kb inline the img
                        name: 'img/[name].[ext]'
                    }
                }
            }
        ]
    },

    devServer: {
        contentBase: join(__dirname, 'dist'),
        inline: true,
        port: 3000,
        publicPath: '/assets/'
    },

    plugins: [
        html_webpack_plugin_config,
        new HtmlWebpackHardDiskPlugin(),
        extract_text_plugin_config,
        purify_css_plugin,
        new webpack.HotModuleReplacementPlugin(),
        // bundle vendor related code separately
        // https://survivejs.com/webpack/building/bundle-splitting/
        new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: ({ resource }) => (
                resource &&
                resource.indexOf('node_modules') >= 0 &&
                resource.match(/\.js$/)
            )
        })
    ]
};