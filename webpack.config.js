const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackObfuscator = require("webpack-obfuscator");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  const config = {
    entry: "./src/index.ts",
    output: {
      filename: isProduction ? "bundle.[contenthash].js" : "bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "inline-source-map",
    devServer: {
      static: "./dist",
      open: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(mp3|ogg|wav)$/i,
          type: "asset/resource",
          generator: {
            filename: "sounds/[name][ext]",
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "fonts/[name][ext]",
          },
        },
        {
          test: /\.(csv|tsv)$/i,
          use: ["csv-loader"],
        },
        {
          test: /\.xml$/i,
          use: ["xml-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Catch them all",
        template: "src/index.html",
        favicon: "src/img/favicon.ico",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src/sounds"),
            to: "sounds",
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
  };

  if (isProduction) {
    config.plugins.push(
      new WebpackObfuscator(
        {
          rotateStringArray: true,
          stringArray: true,
          stringArrayThreshold: 0.5,
          unicodeEscapeSequence: false,
          renameGlobals: false,
          compact: true,
        },
        ["main.css"],
      ),
    );
  }

  return config;
};
