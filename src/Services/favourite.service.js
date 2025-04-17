const { FavouriteRepository } = require('../Repositories/favourite.repository');
const { ProductRepository } = require('../Repositories/product.repository');
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

const getUserFavourites = async (userId) => {
  try {
    const favourites = await FavouriteRepository.getUserFavourites(userId);
    const productIds = favourites.map((favourite) => favourite.productId);

    const products = await ProductRepository.getProductsByIds(productIds);
    return products;
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

const FavouriteService = {
  addToUserFavourites,
  getUserFavourites,
  removeFromUserFavourites,
};

module.exports = { FavouriteService };
