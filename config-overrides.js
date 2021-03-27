// See https://www.npmjs.com/package/react-app-rewired
const webpack = require("webpack");

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = [];
  }
  // See https://github.com/microsoft/monaco-editor/issues/82#issuecomment-441501302
  config.plugins.push(
    new MonacoWebpackPlugin({
      languages: ["typescript"],
    })
  );

  // See https://github.com/photonstorm/phaser3-project-template/blob/master/webpack/base.js
  /*
  config.plugins.push(
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    })
  );

  config.module.rules.push({
    test: [/\.vert$/, /\.frag$/],
    use: "raw-loader",
  });
  */

  return config;
};
