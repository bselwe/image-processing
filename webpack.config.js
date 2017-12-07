const path = require('path');
const webpack = require("webpack");
const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    distPath: path.resolve(__dirname, 'dist'),
    srcPath: path.resolve(__dirname, 'src')
};

module.exports = {
    entry: {
        bundle: './src/index'
    },
    output: {
        filename: "[name].js",
        path: config.distPath
    },
    devServer: {
        contentBase: config.distPath
    },
    devtool: "source-map",
    plugins: [
        new CopyPlugin([{ from: 'public' }]),
        new ExtractTextPlugin({ filename: "styles.css", allChunks: true })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader", use: "css-loader",
                })
            },
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader", use: "css-loader!sass-loader",
                })
            },
            {
                test: /\.html$/,
                use: 'raw-loader'
            }
        ]
    },
    resolve: {
        extensions: [".html", ".tsx", ".ts", ".js"],
        modules: [
            config.srcPath,
            'node_modules'
        ]
    }
};