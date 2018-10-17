const path = require("path")
const htmlPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const Dotenv = require("dotenv-webpack")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

const ENV = process.env.NODE_ENV || "development"
const isProd = ENV !== "development"
const output = isProd ? "build" : "public"

module.exports = {
  mode: ENV,
  devtool: "source-map",
  entry: ["./src/index.tsx"],
  output: {
    filename: "[name].[hash].js",
    publicPath: "/",
    path: path.resolve(__dirname, output)
  },
  plugins: [
    new htmlPlugin({ template: "src/index.html" }),
    new Dotenv()
  ].concat(
    isProd
      ? [new CopyWebpackPlugin([{ from: "**/*", to: ".", context: "public" }])]
      : []
  ),
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [new TsconfigPathsPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "[hash].[ext]",
              fallback: "file-loader"
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    historyApiFallback: true
  }
}
