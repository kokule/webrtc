// 'theme-default.css': './src/theme/default/index.scss'
var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'cheap-module-eval-source-map',
    entry: {
        default: './src/theme/default/index.scss',
        darken: './src/theme/darken/index.scss'
    },
    output: {
        filename: '[name].css'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
            },
            /* config.module.rule('fonts') */
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4096,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'fonts/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.scss']
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new OptimizeCSSAssetsPlugin({})
        // new HtmlWebpackPlugin()
    ]
};
