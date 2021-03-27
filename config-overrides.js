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

  return config;
};
