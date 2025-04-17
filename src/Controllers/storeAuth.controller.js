const logger = require('../config/logger');
const { StoreAuthService } = require('../Services/storeAuth.service');
const { AuthService } = require('../Services/auth.service');

const initAuth = async (req, res, next) => {
  try {
    const { email } = req.body;
    const storeAuth = await StoreAuthService.initAuth(email);

    return res.status(200).json(storeAuth.toSafeObject());
  } catch (error) {
    logger.error(
      'Failed to verify store registration',
      'REQUEST_STORE_INIT_AUTH',
      'REQUEST_STORE_INIT_AUTH_FAILURE',
      error,
      { email: req.body.email },
    );
    return next(error);
  }
};

const BrandinitAuth = async (req, res, next) => {
  try {
    const { email } = req.body;
    const storeAuth = await StoreAuthService.BrandinitAuth(email);

    return res.status(200).json(storeAuth.toSafeObject());
  } catch (error) {
    logger.error(
      'Failed to verify Brand registration',
      'REQUEST_STORE_INIT_AUTH',
      'REQUEST_STORE_INIT_AUTH_FAILURE',
      error,
      { email: req.body.email },
    );
    return next(error);
  }
};

const triggerOTP = async (req, res, next) => {
  try {
    const { purpose, email } = req.body;

    await StoreAuthService.triggerOTP(email, purpose);

    return res.status(200).json({ message: 'OTP Triggered successfully' });
  } catch (error) {
    logger.error(
      'Failed to trigger store otp',
      'REQUEST_STORE_TRIGGER_OTP',
      'REQUEST_STORE_TRIGGER_OTP_FAILURE',
      error,
      { email: req.body.email },
    );
    return next(error);
  }
};


const BrandtriggerOTP = async (req, res, next) => {
  try {
    const { purpose, email } = req.body;

    await StoreAuthService.BrandtriggerOTP(email, purpose);

    return res.status(200).json({ message: 'OTP Triggered successfully' });
  } catch (error) {
    logger.error(
      'Failed to trigger brand otp',
      'REQUEST_STORE_TRIGGER_OTP',
      'REQUEST_STORE_TRIGGER_OTP_FAILURE',
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
      email: storeEmail,
      password,
    } = req.body;

    const storeAuth = await StoreAuthService.verifyOTP({
      storeEmail,
      purpose,
      password,
    });

    const { accessToken, refreshToken } = AuthService.generateTokens(
      {
        storeId: storeAuth._id,
        email: storeAuth.email,
      },
      req.authType,
      'storeId',
      storeAuth.tokenVersion,
    );

    AuthService.setCookies(res, { accessToken, refreshToken }, req.authType);

    return res.json({
      message: 'OTP verified successfully',
      storeAuth: storeAuth.toSafeObject(),
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


const BrandverifyOTP = async (req, res, next) => {
  try {
    const {
      purpose,
      email: storeEmail,
      OTPValue: storeSubmittedOTP,
      password,
    } = req.body;

    const brandAuth = await StoreAuthService.BrandverifyOTP({
      storeEmail,
      purpose,
      storeSubmittedOTP,
      password,
    });

    const { accessToken, refreshToken } = AuthService.generateTokens(
      {
        brandId: brandAuth._id,
        email: brandAuth .email,
      },
      req.authType,
      'storeId',
      brandAuth .tokenVersion,
    );

    AuthService.setCookies(res, { accessToken, refreshToken }, req.authType);

    return res.json({
      message: 'OTP verified successfully',
      brandAuth: brandAuth.toSafeObject(),
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
    const storeAuth = await StoreAuthService.logIn(email, password);

    const { accessToken, refreshToken } = AuthService.generateTokens(
      {
        storeId: storeAuth._id,
        email: storeAuth.email,
      },
      req.authType,
      'storeId',
      storeAuth.tokenVersion,
    );

    AuthService.setCookies(res, { accessToken, refreshToken }, req.authType);

    return res.json({
      message: 'Store Logged In successfully',
      storeAuth: storeAuth.toSafeObject(),
    });
  } catch (error) {
    logger.error(
      'Failed to log store in',
      'REQUEST_STORE_LOG_IN',
      'REQUEST_STORE_LOG_IN_FAILURE',
      error,
      {
        email: req.body.email,
      },
    );
    return next(error);
  }
};


const BrandlogIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const brandAuth = await StoreAuthService.BrandlogIn(email, password);

    const { accessToken, refreshToken } = AuthService.generateTokens(
      {
        brandId: brandAuth._id,
        email: brandAuth.email,
      },
      req.authType,
      'brandId',
      brandAuth.tokenVersion,
    );

    AuthService.setCookies(res, { accessToken, refreshToken }, req.authType);

    return res.json({
      message: 'Brand portal Logged In successfully',
      brandAuth: brandAuth.toSafeObject(),
    });
  } catch (error) {
    logger.error(
      'Failed to log brand in',
      'REQUEST_STORE_LOG_IN',
      'REQUEST_STORE_LOG_IN_FAILURE',
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
      'REQUEST_STORE_REFRESH',
      'REQUEST_STORE_REFRESH_FAILURE',
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

    const storeAuth = await StoreAuthService.updatePassword({
      storeId: req.store.id,
      existingPassword,
      updatedPassword,
    });

    const { accessToken, refreshToken } = AuthService.generateTokens(
      {
        storeId: storeAuth._id,
        email: storeAuth.email,
      },
      req.authType,
      'storeId',
      storeAuth.tokenVersion,
    );

    AuthService.setCookies(res, { accessToken, refreshToken }, req.authType);

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    logger.error(
      'Failed to update password',
      'REQUEST_STORE_PASSWORD_UPDATE',
      'REQUEST_STORE_PASSWORD_UPDATE_FAILURE',
      error,
      {
        storeId: req.store.id,
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
      'REQUEST_STORE_LOG_OUT',
      'REQUEST_STORE_LOG_OUT_FAILURE',
      error,
      {
        storeId: req.store.id,
      },
    );
    return next(error);
  }
};


const BrandlogOut = async (req, res, next) => {
  try {
    AuthService.clearCookies(res, req.authType);
    return res.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error(
      'Failed to log out',
      'REQUEST_STORE_LOG_OUT',
      'REQUEST_STORE_LOG_OUT_FAILURE',
      error,
      {
        storeId: req.store.id,
      },
    );
    return next(error);
  }
};

const StoreAuthController = {
  initAuth,
  triggerOTP,
  verifyOTP,
  logIn,
  refresh,
  updatePassword,
  logOut,
  BrandinitAuth,
  BrandlogIn,
  BrandverifyOTP,
  BrandtriggerOTP,
  BrandlogOut
};

module.exports = { StoreAuthController };
