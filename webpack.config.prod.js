const path = require("path");
const webpack = require("webpack");
const fs = require("fs")

const banner = fs.readFileSync(path.resolve(__dirname, "header.txt")).toString();

module.exports = {
    mode: "production",
    optimization: {
        minimize: false
    },
    entry: path.resolve(__dirname, "src", "index.js"),
    output: {
        path: path.resolve(__dirname, "dist", "prod"),
        filename: "bundle.user.js",
    },
    plugins: [
        new webpack.BannerPlugin({
            banner,
            raw: true
        })
    ]
};