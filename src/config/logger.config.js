const path = require('path');

module.exports = {
  staging: {
    name: 'peekabox-be-platform-stag',
    streams: [
      {
        level: 'debug',
        stream: process.stdout,
      },
      {
        level: 'debug',
        path: path.join(__dirname, '..', 'logs', 'staging.log'),
        type: 'rotating-file',
        period: '1d',
        count: 3,
      },
    ],
  },

  production: {
    name: 'peekabox-be-platform-prod',
    streams: [
      {
        level: 'info',
        path: path.join(__dirname, '..', 'logs', 'production.log'),
        type: 'rotating-file',
        period: '1d',
        count: 14,
      },
      {
        level: 'error',
        path: path.join(__dirname, '..', 'logs', 'error.log'),
        type: 'rotating-file',
        period: '1d',
        count: 14,
      },
    ],
  },
};
