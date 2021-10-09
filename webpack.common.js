/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    background: path.join(__dirname, "src/background.ts"),
    app: path.join(__dirname, "src/index.ts"),
  },

  output: {
    path: path.join(__dirname, "dist/"),
    filename: "[name].js",
  },

  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader",
      },
      {
        test: /\s?css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "images/[hash]-[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "fonts/[hash]-[name].[ext]",
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@src": path.resolve(__dirname, "src/"),
    },
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
        },
      ],
    }),
  ],
};
