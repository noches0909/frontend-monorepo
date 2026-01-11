module.exports = {
  extends: "next/core-web-vitals",
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel", { paths: [__dirname] })],
      caller: {
        supportsTopLevelAwait: true
      }
    }
  }
};
