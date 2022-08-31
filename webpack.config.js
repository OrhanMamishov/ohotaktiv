const path = require("path");
const autoprefixer = require("autoprefixer");
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
    viewblogEntry: "./src/public/scripts/pages/viewblog.js",
    shopsEntry: "./src/public/scripts/pages/shops.js",
    viewshopEntry: "./src/public/scripts/pages/viewshop.js",
    liquidationEntry: "./src/public/scripts/pages/liquidation.js",
    remingtonEntry: "./src/public/scripts/pages/remington.js",
    compareEntry: "./src/public/scripts/pages/compare.js",
    articleEntry: "./src/public/scripts/pages/article.js",
    cardEntry: "./src/public/scripts/pages/card.js",
    catalogEntry: "./src/public/scripts/pages/catalog.js",
    sertEntry: "./src/public/scripts/pages/sert.js",
    cabinetEntry: "./src/public/scripts/pages/cabinet.js",
    partnersEntry: "./src/public/scripts/pages/partners.js",
    vacancyEntry: "./src/public/scripts/pages/vacancy.js",
    licenseEntry: "./src/public/scripts/pages/license.js",
    contactsEntry: "./src/public/scripts/pages/contacts.js",
    requisitesEntry: "./src/public/scripts/pages/requisites.js",
    deliveryEntry: "./src/public/scripts/pages/delivery.js",
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
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer({
                    overrideBrowserslist: ["last 4 version"],
                  }),
                ],
              },
            },
          },
          "sass-loader",
        ],
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
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "viewblog.html",
      template: path.resolve(__dirname, "./src/public/viewblog.html"),
      chunks: ["viewblogEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "shops.html",
      template: path.resolve(__dirname, "./src/public/shops.html"),
      chunks: ["shopsEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "viewshop.html",
      template: path.resolve(__dirname, "./src/public/viewshop.html"),
      chunks: ["viewshopEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "liquidation.html",
      template: path.resolve(__dirname, "./src/public/liquidation.html"),
      chunks: ["liquidationEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "remington.html",
      template: path.resolve(__dirname, "./src/public/remington.html"),
      chunks: ["remingtonEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "compare.html",
      template: path.resolve(__dirname, "./src/public/compare.html"),
      chunks: ["compareEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "article.html",
      template: path.resolve(__dirname, "./src/public/article.html"),
      chunks: ["articleEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "card.html",
      template: path.resolve(__dirname, "./src/public/card.html"),
      chunks: ["cardEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "catalog.html",
      template: path.resolve(__dirname, "./src/public/catalog.html"),
      chunks: ["catalogEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "sert.html",
      template: path.resolve(__dirname, "./src/public/sert.html"),
      chunks: ["sertEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "cabinet.html",
      template: path.resolve(__dirname, "./src/public/cabinet.html"),
      chunks: ["cabinetEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "partners.html",
      template: path.resolve(__dirname, "./src/public/partners.html"),
      chunks: ["partnersEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "vacancy.html",
      template: path.resolve(__dirname, "./src/public/vacancy.html"),
      chunks: ["vacancyEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "license.html",
      template: path.resolve(__dirname, "./src/public/license.html"),
      chunks: ["licenseEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "contacts.html",
      template: path.resolve(__dirname, "./src/public/contacts.html"),
      chunks: ["contactsEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "requisites.html",
      template: path.resolve(__dirname, "./src/public/requisites.html"),
      chunks: ["requisitesEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      // favicon: "src/assets/img/favicon.svg",
      filename: "delivery.html",
      template: path.resolve(__dirname, "./src/public/delivery.html"),
      chunks: ["deliveryEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new CleanWebpackPlugin(),
  ],
};
