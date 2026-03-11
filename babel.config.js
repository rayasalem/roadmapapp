module.exports = (api) => {
  api.cache(true);
  const isWebExport = process.env.VERCEL === '1' || process.env.EXPO_PUBLIC_PLATFORM === 'web';
  const plugins = [];
  if (!isWebExport) {
    try {
      require.resolve('react-native-worklets/plugin');
      plugins.push('react-native-reanimated/plugin');
    } catch (_) {
      // react-native-worklets not installed (e.g. web build) — skip reanimated plugin
    }
  }
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // Fix "Cannot use 'import.meta' outside a module" when script is loaded without type="module"
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins,
  };
};
