var _ = require('lodash');

var config = require('./config/config.common');

if (process.env.ENV === 'production') {
  _.extend(config, require('./config/config.prod'));
} else {
  _.extend(config, require('./config/config.dev'));
}

module.exports = config;