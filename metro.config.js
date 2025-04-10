const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable bridgeless mode
config.serializer = {
  ...config.serializer,
  unstable_enableBridgelessArchitecture: false
};

module.exports = config;