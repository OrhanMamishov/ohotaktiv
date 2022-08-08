const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === "development";
const IS_PROD = NODE_ENV === "production";

function setupDevtool() {
  if (IS_DEV) {
    return "eval";
  }
  if (IS_PROD) {
    return false;
  }
}

module.exports = {
  entry: {
    indexEntry: "./src/public/scripts/pages/index.js",
    salesEntry: "./src/public/scripts/pages/sales.js",
    blogEntry: "./src/public/scripts/pages/blog.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/",
    filename: "[name].bundle.js",
    chunkFilename: "[id].bundle_[chunkhash].js",
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|avif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  devtool: setupDevtool(),
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "index.html",
      template: path.resolve(__dirname, "./src/public/index.html"),
      chunks: ["indexEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "sales.html",
      template: path.resolve(__dirname, "./src/public/sales.html"),
      chunks: ["salesEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "blog.html",
      template: path.resolve(__dirname, "./src/public/blog.html"),
      chunks: ["blogEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new CleanWebpackPlugin(),
  ],
};
