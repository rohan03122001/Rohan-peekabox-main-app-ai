const { CONFIG } = require('./../config/config');
const { CONSTANTS } = require('./../config/constants');

const getJWTSecret = (authType, isRefresh = false) => {
  const secretMap = {
    [CONSTANTS.AuthTypes.USER]: {
      access: CONFIG.USER_JWT_SECRET,
      refresh: CONFIG.USER_REFRESH_SECRET,
    },
    [CONSTANTS.AuthTypes.STORE]: {
      access: CONFIG.STORE_JWT_SECRET,
      refresh: CONFIG.STORE_REFRESH_SECRET,
    },
    [CONSTANTS.AuthTypes.ADMIN]: {
      access: CONFIG.ADMIN_JWT_SECRET,
      refresh: CONFIG.ADMIN_REFRESH_SECRET,
    },
  };

  const config = secretMap[authType];
  if (!config) {
    throw new Error(`Invalid auth type: ${authType}`);
  }

  const secret = isRefresh ? config.refresh : config.access;
  if (!secret) {
    throw new Error(
      `Secret not found for ${authType} ${isRefresh ? 'refresh' : 'access'} token`,
    );
  }

  return secret;
};

const getAuthTypeFromPath = (path) => {
  if (path.includes('/api/v1/users/')) {
    return CONSTANTS.AuthTypes.USER;
  }

  if (path.includes('/api/v1/stores/')) {
    return CONSTANTS.AuthTypes.STORE;
  }

  if (path.includes('/api/v1/internal/')) {
    return CONSTANTS.AuthTypes.ADMIN;
  }

  throw new Error('Invalid auth path');
};

const AuthUtil = {
  getJWTSecret,
  getAuthTypeFromPath,
};

module.exports = {
  AuthUtil,
};
