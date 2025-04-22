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

    return res.status(200).json({
      success: true,
      message: 'Product added to favorites successfully',
      data: favourite,
    });
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
  const { page, limit } = req.query;

  try {
    const favourites = await FavouriteService.getUserFavourites(userId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    return res.status(200).json({
      success: true,
      data: favourites,
    });
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
      success: true,
      message: 'Product removed from favourites successfully',
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

// Check if a product is in user's favorites
const isProductInFavorites = async (req, res, next) => {
  const userId = req.user?.id;
  const { productId } = req.params;

  try {
    const isInFavorites = await FavouriteService.isProductInFavorites({
      userId,
      productId,
    });

    return res.status(200).json({
      success: true,
      data: { isInFavorites },
    });
  } catch (error) {
    logger.error(
      'Failed to check if product is in favorites',
      'CHECK_PRODUCT_IN_FAVOURITES_FAILURE',
      'CHECK_PRODUCT_IN_FAVOURITES',
      error,
      { userId, productId },
    );
    return next(error);
  }
};

// Get count of user's favorites
const getUserFavouritesCount = async (req, res, next) => {
  const userId = req.user?.id;

  try {
    const count = await FavouriteService.getUserFavouritesCount(userId);

    return res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    logger.error(
      'Failed to get user favourites count',
      'GET_USER_FAVOURITES_COUNT_FAILURE',
      'GET_USER_FAVOURITES_COUNT',
      error,
      { userId },
    );
    return next(error);
  }
};

// Clear all favorites for a user
const clearUserFavourites = async (req, res, next) => {
  const userId = req.user?.id;

  try {
    const result = await FavouriteService.clearUserFavourites(userId);

    return res.status(200).json({
      success: true,
      message: 'All favorites cleared successfully',
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    logger.error(
      'Failed to clear user favourites',
      'CLEAR_USER_FAVOURITES_FAILURE',
      'CLEAR_USER_FAVOURITES',
      error,
      { userId },
    );
    return next(error);
  }
};

const FavouriteController = {
  addToUserFavourites,
  getUserFavourites,
  removeFromUserFavourites,
  isProductInFavorites,
  getUserFavouritesCount,
  clearUserFavourites,
};

module.exports = { FavouriteController };
