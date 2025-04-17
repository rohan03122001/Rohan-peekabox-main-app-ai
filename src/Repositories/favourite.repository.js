const { Favourite } = require('../models/favourite.schema');
const logger = require('../config/logger');
const mongoose = require('mongoose');
const { ClientErrors } = require('../errors/clientErrors');

const addToUserFavourites = async ({ userId, productId }) => {
  try {
    const favourite = new Favourite({
      userId,
      productId,
    });

    await favourite.save();
    return favourite;
  } catch (error) {
    if (error.code === 11000) {
      throw new ClientErrors.ConflictError('Product already in favorites');
    }

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
    const favourites = await Favourite.find({ userId }).exec();
    return favourites;
  } catch (error) {
    logger.error(
      'Failed to fetch user favourites',
      'GET_USER_FAVOURITES_FAILURE',
      'GET_USER_FAVOURITES',
      error,
      { userId },
    );
    throw error;
  }
};

const removeFromUserFavourites = async ({ userId, productId }) => {
  try {
    const favourite = await Favourite.findOneAndDelete({
      userId,
      productId,
    }).exec();

    if (!favourite) {
      throw new ClientErrors.NotFoundError('Favourite not found');
    }

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

const FavouriteRepository = {
  addToUserFavourites,
  getUserFavourites,
  removeFromUserFavourites,
};

module.exports = { FavouriteRepository };
