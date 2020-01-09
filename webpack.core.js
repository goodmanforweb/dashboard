const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const ZipPlugin = require('zip-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const version = require(path.resolve(__dirname, "package.json")).version;
const eslintPath = path.join(__dirname, ".eslintrc.js");
const config = {
    entry: {
        index: path.resolve(__dirname, "./corejs/index.js")
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "dashboard.core.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /(\.(png|jpg|ttf|woff|svg|eot|gif|bmp)$)/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            name: "resource/[name].[hash:7].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            corejs: path.resolve("./corejs"),
            components: path.resolve("./corejs/components"),
            page: path.resolve("./dashboard/page"),
            componentsUi: path.resolve("./dashboard/components"),
            resource: path.resolve("./dashboard/resource"),
            util: path.resolve("./dashboard/util"),
            xdux: path.resolve("./dashboard/xdux"),
            submit: path.resolve("./dashboard/submit"),
            reedite: path.resolve("./dashboard/reedite"),
            node_modules: path.resolve("./node_modules")
        }
    },
    plugins: [
	    new CleanWebpackPlugin(["dist"]),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new UglifyJSPlugin({
            test: /\.js($|\?)/i,
            exclude: /\/node_modules/,
            uglifyOptions: {
                compress: {
                    drop_debugger: true,
                    drop_console: true
                }
            }
        }),
        new ExtractTextPlugin("styles.css"),
        //添加代码标注
        new webpack.BannerPlugin("This file is created by bigman")
    ]
};
module.exports = config;
