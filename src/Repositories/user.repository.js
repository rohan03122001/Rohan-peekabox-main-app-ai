const { User } = require('../models/user.schema');
const logger = require('../config/logger');

const create = async ({ userId, email }) => {
  try {
    const user = new User({
      _id: userId,
      'contactDetails.email': email,
    });

    return await user.save();
  } catch (error) {
    logger.error(
      'Failed to create user by id',
      'REQUEST_CREATE_USER_BY_ID',
      'REQUEST_CREATE_USER_BY_ID_FAILURE',
      error,
      { userId },
    );
    throw error;
  }
};

const findById = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      throw new ClientErrors.NotFoundError('User not found', 404);
    }
    return user;
  } catch (error) {
    logger.error(
      'Failed to fetch user by id',
      'REQUEST_GET_USER_BY_ID',
      'REQUEST_GET_USER_BY_ID_FAILURE',
      error,
      { userId },
    );
    throw error;
  }
};

const updateById = async (userId, userUpdates) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: userUpdates },
      { new: true, runValidators: true },
    ).exec();

    return user;
  } catch (error) {
    logger.error(
      'Failed to update User',
      'REQUEST_UPDATE_USER',
      'REQUEST_UPDATE_USER_FAILURE',
      error,
      { userId },
    );
    throw error;
  }
};

const deleteById = async (userId) => {
  try {
    const update = { isDeleted: true };
    const user = await User.findByIdAndUpdate(userId, update).exec();
    if (!user) {
      throw new ClientErrors.NotFoundError('User not found', 404);
    }
    return user;
  } catch (error) {
    logger.error(
      'Failed to delete User',
      'REQUEST_DELETE_USER',
      'REQUEST_DELETE_USER_FAILURE',
      error,
      { userId },
    );
    throw error;
  }
};

const UserRepository = { create, findById, updateById, deleteById };

module.exports = { UserRepository };
