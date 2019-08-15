const path = require('path');
require('dotenv').config();

module.exports = {
  env: {
    graphqlUrl: process.env.GRAPHQL_URL,
    itemsPerPage: 4,
  },
  webpack(config, _options) {
    config.resolve.alias['components'] = path.join(__dirname, 'components');
    config.resolve.alias['lib'] = path.join(__dirname, 'lib');
    config.resolve.alias['pages'] = path.join(__dirname, 'pages');
    return config;
  },
};
