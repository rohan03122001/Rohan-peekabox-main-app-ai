const { FavouriteRepository } = require('../Repositories/favourite.repository');
const logger = require('./../config/logger');

const addToUserFavourites = async ({ userId, productId }) => {
  try {
    const favourite = await FavouriteRepository.addToUserFavourites({
      userId,
      productId,
    });
    return favourite;
  } catch (error) {
    logger.error(
      'Failed to add to user favourites',
      'ADD_TO_USER_FAVOURITES',
      'ADD_TO_USER_FAVOURITES_FAILURE',
      error,
      { userId, productId },
    );
    throw error;
  }
};

const getUserFavourites = async (userId, queryOptions) => {
  try {
    const favourites = await FavouriteRepository.getUserFavourites(
      userId,
      queryOptions,
    );
    return favourites;
  } catch (error) {
    logger.error(
      'Failed to fetch user favourites',
      'GET_USER_FAVOURITES',
      'GET_USER_FAVOURITES_FAILURE',
      error,
      { userId },
    );
    throw error;
  }
};

const removeFromUserFavourites = async ({ userId, productId }) => {
  try {
    const favourite = await FavouriteRepository.removeFromUserFavourites({
      userId,
      productId,
    });
    return favourite;
  } catch (error) {
    logger.error(
      'Failed to remove from user favourites',
      'REMOVE_FROM_USER_FAVOURITES_FAILURE',
      'REMOVE_FROM_USER_FAVOURITES',
      error,
      { userId, productId },
    );
    throw error;
  }
};

// Check if a product is in user's favorites
const isProductInFavorites = async ({ userId, productId }) => {
  try {
    const isInFavorites = await FavouriteRepository.isProductInFavorites({
      userId,
      productId,
    });
    return isInFavorites;
  } catch (error) {
    logger.error(
      'Failed to check if product is in favorites',
      'CHECK_PRODUCT_IN_FAVOURITES_FAILURE',
      'CHECK_PRODUCT_IN_FAVOURITES',
      error,
      { userId, productId },
    );
    throw error;
  }
};

// Get count of user's favorites
const getUserFavouritesCount = async (userId) => {
  try {
    const count = await FavouriteRepository.getUserFavouritesCount(userId);
    return count;
  } catch (error) {
    logger.error(
      'Failed to get user favourites count',
      'GET_USER_FAVOURITES_COUNT_FAILURE',
      'GET_USER_FAVOURITES_COUNT',
      error,
      { userId },
    );
    throw error;
  }
};

// Clear all favorites for a user
const clearUserFavourites = async (userId) => {
  try {
    const result = await FavouriteRepository.clearUserFavourites(userId);
    return result;
  } catch (error) {
    logger.error(
      'Failed to clear user favourites',
      'CLEAR_USER_FAVOURITES_FAILURE',
      'CLEAR_USER_FAVOURITES',
      error,
      { userId },
    );
    throw error;
  }
};

const FavouriteService = {
  addToUserFavourites,
  getUserFavourites,
  removeFromUserFavourites,
  isProductInFavorites,
  getUserFavouritesCount,
  clearUserFavourites,
};

module.exports = { FavouriteService };
