const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const ZipPlugin = require('zip-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const version = require(path.resolve(__dirname, "package.json")).version;
const eslintPath = path.join(__dirname, ".eslintrc.js");
const config = {
    entry: {
        index: path.resolve(__dirname, "./app.jsx"),
        vendors: [
            "react",
            "react-dom",
            "react-color",
            "axios",
            "echarts"
            // 'babel-polyfill'
        ]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        chunkFilename: "js/[name].bundle.js",
        filename: "js/[name].bundle.js"
    },
    module: {
        rules: [
            // {
            //   enforce: "pre",
            //   test: /\.js$/,
            //   exclude: /node_modules/,
            //   loader: "eslint-loader",
            //   options: {
            //     configFile:path.join(__dirname, '.eslintrc.js'),
            //     formatter: require("eslint-friendly-formatter"),
            //     // eslintPath: path.join(__dirname, '.eslintrc.js'),
            //     emitError: true
            //   }
            // },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            // {
            //   test: /\.jsx?$/,
            //   loader: ['babel-loader','eslint-loader'],
            //   exclude: /node_modules/,

            // },
            {
                test: /(\.(png|jpg|ttf|woff|svg|eot|gif|bmp)$)/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[path][name].[ext]",
                            outputPath: "resource/"
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
	new CleanWebpackPlugin(["dist","build"]),
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
        //生成模板
        new HtmlWebpackPlugin({
            template: "./template.html",
            filename: "index.html",
            inject: new Date(),
            hash: true
        }),
        //添加代码标注
        new webpack.BannerPlugin("This file is created by bigman"),
        //提取合并共用js库
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendors",
            filename: "js/vendors.[hash:8].min.js"
        }),
	new ZipPlugin({
	    path: "../dist",
            filename: "dashboard-v3-"+version+"-"+new Date().getTime()+".zip",
	    pathPrefix: "dashboard-v3"
	})
    ],
    // devtool: 'eval-source-map',
    devServer: {
        contentBase: "./",
        historyApiFallback: true,
        // hot: true,
        inline: true,
        disableHostCheck: true,
        proxy: {
            "/filename/*": {
                target: "",
                secure: false,
                auth: ""
            }
        }
    }
};
module.exports = config;
