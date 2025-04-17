const { InternalUser } = require('../models/Internal/internalUser.schema');
const logger = require('../config/logger');
const { ClientErrors } = require('../errors/clientErrors');

const findByEmail = async (email, includePassword = false) => {
  try {
    const internalUser = await InternalUser.findOne({ email }).exec();
    if (!internalUser) {
      throw new ClientErrors.NotFoundError('internalUser', 404);
    }
    return includePassword ? internalUser : internalUser.toSafeObject();
  } catch (error) {
    logger.error(
      'Failed to verify internal user registration',
      'REQUEST_INTERNAL_USER_INIT_AUTH',
      'REQUEST_INTERNAL_USER_INIT_AUTH_FAILURE',
      error,
      { internalUserEmail: email },
    );
    throw error;
  }
};

const findById = async (internalUserId, includePassword = false) => {
  try {
    const internalUser = await InternalUser.findOne({
      _id: internalUserId,
    }).exec();
    if (!internalUser) {
      throw new ClientErrors.NotFoundError('Internal User', 404);
    }
    return includePassword ? internalUser : internalUser.toSafeObject();
  } catch (error) {
    logger.error(
      'Failed to verify Internal User registration',
      'REQUEST_INTERNAL_USER_INIT_AUTH',
      'REQUEST_INTERNAL_USER_INIT_AUTH_FAILURE',
      error,
      { internalUserId },
    );
    throw error;
  }
};

const updatePassword = async (internalUserId, hashedPassword) => {
  try {
    const internalUser = await InternalUser.findOneAndUpdate(
      { _id: internalUserId },
      {
        passwordHash: hashedPassword,
        $inc: { tokenVersion: 1 },
      },
      { new: true },
    ).exec();

    if (!internalUser) {
      throw new Error('Internal User not found');
    }

    return internalUser;
  } catch (error) {
    logger.error(
      'Failed to update Internal User password',
      'REQUEST_UPDATE_INTERNAL_USER_PSWD',
      'REQUEST_UPDATE_INTERNAL_USER_PSWD_FAILURE',
      error,
      { internalUserId },
    );
    throw error;
  }
};

const InternalUserRepository = {
  findByEmail,
  updatePassword,
  findById,
};

module.exports = { InternalUserRepository };
