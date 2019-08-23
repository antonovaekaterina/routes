const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: [
        './src/js/index.js',
        './src/scss/main.scss'
    ],
    output: {
        path: path.join(__dirname, "/dist"),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },            
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', 
                    'postcss-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', 
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            },
            {
                test: /\.pug$/,
                use: [
                    'html-loader', 
                    {
                        loader: 'pug-html-loader',
                        options: {
                            pretty: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'main.css'
        }),        
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/pug/index.pug'
        })
    ],
/*     optimization: {
        minimizer: [
            new TerserPlugin(),
            new OptimizeCssAssetsPlugin({})
        ]
    } */
};