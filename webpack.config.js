const { ESBuildPlugin } = require("esbuild-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

const isDevelopment = process.env.NODE_ENV === "development";

const entry = {};
const plugins = [new ESBuildPlugin()];

if (isDevelopment) {
  entry.main = "./playground/index.tsx";
  plugins.push(new HtmlWebpackPlugin());
} else {
  entry.main = "./src/index.tsx";
  entry.register = "./src/register.tsx";
  plugins.push(new CleanWebpackPlugin());
}

module.exports = {
  devtool: isDevelopment ? "eval-source-map" : undefined,
  entry,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "tsx",
              jsxFactory: "h",
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins,
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};
