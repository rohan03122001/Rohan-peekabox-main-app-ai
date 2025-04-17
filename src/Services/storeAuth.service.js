const logger = require('../config/logger');
const { CryptoUtil } = require('./../Util/crypto.util.js');
const { Redis } = require('./../cache/redis.js');
const { AuthService } = require('./auth.service.js');
const { NotificationService } = require('./notification.service.js');
const { ClientErrors } = require('../errors/clientErrors');

const { StoreAuthRepository } = require('../Repositories/storeAuth.repository');
const {BrandRepository} = require('../Repositories/brand.repository');
const { StoreRepository } = require('../Repositories/store.repository');

const { CONFIG } = require('./../config/config.js');
const { CONSTANTS } = require('../config/constants.js');

const initAuth = async (email) => {
  try {
    const storeAuth = await StoreAuthRepository.findByEmail(email);
    return storeAuth;
  } catch (error) {
    logger.error(
      'Failed to verify store registration',
      'REQUEST_STORE_INIT_AUTH',
      'REQUEST_STORE_INIT_AUTH_FAILURE',
      error,
      { email },
    );
    throw error;
  }
};


const BrandinitAuth = async (email) => {
  try {
    const BrandAuth = await StoreAuthRepository.brandFindByEmail(email);
    return BrandAuth;
  } catch (error) {
    logger.error(
      'Failed to verify store registration',
      'REQUEST_STORE_INIT_AUTH',
      'REQUEST_STORE_INIT_AUTH_FAILURE',
      error,
      { email },
    );
    throw error;
  }
};

const triggerOTP = async (storeEmail, purpose) => {
  try {
    const OTPKey = `STORE_LOGIN_OTP:${purpose}:${storeEmail}`;
    const OTPValue = CryptoUtil.generateOTP();
    const OTP_EXPIRY = 5 * 60; // 300 seconds, 5 minutes in seconds for Redis
    console.log("Otp value "+ OTPValue)
    await Redis.set(OTPKey, OTPValue, OTP_EXPIRY);

    await NotificationService.sendEmail({
      from: CONFIG.NOTIF_EMAIL,
      to: storeEmail,
      subject: 'Peekabox Verification Code',
      message: `Your Peekabox verification code is ${OTPValue}`,
    });
  } catch (error) {
    logger.error(
      'Failed to trigger store otp',
      'REQUEST_STORE_TRIGGER_OTP',
      'REQUEST_STORE_TRIGGER_OTP_FAILURE',
      error,
      { storeEmail },
    );
    throw error;
  }
};


const BrandtriggerOTP = async (storeEmail, purpose) => {
  try {
    const OTPKey = `BRAND_LOGIN_OTP:${purpose}:${storeEmail}`;
    const OTPValue = CryptoUtil.generateOTP();
    const OTP_EXPIRY = 5 * 60; // 300 seconds, 5 minutes in seconds for Redis
    console.log("Otp value Brand"+ OTPValue)
    await Redis.set(OTPKey, OTPValue, OTP_EXPIRY);

    await NotificationService.sendEmail({
      from: CONFIG.NOTIF_EMAIL,
      to: storeEmail,
      subject: 'Peekabox Verification Code',
      message: `Your Peekabox verification code is ${OTPValue}`,
    });
  } catch (error) {
    logger.error(
      'Failed to trigger store otp',
      'REQUEST_STORE_TRIGGER_OTP',
      'REQUEST_STORE_TRIGGER_OTP_FAILURE',
      error,
      { storeEmail },
    );
    throw error;
  }
};

const verifyOTP = async ({
  storeEmail,
  purpose,
  storeSubmittedOTP,
  password,
}) => {
  try {
   /* const OTPKey = `STORE_LOGIN_OTP:${purpose}:${storeEmail}`;
    const storedOTP = await Redis.getDel(OTPKey);

    if (!storedOTP || storeSubmittedOTP !== storedOTP) {
      throw new ClientErrors.InvalidOTPError('OTP validation failed', {
        storeEmail,
        attemptedOTP: storeSubmittedOTP,
      });
    } */

    const hashedPassword = await AuthService.hashPassword(password);
    let storeAuth, store;
    if (purpose === CONSTANTS.OTPPurpose.SIGNUP) {
      storeAuth = await StoreAuthRepository.create(storeEmail, hashedPassword);
      store = await StoreRepository.create({
        storeId: storeAuth._id,
        email: storeAuth.email,
      });
    } else if (purpose === CONSTANTS.OTPPurpose.FORGOT_PASSWORD) {
      const storeAuthDetail = await StoreAuthRepository.findByEmail(storeEmail);
      storeAuth = await StoreAuthRepository.updatePassword(
        storeAuthDetail._id,
        hashedPassword,
      );
    }

    return storeAuth;
  } catch (error) {
    logger.error(
      'Failed to verify otp',
      'REQUEST_STORE_VERIFY_OTP',
      'REQUEST_STORE_VERIFY_OTP_FAILURE',
      error,
      { storeEmail },
    );
    throw error;
  }
};

// this one also create the brand 
const BrandverifyOTP = async ({
  storeEmail,
  purpose,
  storeSubmittedOTP,
  password,
}) => {
  try {
    const OTPKey = `BRAND_LOGIN_OTP:${purpose}:${storeEmail}`;
    const storedOTP = await Redis.getDel(OTPKey);

    if (!storedOTP || storeSubmittedOTP !== storedOTP) {
      throw new ClientErrors.InvalidOTPError('OTP validation failed', {
        storeEmail,
        attemptedOTP: storeSubmittedOTP,
      });
    }

    const hashedPassword = await AuthService.hashPassword(password);
    let BrandAuth, Brand;
    if (purpose === CONSTANTS.OTPPurpose.SIGNUP) {
      BrandAuth = await StoreAuthRepository.brandCreate(storeEmail, hashedPassword);
      Brand = await BrandRepository.createBrand({
        brandId: BrandAuth._id,
      });
    } /*else if (purpose === CONSTANTS.OTPPurpose.FORGOT_PASSWORD) {
      const storeAuthDetail = await StoreAuthRepository.BrandinitAuth(storeEmail);
      storeAuth = await BrandRepository.brandUpdatePassword(
        storeAuthDetail._id,
        hashedPassword,
      );
    } */

    return BrandAuth;
  } catch (error) {
    logger.error(
      'Failed to verify otp',
      'REQUEST_STORE_VERIFY_OTP',
      'REQUEST_STORE_VERIFY_OTP_FAILURE',
      error,
      { storeEmail },
    );
    throw error;
  }
};

const logIn = async (email, password) => {
  try {
    const storeAuth = await StoreAuthRepository.findByEmail(email, true);
    const isPasswordValid = await AuthService.verifyPassword(
      password,
      storeAuth.passwordHash,
    );

    if (!isPasswordValid) {
      throw new ClientErrors.InvalidCredentialsError({ email });
    }

    return storeAuth;
  } catch (error) {
    logger.error(
      'Failed to log store in',
      'REQUEST_STORE_LOG_IN',
      'REQUEST_STORE_LOG_IN_FAILURE',
      error,
      { email },
    );
    throw error;
  }
};


const BrandlogIn = async (email, password) => {
  try {
    const brandAuth = await StoreAuthRepository.brandFindByEmail(email, true);
    const isPasswordValid = await AuthService.verifyPassword(
      password,
      brandAuth.passwordHash,
    );

    if (!isPasswordValid) {
      throw new ClientErrors.InvalidCredentialsError({ email });
    }

    return brandAuth;
  } catch (error) {
    logger.error(
      'Failed to log store in',
      'REQUEST_STORE_LOG_IN',
      'REQUEST_STORE_LOG_IN_FAILURE',
      error,
      { email },
    );
    throw error;
  }
};

const updatePassword = async ({
  storeId,
  existingPassword,
  updatedPassword,
}) => {
  try {
    const storeAuth = await StoreAuthRepository.findById(storeId, true);

    const isPasswordValid = await AuthService.verifyPassword(
      existingPassword,
      storeAuth.passwordHash,
    );

    if (!isPasswordValid) {
      throw new ClientErrors.InvalidCredentialsError({ storeId });
    }
    const hashedPassword = await AuthService.hashPassword(updatedPassword);

    const updatedStoreAuth = await StoreAuthRepository.updatePassword(
      storeId,
      hashedPassword,
    );
    return updatedStoreAuth;
  } catch (error) {
    logger.error(
      'Failed to update password',
      'USER_PASSWORD_UPDATE',
      'USER_PASSWORD_UPDATE_FAILURE',
      error,
      { storeId },
    );
    throw error;
  }
};



const StoreAuthService = {
  initAuth,
  triggerOTP,
  verifyOTP,
  logIn,
  updatePassword,
  BrandinitAuth,
  BrandlogIn,
  BrandverifyOTP,
  BrandtriggerOTP,
};

module.exports = { StoreAuthService };
