const { createClient } = require('redis');
const { CONFIG } = require('./../config/config');
const logger = require('./../config/logger');

const config = {
  host: CONFIG.REDIS_HOST,
  port: CONFIG.REDIS_PORT,
  // TODO: add password for redis
};

let client = null;

const connectRedis = async (retryCount = 0) => {
  client = createClient(config);
  let attempts = 0;
  const maxRetries = 3;

  while (attempts < maxRetries) {
    try {
      await client.connect();

      logger.info(
        'Redis client connected successfully',
        'REDIS_CONNECTED_SUCCESSFULLY',
        'REDIS_CONNECTED_SUCCESSFULLY',
      );

      client.on('error', (error) => {
        logger.error(
          'Failed to connect to redis',
          'REDIS_CONNECTION_FAILURE',
          'REDIS_CONNECTION_FAILURE',
          error,
        );
      });

      return client;
    } catch (error) {
      attempts++;

      logger.error(
        `Redis connection attempt ${attempts} failed`,
        'REDIS_CONNECTION_ERROR',
        'REDIS_CONNECTION_ERROR',
        error,
      );

      if (retryCount < maxRetries) {
        return connectRedis(retryCount + 1);
      }

      throw new Error('All redis connection attempts failed');
    }
  }
};

const set = async (key, value, expirySeconds = null) => {
  try {
    const stringValue =
      typeof value === 'string' ? value : JSON.stringify(value);

    if (expirySeconds) {
      await client.setEx(key, expirySeconds, stringValue);
    } else {
      await client.set(key, stringValue);
    }

    return true;
  } catch (error) {
    logger.error(
      `Failed to set key ${key}`,
      'REDIS_SET_VALUE',
      'REDIS_SET_VALUE_FAILURE',
      error,
    );
    throw error;
  }
};

const get = async (key, parseJson = true) => {
  try {
    const value = await client.get(key);

    if (value === null) {
      return null;
    }

    return parseJson ? JSON.parse(value) : value;
  } catch (error) {
    logger.error(
      `Failed to get key ${key}`,
      'REDIS_GET_VALUE',
      'REDIS_GET_VALUE_FAILURE',
      error,
    );
    throw error;
  }
};

const del = async (key) => {
  try {
    await client.del(key);
    return true;
  } catch (error) {
    logger.error(
      `Failed to delete key ${key}`,
      'REDIS_DELETE_VALUE',
      'REDIS_DELETE_VALUE_FAILURE',
      error,
    );
    throw error;
  }
};

async function exists(key) {
  try {
    const exists = await client.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error(
      `Failed to check ${key} existence`,
      'REDIS_EXISTS_VALUE',
      'REDIS_EXISTS_VALUE_FAILURE',
      error,
    );
    throw error;
  }
}

const getDel = async (key) => {
  try {
    const value = await client.getDel(key);
    return value;
  } catch (error) {
    logger.error(
      `Failed to get and delete key ${key}`,
      'REDIS_GET_DELETE_VALUE',
      'REDIS_GET_DELETE_VALUE_FAILURE',
      error,
    );
    throw error;
  }
};

const Redis = {
  connectRedis,
  get,
  set,
  del,
  getDel,
  exists,
};

module.exports = {
  Redis,
};
