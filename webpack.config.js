const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/game.js",

  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },

  devServer: {
    static: [
      {
        directory: path.join(__dirname, "dist"),
      },
      {
        directory: path.join(__dirname, "public"),
      },
    ],
    compress: true,
    port: 9000,
  },
};
