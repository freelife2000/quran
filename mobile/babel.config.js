/**
 * Babel Configuration for React Native + TypeScript
 */

module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { lazyImports: true }],
    ],
  };
};
