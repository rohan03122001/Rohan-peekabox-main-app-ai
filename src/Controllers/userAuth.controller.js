const { UserAuthService } = require('../Services/userAuth.service');
const { AuthService } = require('./../Services/auth.service');
const logger = require('../config/logger');

const initAuth = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userAuth = await UserAuthService.initAuth(email);

    return res.status(200).json(userAuth.toSafeObject());
  } catch (error) {
    logger.error(
      'Failed to verify user registration',
      'REQUEST_INIT_AUTH',
      'REQUEST_INIT_AUTH_FAILURE',
      error,
      { email: req.body.email },
    );
    return next(error);
  }
};

const triggerOTP = async (req, res, next) => {
  try {
    const { purpose, email } = req.body;

    await UserAuthService.triggerOTP(email, purpose);

    return res.status(200).json({ message: 'OTP Triggered successfully' });
  } catch (error) {
    logger.error(
      'Failed to trigger otp',
      'REQUEST_OTP',
      'REQUEST_OTP_FAILURE',
      error,
      { email: req.body.email },
    );
    return next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const {
      purpose,
      email: userEmail,
      OTPValue: userSubmittedOTP,
      password,
    } = req.body;

    const userAuth = await UserAuthService.verifyOTP({
      userEmail,
      purpose,
      userSubmittedOTP,
      password,
    });

    const { accessToken, refreshToken } = AuthService.generateTokens(
      {
        userId: userAuth._id,
        email: userAuth.email,
      },
      req.authType,
      'userId',
      userAuth.tokenVersion,
    );

    AuthService.setCookies(res, { accessToken, refreshToken }, req.authType);

    return res.json({
      message: 'OTP verified successfully',
      userAuth: userAuth.toSafeObject(),
    });
  } catch (error) {
    logger.error(
      'Failed to verify otp',
      'VERIFY_OTP',
      'VERIFY_OTP_FAILURE',
      error,
      { email: req.body.email },
    );
    return next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userAuth = await UserAuthService.logIn(email, password);

    const { accessToken, refreshToken } = AuthService.generateTokens(
      {
        userId: userAuth._id,
        email: userAuth.email,
      },
      req.authType,
      'userId',
      userAuth.tokenVersion,
    );

    AuthService.setCookies(res, { accessToken, refreshToken }, req.authType);

    return res.json({
      message: 'User Logged In successfully',
      userAuth: userAuth.toSafeObject(),
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    logger.error(
      'Failed to log in',
      'USER_LOG_IN',
      'USER_LOG_IN_FAILURE',
      error,
      {
        email: req.body.email,
      },
    );
    return next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    return res.json({ message: 'Token refreshed successfully' });
  } catch (error) {
    logger.error(
      'Failed to refresh',
      'USER_REFRESH',
      'USER_REFRESH_FAILURE',
      error,
      {
        email: req.body.email,
      },
    );
    return next(error);
  }
};

const logOut = async (req, res, next) => {
  try {
    AuthService.clearCookies(res, req.authType);
    return res.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Failed to log out', 'LOG_OUT', 'LOG_OUT_FAILURE', error, {
      userId: req.user.id,
    });
    return next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { existingPassword, updatedPassword } = req.body;

    const userAuth = await UserAuthService.updatePassword({
      userId: req.user.id,
      existingPassword,
      updatedPassword,
    });

    const { accessToken, refreshToken } = AuthService.generateTokens(
      {
        userId: userAuth._id,
        email: userAuth.email,
      },
      req.authType,
      'userId',
      userAuth.tokenVersion,
    );

    AuthService.setCookies(res, { accessToken, refreshToken }, req.authType);

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    logger.error(
      'Failed to update password',
      'USER_PASSWORD_UPDATE',
      'USER_PASSWORD_UPDATE_FAILURE',
      error,
      {
        userId: req.user.id,
      },
    );
    return next(error);
  }
};

const UserAuthController = {
  initAuth,
  triggerOTP,
  verifyOTP,
  logIn,
  refresh,
  logOut,
  updatePassword,
};

module.exports = { UserAuthController };
