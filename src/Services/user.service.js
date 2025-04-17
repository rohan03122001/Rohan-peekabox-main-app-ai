const logger = require('../config/logger');
const { UserRepository } = require('../Repositories/user.repository');

const findById = async (userId) => {
  try {
    const user = await UserRepository.findById(userId);
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
    const user = await UserRepository.updateById(userId, userUpdates);
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
    const user = await UserRepository.deleteById(userId);
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

const UserService = { findById, updateById, deleteById };

module.exports = {
  UserService,
};
