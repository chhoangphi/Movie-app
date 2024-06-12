module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      "nativewind/babel",
      [
        "module-resolver",
        {
          "root": ["./app","./components"],
          "extensions": [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          "alias": {
            "tests": ["./tests/"],
            "@components": "./components"
          }
        }
      ]
    ]
  };
};
