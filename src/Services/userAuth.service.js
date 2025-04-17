const logger = require('../config/logger');

const { UserAuthRepository } = require('../Repositories/userAuth.repository');
const { NotificationService } = require('./notification.service.js');
const { AuthService } = require('./auth.service.js');
const { Redis } = require('./../cache/redis.js');

const { ClientErrors } = require('../errors/clientErrors');
const { CryptoUtil } = require('./../Util/crypto.util.js');

const { CONFIG } = require('./../config/config.js');
const { CONSTANTS } = require('../config/constants.js');
const { UserRepository } = require('../Repositories/user.repository.js');

const initAuth = async (email) => {
  try {
    const userAuth = await UserAuthRepository.findByEmail(email);
    return userAuth;
  } catch (error) {
    logger.error(
      'Failed to verify user registration',
      'REQUEST_INIT_AUTH',
      'REQUEST_INIT_AUTH_FAILURE',
      error,
      { email },
    );
    throw error;
  }
};

const triggerOTP = async (userEmail, purpose) => {
  try {
    const OTPKey = `USER_LOGIN_OTP:${purpose}:${userEmail}`;
    const OTPValue = CryptoUtil.generateOTP();
    const OTP_EXPIRY = 5 * 60; // 300 seconds, 5 minutes in seconds for Redis
    await Redis.set(OTPKey, OTPValue, OTP_EXPIRY);

    await NotificationService.sendEmail({
      from: CONFIG.NOTIF_EMAIL,
      to: userEmail,
      subject: 'Peekabox Verification Code',
      message: `Your Peekabox verification code is ${OTPValue}`,
    });
  } catch (error) {
    logger.error(
      'Failed to trigger otp',
      'REQUEST_TRIGGER_OTP',
      'REQUEST_TRIGGER_OTP_FAILURE',
      error,
      { userEmail },
    );
    throw error;
  }
};

const verifyOTP = async ({
  userEmail,
  purpose,
  userSubmittedOTP,
  password,
}) => {
  try {
    const OTPKey = `USER_LOGIN_OTP:${purpose}:${userEmail}`;
    const storedOTP = await Redis.getDel(OTPKey);

    if (!storedOTP || userSubmittedOTP !== storedOTP) {
      throw new ClientErrors.InvalidOTPError('OTP validation failed', {
        userEmail,
        attemptedOTP: userSubmittedOTP,
      });
    }

    const hashedPassword = await AuthService.hashPassword(password);
    let userAuth, user;
    if (purpose === CONSTANTS.OTPPurpose.SIGNUP) {
      userAuth = await UserAuthRepository.create(userEmail, hashedPassword);
      user = await UserRepository.create({
        userId: userAuth._id,
        email: userAuth.email,
      });
    } else if (purpose === CONSTANTS.OTPPurpose.FORGOT_PASSWORD) {
      const userAuthDetail = await UserAuthRepository.findByEmail(userEmail);
      userAuth = await UserAuthRepository.updatePassword(
        userAuthDetail._id,
        hashedPassword,
      );
    }

    return userAuth;
  } catch (error) {
    logger.error(
      'Failed to verify otp',
      'REQUEST_VERIFY_OTP',
      'REQUEST_VERIFY_OTP_FAILURE',
      error,
      { userEmail },
    );
    throw error;
  }
};

const logIn = async (email, password) => {
  try {
    const userAuth = await UserAuthRepository.findByEmail(email, true);
    const isPasswordValid = await AuthService.verifyPassword(
      password,
      userAuth.passwordHash,
    );

    if (!isPasswordValid) {
      throw new ClientErrors.InvalidCredentialsError({ email });
    }

    return userAuth;
  } catch (error) {
    logger.error(
      'Failed to log in',
      'USER_LOG_IN',
      'USER_LOG_IN_FAILURE',
      error,
      { email },
    );
    throw error;
  }
};

const updatePassword = async ({
  userId,
  existingPassword,
  updatedPassword,
}) => {
  try {
    const userAuth = await UserAuthRepository.findById(userId, true);

    const isPasswordValid = await AuthService.verifyPassword(
      existingPassword,
      userAuth.passwordHash,
    );

    if (!isPasswordValid) {
      throw new ClientErrors.InvalidCredentialsError({ userId });
    }
    const hashedPassword = await AuthService.hashPassword(updatedPassword);

    const updatedUserAuth = await UserAuthRepository.updatePassword(
      userId,
      hashedPassword,
    );
    return updatedUserAuth;
  } catch (error) {
    logger.error(
      'Failed to update password',
      'USER_PASSWORD_UPDATE',
      'USER_PASSWORD_UPDATE_FAILURE',
      error,
      { userEmail },
    );
    throw error;
  }
};

const UserAuthService = {
  initAuth,
  triggerOTP,
  verifyOTP,
  logIn,
  updatePassword,
};

module.exports = { UserAuthService };
