const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CONSTANTS } = require('./../config/constants');
const { AuthUtil } = require('./../Util/auth.util');
const { StoreAuthRepository } = require('../Repositories/storeAuth.repository');

const hashPassword = async (plainPassword) => {
  try {
    if (!plainPassword) {
      throw new Error('Password is required');
    }
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plainPassword, salt);
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    if (!plainPassword || !hashedPassword) {
      throw new Error('Password and hash are required');
    }
    return bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error(`Error verifying password: ${error.message}`);
  }
};

const generateTokens = (
  { userId, storeId, internalUserId, email },
  authType,
  identifierType,
  tokenVersion,
) => {
  const AuthenticationType = CONSTANTS.AuthTypes[authType];

  let id;
  switch (identifierType) {
    case 'storeId':
      id = storeId;
      break;
    case 'internalUserId':
      id = internalUserId;
      break;
    case 'userId':
    default:
      id = userId;
      break;
  }

  const tokenPayload = {
    id,
    email,
    authType: AuthenticationType,
    version: tokenVersion,
  };
  // Access token - 15 minutes
  const accessToken = jwt.sign(
    { ...tokenPayload, type: CONSTANTS.TokenTypes.ACCESS },
    AuthUtil.getJWTSecret(authType),
    { expiresIn: '90d' },
  );
  // Refresh token - 90 days
  const refreshToken = jwt.sign(
    { ...tokenPayload, type: CONSTANTS.TokenTypes.REFRESH },
    AuthUtil.getJWTSecret(authType, true),
    { expiresIn: '90d' },
  );

  return { accessToken, refreshToken };
};

const setCookies = (res, { accessToken, refreshToken }, authType) => {
  const config = CONSTANTS.AuthConfig[authType];
  if (!config) {
    throw new Error(`Invalid auth type: ${authType}`);
  }

  // Access token cookie
  res.cookie(config.accessToken, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    path: '/',
  });

  // Refresh token cookie
  res.cookie(config.refreshToken, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    path: config.refreshPath,
  });
};

const clearCookies = (res, authType) => {
  const config = CONSTANTS.AuthConfig[authType];
  if (!config) {
    throw new Error(`Invalid auth type: ${authType}`);
  }

  // Clear access token cookie
  res.clearCookie(config.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });

  // Clear refresh token cookie
  res.clearCookie(config.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: config.refreshPath,
  });
};

const AuthService = {
  hashPassword,
  verifyPassword,
  generateTokens,
  setCookies,
  clearCookies,
};

module.exports = { AuthService };
