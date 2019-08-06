const path = require('path');

module.exports = {
  webpack(config, _options) {
    config.resolve.alias['components'] = path.join(__dirname, 'components');
    config.resolve.alias['lib'] = path.join(__dirname, 'lib');
    config.resolve.alias['pages'] = path.join(__dirname, 'pages');
    return config;
  },
};
