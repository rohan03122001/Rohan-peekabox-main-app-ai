const logger = require('../config/logger');
const { InternalUserService } = require('../Services/internalUser.service');
const { AuthService } = require('../Services/auth.service');

const triggerOTP = async (req, res, next) => {
  try {
    const { purpose, email } = req.body;

    await InternalUserService.triggerOTP(email, purpose);

    return res.status(200).json({ message: 'OTP Triggered successfully' });
  } catch (error) {
    logger.error(
      'Failed to trigger internal user otp',
      'REQUEST_INTERNAL_USER_TRIGGER_OTP',
      'REQUEST_INTERNAL_USER_TRIGGER_OTP_FAILURE',
      error,
      { internalUserEmail: req.body.email },
    );
    return next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const {
      purpose,
      email: internalUserEmail,
      OTPValue: storeSubmittedOTP,
      password,
    } = req.body;

    const internalUser = await InternalUserService.verifyOTP({
      internalUserEmail,
      purpose,
      storeSubmittedOTP,
      password,
    });

    const { accessToken, refreshToken } = AuthService.generateTokens(
      {
        internalUserId: internalUser._id,
        email: internalUser.email,
      },
      req.authType,
      'internalUserId',
      internalUser.tokenVersion,
    );

    AuthService.setCookies(res, { accessToken, refreshToken }, req.authType);

    return res.json({
      message: 'OTP verified successfully',
      internalUser: internalUser.toSafeObject(),
    });
  } catch (error) {
    logger.error(
      'Failed to verify store otp',
      'REQUEST_STORE_VERIFY_OTP',
      'REQUEST_STORE_VERIFY_OTP_FAILURE',
      error,
      { email: req.body.email },
    );
    return next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const internalUser = await InternalUserService.logIn(email, password);

    const { accessToken, refreshToken } = AuthService.generateTokens(
      {
        internalUserId: internalUser._id,
        email: internalUser.email,
      },
      req.authType,
      'internalUserId',
      internalUser.tokenVersion,
    );

    AuthService.setCookies(res, { accessToken, refreshToken }, req.authType);

    return res.json({
      message: 'Internal User Logged In successfully',
      storeAuth: internalUser.toSafeObject(),
    });
  } catch (error) {
    logger.error(
      'Failed to log store in',
      'REQUEST_INTERNAL_USER_LOG_IN',
      'REQUEST_INTERNAL_USER_LOG_IN_FAILURE',
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
      'REQUEST_INTERNAL_USER_REFRESH',
      'REQUEST_INTERNAL_USER_REFRESH_FAILURE',
      error,
      {
        email: req.body.email,
      },
    );
    return next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { existingPassword, updatedPassword } = req.body;

    const internalUser = await InternalUserService.updatePassword({
      internalUserId: req.internalUser.id,
      existingPassword,
      updatedPassword,
    });

    const { accessToken, refreshToken } = AuthService.generateTokens(
      {
        internalUserId: internalUser._id,
        email: internalUser.email,
      },
      req.authType,
      'internalUserId',
      internalUser.tokenVersion,
    );

    AuthService.setCookies(res, { accessToken, refreshToken }, req.authType);

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    logger.error(
      'Failed to update internal user password',
      'REQUEST_INTERNAL_USER_PASSWORD_UPDATE',
      'REQUEST_INTERNAL_USER_PASSWORD_UPDATE_FAILURE',
      error,
      {
        internalUserId: req.internalUser.id,
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
    logger.error(
      'Failed to log out',
      'REQUEST_INTERNAL_USER_LOG_OUT',
      'REQUEST_INTERNAL_USER_LOG_OUT_FAILURE',
      error,
      {
        internalUserId: req.internalUser.id,
      },
    );
    return next(error);
  }
};

const InternalUserController = {
  triggerOTP,
  verifyOTP,
  logIn,
  refresh,
  updatePassword,
  logOut,
};

module.exports = { InternalUserController };
