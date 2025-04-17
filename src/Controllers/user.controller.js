const { UserService } = require('../Services/user.service');
const logger = require('../config/logger');

const findById = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const user = await UserService.findById(userId);

    return res.status(200).json(user);
  } catch (error) {
    logger.error(
      'Failed to fetch user by id',
      'REQUEST_GET_USER_BY_ID',
      'REQUEST_GET_USER_BY_ID_FAILURE',
      error,
      { userId: req.user.id },
    );
    return next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const userData = req.body;
    const { id: userId } = req.user;
    const userUpdates = {};
    for (const [key, value] of Object.entries(userData)) {
      if (value !== undefined) {
        userUpdates[key] = value;
      }
    }

    const result = await UserService.updateById(userId, userUpdates);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to update User',
      'REQUEST_UPDATE_USER',
      'REQUEST_UPDATE_USER_FAILURE',
      error,
      { userId: req.user.id },
    );
    return next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    await UserService.deleteById(userId);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error(
      'Failed to delete User',
      'REQUEST_DELETE_USER',
      'REQUEST_DELETE_USER_FAILURE',
      error,
      { userId: req.user.id },
    );
    return next(error);
  }
};

const UserController = {
  findById,
  updateById,
  deleteById,
};

module.exports = { UserController };
