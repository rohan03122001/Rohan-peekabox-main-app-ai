const { Favourite } = require('../models/favourite.schema');
const logger = require('../config/logger');
const mongoose = require('mongoose');
const { ClientErrors } = require('../errors/clientErrors');
const { Product } = require('../models/Product/product.schema');

const addToUserFavourites = async ({ userId, productId }) => {
  try {
    // Check IDs are valid MongoDB ObjectIds
    const userObjId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const productObjId = mongoose.Types.ObjectId.isValid(productId)
      ? new mongoose.Types.ObjectId(productId)
      : productId;

    // Check if already in favorites
    const existingFavorite = await Favourite.findOne({
      userId: userObjId,
      productId: productObjId,
    });

    if (existingFavorite) {
      throw new ClientErrors.ConflictError('Product already in favorites');
    }

    // Create and save the new favorite
    const favourite = new Favourite({
      userId: userObjId,
      productId: productObjId,
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

const getUserFavourites = async (userId, queryOptions = {}) => {
  try {
    const { page = 1, limit = 20 } = queryOptions;
    const skip = (page - 1) * limit;

    // Check userId is a valid MongoDB ObjectId
    const userObjId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    // Find favorites with pagination
    const favourites = await Favourite.find({ userId: userObjId })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Favourite.countDocuments({ userId: userObjId });
    const totalPages = Math.ceil(totalCount / limit);

    // If no favorites found, return empty array with pagination
    if (favourites.length === 0) {
      return {
        favourites: [],
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }

    // Extract product IDs
    const productIds = favourites.map((fav) => fav.productId);

    // Get product details
    const products = await Product.find({
      _id: { $in: productIds },
    }).lean();

    // Combine favorite info with product details
    const favouritesWithDetails = favourites.map((fav) => {
      const product = products.find(
        (p) => p._id.toString() === fav.productId.toString(),
      );
      return {
        _id: fav._id,
        userId: fav.userId,
        productId: fav.productId,
        createdAt: fav.createdAt,
        product: product || null,
      };
    });

    return {
      favourites: favouritesWithDetails,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
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
    // Check IDs are valid MongoDB ObjectIds
    const userObjId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const productObjId = mongoose.Types.ObjectId.isValid(productId)
      ? new mongoose.Types.ObjectId(productId)
      : productId;

    const favourite = await Favourite.findOneAndDelete({
      userId: userObjId,
      productId: productObjId,
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

// Check if a product is in user's favorites
const isProductInFavorites = async ({ userId, productId }) => {
  try {
    // Check IDs are valid MongoDB ObjectIds
    const userObjId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const productObjId = mongoose.Types.ObjectId.isValid(productId)
      ? new mongoose.Types.ObjectId(productId)
      : productId;

    const favourite = await Favourite.findOne({
      userId: userObjId,
      productId: productObjId,
    }).exec();

    return !!favourite; // Returns true if found, false if not
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
    // Ensure userId is a valid MongoDB ObjectId
    const userObjId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const count = await Favourite.countDocuments({ userId: userObjId });
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
    // Ensure userId is a valid MongoDB ObjectId
    const userObjId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const result = await Favourite.deleteMany({ userId: userObjId });
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

const FavouriteRepository = {
  addToUserFavourites,
  getUserFavourites,
  removeFromUserFavourites,
  isProductInFavorites,
  getUserFavouritesCount,
  clearUserFavourites,
};

module.exports = { FavouriteRepository };
