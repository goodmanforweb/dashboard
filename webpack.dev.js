const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
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
        chunkFilename: "[name].bundle.js",
        filename: "[name].bundle.js"
        // filename: '[name].bundle[chunkHash:5].js'
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
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            // { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
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
        extensions: [".js", ".jsx", ".ts", ".tsx"],
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
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
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
            filename: "vendors.[hash:8].min.js"
        }),
        // new UglifyJSPlugin({
        //   test: /\.js($|\?)/i,
        //   exclude: /\/node_modules|olaphandle/,
        //   uglifyOptions: {
        //       compress: {
        //           drop_debugger: true,
        //           drop_console: true
        //       }
        //   }
      // }),
    ],
    devtool: "eval-source-map",
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
