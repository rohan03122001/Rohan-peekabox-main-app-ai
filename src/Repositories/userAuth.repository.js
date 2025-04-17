const { UserAuth } = require('../models/userAuth.schema');
const logger = require('../config/logger');
const { ClientErrors } = require('../errors/clientErrors');
const { AuthService } = require('../Services/auth.service');

const create = async (email, passwordHash) => {
  try {
    const userAuth = new UserAuth({
      email,
      passwordHash,
    });

    return await userAuth.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

const findByEmail = async (email, includePassword = false) => {
  try {
    const userAuth = await UserAuth.findOne({ email }).exec();
    if (!userAuth) {
      throw new ClientErrors.NotFoundError('User', 404);
    }
    return includePassword ? userAuth : userAuth.toSafeObject();
  } catch (error) {
    logger.error(
      'Failed to fetch user by email',
      'FIND_USER_BY_EMAIL',
      'FIND_USER_BY_EMAIL_FAILURE',
      error,
      { email },
    );
    throw error;
  }
};

const findById = async (userAuthId, includePassword = false) => {
  try {
    const userAuth = await UserAuth.findOne({ _id: userAuthId }).exec();
    if (!userAuth) {
      throw new ClientErrors.NotFoundError('User not found', 404);
    }
    return includePassword ? userAuth : userAuth.toSafeObject();
  } catch (error) {
    logger.error(
      'Failed to fetch user by id',
      'FIND_USER_BY_ID',
      'FIND_USER_BY_ID_FAILURE',
      error,
      { userId: userAuthId },
    );
    throw error;
  }
};

const updatePassword = async (userId, hashedPassword) => {
  try {
    const userAuth = await UserAuth.findOneAndUpdate(
      { _id: userId },
      {
        passwordHash: hashedPassword,
        $inc: { tokenVersion: 1 },
      },
      { new: true },
    ).exec();

    if (!userAuth) {
      throw new Error('StoreAuth not found');
    }

    return userAuth;
  } catch (error) {
    logger.error(
      'Failed to update password',
      'FAILURE_UPDATE_USER_PSWD',
      'UPDATE_USER_PSWD',
      error,
      { userEmail },
    );
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const userId = req.user.id;
    const userAuth = await UserAuthRepository.findById(userId).lean().exec();
    const isPasswordValid = await AuthService.verifyPassword(
      password,
      userAuth.password,
    );
    if (!isPasswordValid) {
      throw new ClientErrors.UnauthorizedError('Invalid Password');
    }
    return userAuth.toSafeObject();
  } catch (error) {
    logger.error('Failed to login user', 'LOGIN_USER', error, { email });
    throw error;
  }
};

const UserAuthRepository = {
  findByEmail,
  updatePassword,
  login,
  findById,
  create,
};

module.exports = { UserAuthRepository };
