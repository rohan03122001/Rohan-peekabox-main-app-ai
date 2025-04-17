const logger = require('../config/logger.js');
const { CryptoUtil } = require('../Util/crypto.util.js');
const { Redis } = require('../cache/redis.js');
const { AuthService } = require('./auth.service.js');
const { NotificationService } = require('./notification.service.js');
const { ClientErrors } = require('../errors/clientErrors.js');

const {
  InternalUserRepository,
} = require('../Repositories/internalUser.repository');

const { CONFIG } = require('./../config/config.js');
const { CONSTANTS } = require('../config/constants.js');

const triggerOTP = async (internalUserEmail, purpose) => {
  try {
    const OTPKey = `INTERNAL_USER_LOGIN_OTP:${purpose}:${internalUserEmail}`;
    const OTPValue = CryptoUtil.generateOTP();
    const OTP_EXPIRY = 5 * 60; // 300 seconds, 5 minutes in seconds for Redis
    await Redis.set(OTPKey, OTPValue, OTP_EXPIRY);

    await NotificationService.sendEmail({
      from: CONFIG.NOTIF_EMAIL,
      to: internalUserEmail,
      subject: 'Peekabox Verification Code',
      message: `Your Peekabox verification code is ${OTPValue}`,
    });
  } catch (error) {
    logger.error(
      'Failed to trigger internal user otp',
      'REQUEST_INTERNAL_USER_TRIGGER_OTP',
      'REQUEST_INTERNAL_USER_TRIGGER_OTP_FAILURE',
      error,
      { internalUserEmail },
    );
    throw error;
  }
};

const verifyOTP = async ({
  internalUserEmail,
  purpose,
  storeSubmittedOTP,
  password,
}) => {
  try {
    const OTPKey = `INTERNAL_USER_LOGIN_OTP:${purpose}:${internalUserEmail}`;
    const storedOTP = await Redis.getDel(OTPKey);

    if (!storedOTP || storeSubmittedOTP !== storedOTP) {
      throw new ClientErrors.InvalidOTPError('OTP validation failed', {
        internalUserEmail,
        attemptedOTP: storeSubmittedOTP,
      });
    }

    const hashedPassword = await AuthService.hashPassword(password);
    let internalUser;
    if (purpose === CONSTANTS.OTPPurpose.FORGOT_PASSWORD) {
      internalUser = await InternalUserRepository.findByEmail(
        internalUserEmail,
        true,
      );
      await InternalUserRepository.updatePassword(
        internalUser._id,
        hashedPassword,
      );
    } else {
      throw new ClientErrors.ForbiddenError('Request forbidden');
    }

    return internalUser;
  } catch (error) {
    logger.error(
      'Failed to verify otp',
      'REQUEST_STORE_VERIFY_OTP',
      'REQUEST_STORE_VERIFY_OTP_FAILURE',
      error,
      { internalUserEmail },
    );
    throw error;
  }
};

const logIn = async (email, password) => {
  try {
    const internalUser = await InternalUserRepository.findByEmail(email, true);
    const isPasswordValid = await AuthService.verifyPassword(
      password,
      internalUser.passwordHash,
    );

    if (!isPasswordValid) {
      throw new ClientErrors.InvalidCredentialsError({ email });
    }

    return internalUser;
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
  internalUserId,
  existingPassword,
  updatedPassword,
}) => {
  try {
    const internalUser = await InternalUserRepository.findById(
      internalUserId,
      true,
    );

    const isPasswordValid = await AuthService.verifyPassword(
      existingPassword,
      internalUser.passwordHash,
    );

    if (!isPasswordValid) {
      throw new ClientErrors.InvalidCredentialsError({ internalUserId });
    }
    const hashedPassword = await AuthService.hashPassword(updatedPassword);

    const updatedInternalUser = await InternalUserRepository.updatePassword(
      internalUserId,
      hashedPassword,
    );
    return updatedInternalUser;
  } catch (error) {
    logger.error(
      'Failed to update internal user password',
      'REQUEST_INTERNAL_USER_PASSWORD_UPDATE',
      'REQUEST_INTERNAL_USER_PASSWORD_UPDATE_FAILURE',
      error,
      { internalUserId },
    );
    throw error;
  }
};

const InternalUserService = {
  triggerOTP,
  verifyOTP,
  logIn,
  updatePassword,
};

module.exports = { InternalUserService };
