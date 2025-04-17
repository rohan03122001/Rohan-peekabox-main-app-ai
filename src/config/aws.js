const { SESClient } = require('@aws-sdk/client-ses');
const { CONFIG } = require('./config');
const logger = require('../config/logger');

let sesClient = null;

const initialize = () => {
  try {
    sesClient = new SESClient({
      credentials: {
        accessKeyId: CONFIG.AWS_ACCESS_KEY,
        secretAccessKey: CONFIG.AWS_SECRET_ACCESS_KEY,
      },
      region: CONFIG.AWS_REGION,
    });
    logger.info(
      'AWS SES initialized successfully',
      'AWS_SES_INITIALIZATION',
      'AWS_SES_INITIALIZATION_SUCCESS',
    );
  } catch (error) {
    logger.error(
      'Email trigerr Failed',
      'AWS_SES_INITIALIZATION',
      'AWS_SES_INITIALIZATION_FAILURE',
      error,
    );
    throw error;
  }
};

const getSESClient = () => {
  if (!sesClient) {
    throw new Error('AWS SES client not initialized');
  }
  return sesClient;
};

const AWS = {
  initialize,
  getSESClient,
};

module.exports = {
  AWS,
};
