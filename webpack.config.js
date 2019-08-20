const path = require("path");

module.exports = [
  {
    entry: "./src/ts/inject/index.ts",
    mode: "development",
    devtool: "none",
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".ts"]
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "distribution/js/inject")
    }
  },
  {
    entry: "./src/ts/options/index.ts",
    mode: "development",
    devtool: "none",
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".ts"]
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "distribution/js/options")
    }
  }
];
