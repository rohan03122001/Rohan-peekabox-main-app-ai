const jwt = require('jsonwebtoken');
const { CONSTANTS } = require('../config/constants');
const { ClientErrors } = require('../errors/clientErrors');
const { AuthService } = require('../Services/auth.service');
const { AuthUtil } = require('../Util/auth.util');
const { StoreAuthRepository } = require('../Repositories/storeAuth.repository');
const {
  InternalUserRepository,
} = require('../Repositories/internalUser.repository');

const setAuthType = (req, res, next) => {
  const path = AuthUtil.getAuthTypeFromPath(req.originalUrl);
  req.authType = path;
  next();
};

const authenticateUserToken = async (req, res, next) => {
  try {
    const path = AuthUtil.getAuthTypeFromPath(req.originalUrl);
    req.authType = path;
    const accessToken =
      req.cookies[CONSTANTS.AuthConfig[req.authType].accessToken];

    if (!accessToken) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        AuthUtil.getJWTSecret(req.authType),
      );
      req.user = decoded;
      return next();
    } catch (error) {
      // 3. If access token is expired, try refresh flow
      if (error instanceof jwt.TokenExpiredError) {
        // Get refresh token from cookie
        const refreshToken =
          req.cookies[CONSTANTS.AuthConfig[req.authType].refreshToken];

        if (!refreshToken) {
          throw new ClientErrors.RefreshTokenNotFoundError();
        }

        try {
          // Verify refresh token
          const decoded = jwt.verify(
            refreshToken,
            AuthUtil.getJWTSecret(req.authType, true),
          );

          // Generate new access token
          const newAccessToken = jwt.sign(
            {
              id: decoded.id,
              authType: decoded.authType,
              email: decoded.email,
              type: CONSTANTS.TokenTypes.ACCESS,
            },
            AuthUtil.getJWTSecret(req.authType),
            { expiresIn: '15m' },
          );

          // Send new access token
          AuthService.setCookies(
            res,
            {
              accessToken: newAccessToken,
              refreshToken,
            },
            req.authType,
          );

          // Set user and continue
          req.user = decoded;
          return next();
        } catch (refreshError) {
          // Refresh token is invalid or expired
          throw new ClientErrors.InvalidRefreshTokenError();
        }
      }

      // Some other error with access token
      return res.status(401).json({ message: 'Invalid access token' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const authenticateStoreToken = async (req, res, next) => {
  try {
    const path = AuthUtil.getAuthTypeFromPath(req.originalUrl);
    req.authType = path;
    const accessToken =
      req.cookies[CONSTANTS.AuthConfig[req.authType].accessToken];

    if (!accessToken) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        AuthUtil.getJWTSecret(req.authType),
      );

      req.store = decoded;
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // Get refresh token from cookie
        const refreshToken =
          req.cookies[CONSTANTS.AuthConfig[req.authType].refreshToken];

        if (!refreshToken) {
          throw new ClientErrors.RefreshTokenNotFoundError();
        }

        try {
          // Verify refresh token
          const decoded = jwt.verify(
            refreshToken,
            AuthUtil.getJWTSecret(req.authType, true),
          );

          // Check token version
          const storeAuth = await StoreAuthRepository.findById(
            decoded.id,
            true,
          );

          if (!storeAuth || storeAuth.tokenVersion !== decoded.version) {
            return res.status(401).json({ message: 'Token invalid' });
          }

          // Generate new access token
          const newAccessToken = jwt.sign(
            {
              id: decoded.id,
              authType: decoded.authType,
              email: decoded.email,
              type: CONSTANTS.TokenTypes.ACCESS,
              tokenVersion: storeAuth.tokenVersion, // Include tokenVersion
            },
            AuthUtil.getJWTSecret(req.authType),
            { expiresIn: '15m' },
          );

          // Send new access token
          AuthService.setCookies(
            res,
            {
              accessToken: newAccessToken,
              refreshToken,
            },
            req.authType,
          );

          // Set store and continue
          req.store = decoded;
          return next();
        } catch (refreshError) {
          // Refresh token is invalid or expired
          throw new ClientErrors.InvalidRefreshTokenError();
        }
      }

      // Some other error with access token
      return res.status(401).json({ message: 'Invalid access token' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const authenticateInternalToken = async (req, res, next) => {
  try {
    const path = AuthUtil.getAuthTypeFromPath(req.originalUrl);
    req.authType = path;
    const accessToken =
      req.cookies[CONSTANTS.AuthConfig[req.authType].accessToken];

    if (!accessToken) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        AuthUtil.getJWTSecret(req.authType),
      );

      req.internalUser = decoded;
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // Get refresh token from cookie
        const refreshToken =
          req.cookies[CONSTANTS.AuthConfig[req.authType].refreshToken];

        if (!refreshToken) {
          throw new ClientErrors.RefreshTokenNotFoundError();
        }

        try {
          // Verify refresh token
          const decoded = jwt.verify(
            refreshToken,
            AuthUtil.getJWTSecret(req.authType, true),
          );

          // Check token version
          const internalUser = await InternalUserRepository.findById(
            decoded.id,
            true,
          );

          if (!internalUser || internalUser.tokenVersion !== decoded.version) {
            return res.status(401).json({ message: 'Token invalid' });
          }

          // Generate new access token
          const newAccessToken = jwt.sign(
            {
              id: decoded.id,
              authType: decoded.authType,
              email: decoded.email,
              type: CONSTANTS.TokenTypes.ACCESS,
              tokenVersion: internalUser.tokenVersion, // Include tokenVersion
            },
            AuthUtil.getJWTSecret(req.authType),
            { expiresIn: '15m' },
          );

          // Send new access token
          AuthService.setCookies(
            res,
            {
              accessToken: newAccessToken,
              refreshToken,
            },
            req.authType,
          );

          // Set store and continue
          req.internalUser = decoded;
          return next();
        } catch (refreshError) {
          // Refresh token is invalid or expired
          throw new ClientErrors.InvalidRefreshTokenError();
        }
      }

      // Some other error with access token
      return res.status(401).json({ message: 'Invalid access token' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const AuthMiddleware = {
  setAuthType,
  authenticateUserToken,
  authenticateStoreToken,
  authenticateInternalToken,
};

module.exports = { AuthMiddleware };
