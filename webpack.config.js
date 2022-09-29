/* eslint-disable */
const path = require("path");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const fs = require("fs");
const NODE_ENV = process.env.NODE_ENV;
const BUILD = process.env.BUILD;
const IS_DEV = NODE_ENV === "development";
const IS_PROD = NODE_ENV === "production";
const PAGES_DIR = path.join(__dirname, "./src/public");
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter((fileName) => fileName.endsWith(".html"));
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
    index: "./src/public/scripts/pages/index.js",
    sales: "./src/public/scripts/pages/sales.js",
    blog: "./src/public/scripts/pages/blog.js",
    viewblog: "./src/public/scripts/pages/viewblog.js",
    shops: "./src/public/scripts/pages/shops.js",
    viewshop: "./src/public/scripts/pages/viewshop.js",
    liquidation: "./src/public/scripts/pages/liquidation.js",
    remington: "./src/public/scripts/pages/remington.js",
    compare: "./src/public/scripts/pages/compare.js",
    article: "./src/public/scripts/pages/article.js",
    card: "./src/public/scripts/pages/card.js",
    catalog: "./src/public/scripts/pages/catalog.js",
    sert: "./src/public/scripts/pages/sert.js",
    cabinet: "./src/public/scripts/pages/cabinet.js",
    partners: "./src/public/scripts/pages/partners.js",
    vacancy: "./src/public/scripts/pages/vacancy.js",
    license: "./src/public/scripts/pages/license.js",
    contacts: "./src/public/scripts/pages/contacts.js",
    requisites: "./src/public/scripts/pages/requisites.js",
    delivery: "./src/public/scripts/pages/delivery.js",
    opt: "./src/public/scripts/pages/opt.js",
    brands: "./src/public/scripts/pages/brands.js",
    return: "./src/public/scripts/pages/return.js",
    policy: "./src/public/scripts/pages/policy.js",
    history: "./src/public/scripts/pages/history.js",
    cart: "./src/public/scripts/pages/cart.js",
    order: "./src/public/scripts/pages/order.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: BUILD === "dev" ? "../../" : "/",
    filename: "pages/[name]/[name].js",
    chunkFilename: "[id].bundle_[chunkhash].js",
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "./pages/index"),
    },
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
        test: /\.(?:ico|gif|png|jpg|jpeg|avif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[name][ext]",
        },
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext]",
        },
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  devtool: setupDevtool(),
  plugins: [
    new MiniCssExtractPlugin({
      filename: "pages/[name]/[name].css",
    }),
    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          // favicon: "src/assets/img/favicon.svg",
          filename: `pages/${page.replace(".html", "")}/index.html`,
          template: path.resolve(
            __dirname,
            `./src/public/${page.replace(/\.pug/, ".html")}`
          ),
          chunks: [page.replace(".html", "")],
          inject: "head",
          scriptLoading: "blocking",
        })
    ),
    // new HtmlWebpackPlugin({
    //   // favicon: "src/assets/img/favicon.svg",
    //   filename: "pages/[name]/[name].html",
    //   template: path.resolve(__dirname, "./src/public/index.html"),
    //   chunks: ["index"],
    //   inject: "head",
    //   scriptLoading: "blocking",
    // }),
    new CleanWebpackPlugin(),
  ],
};
