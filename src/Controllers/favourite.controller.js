const { FavouriteService } = require('../Services/favourite.service');
const logger = require('./../config/logger');

const addToUserFavourites = async (req, res, next) => {
  const userId = req.user?.id;
  const { productId } = req.params;

  try {
    const favourite = await FavouriteService.addToUserFavourites({
      userId,
      productId,
    });

    return res.status(200).json(favourite);
  } catch (error) {
    logger.error(
      'Failed to add to user favourites',
      'ADD_TO_USER_FAVOURITES',
      'ADD_TO_USER_FAVOURITES_FAILURE',
      error,
      { userId: req.user?.id, productId: req.params.productId },
    );
    return next(error);
  }
};

const getUserFavourites = async (req, res, next) => {
  const userId = req.user?.id;
  try {
    const favourites = await FavouriteService.getUserFavourites(userId);

    return res.status(200).json(favourites);
  } catch (error) {
    logger.error(
      'Failed to fetch user favourites',
      'GET_USER_FAVOURITES',
      'GET_USER_FAVOURITES_FAILURE',
      error,
      { userId },
    );
    return next(error);
  }
};

const removeFromUserFavourites = async (req, res, next) => {
  const userId = req.user?.id;
  const { productId } = req.params;
  try {
    await FavouriteService.removeFromUserFavourites({
      userId,
      productId,
    });

    return res.status(200).json({
      message: 'product removed from favourites successfully',
    });
  } catch (error) {
    logger.error(
      'Failed to remove from user favourites',
      'REMOVE_FROM_USER_FAVOURITES_FAILURE',
      'REMOVE_FROM_USER_FAVOURITES',
      error,
      { userId, productId },
    );
    return next(error);
  }
};

const FavouriteController = {
  addToUserFavourites,
  getUserFavourites,
  removeFromUserFavourites,
};

module.exports = { FavouriteController };
