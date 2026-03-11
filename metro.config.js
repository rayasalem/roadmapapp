const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const projectRoot = __dirname;

// Use AppEntry.web.js for web bundle so serverBootstrap is never included
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isAppEntry =
    platform === 'web' &&
    (moduleName === 'expo/AppEntry.js' ||
      moduleName === './expo/AppEntry.js' ||
      moduleName.replace(/\\/g, '/').endsWith('expo/AppEntry.js'));
  if (isAppEntry) {
    const webEntry = path.join(projectRoot, 'expo', 'AppEntry.web.js');
    return { type: 'sourceFile', filePath: webEntry };
  }
  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
