const { ReviewRepository } = require('../Repositories/reviews.repository');
const logger = require('./../config/logger');

const postStoreReview = async ({
  title,
  description,
  rating,
  userId,
  storeId,
}) => {
  try {
    const review = await ReviewRepository.postStoreReview({
      title,
      description,
      rating,
      userId,
      storeId,
    });
    return review;
  } catch (error) {
    logger.error(
      'Failed to post store review',
      'POST_STORE_REVIEW',
      'POST_STORE_REVIEW_ERROR',
      error,
      { storeId, userId },
    );
    throw error;
  }
};

const findStoreById = async (storeId) => {
  try {
    const store = await ReviewRepository.findStoreById(storeId);
    return store;
  } catch (error) {
    logger.error('Failed to find store by id', 'find store error', error, {
      storeId,
    });
    throw error;
  }
};

const modifyStoreReview = async (userId, storeId, reviewId, reviewUpdates) => {
  try {
    const updatedReview = await ReviewRepository.modifyStoreReview(
      userId,
      storeId,
      reviewId,
      reviewUpdates,
    );
    return updatedReview;
  } catch (error) {
    logger.error(
      'Failed to update store review',
      'UPDATE_STORE_REVIEW',
      'UPDATE_STORE_REVIEW_ERROR',
      error,
      { storeId, reviewId },
    );
    throw error;
  }
};

const removeStoreReview = async ({ storeId, reviewId }) => {
  try {
    const result = await ReviewRepository.deleteReview({ storeId, reviewId });
    return result;
  } catch (error) {
    logger.error(
      'Failed to remove store review',
      'DELETE_STORE_REVIEW',
      'DELETE_STORE_REVIEW_ERROR',
      error,
      { storeId, reviewId },
    );
    throw error;
  }
};

const getStoreReviews = async (queryOptions) => {
  try {
    const allReviews = await ReviewRepository.getStoreReviews(queryOptions);
    return allReviews;
  } catch (error) {
    logger.error(
      'Failed to fetch store reviews',
      'GET_STORE_REVIEWS',
      'GET_STORE_REVIEWS_ERROR',
      error,
      { storeId: queryOptions.storeId },
    );
    throw error;
  }
};

// Get average rating for a store
const getStoreAverageRating = async (storeId) => {
  try {
    const ratingData = await ReviewRepository.getStoreAverageRating(storeId);
    return ratingData;
  } catch (error) {
    logger.error(
      'Failed to get store average rating',
      'GET_STORE_AVERAGE_RATING',
      'GET_STORE_AVERAGE_RATING_ERROR',
      error,
      { storeId },
    );
    throw error;
  }
};

// Get stores sorted by rating
const getStoresSortedByRating = async (queryOptions) => {
  try {
    const { page = 1, limit = 20, minRating = 0 } = queryOptions;

    const result = await ReviewRepository.getStoresSortedByRating({
      page,
      limit,
      minRating: parseFloat(minRating),
    });

    return result;
  } catch (error) {
    logger.error(
      'Failed to get stores sorted by rating',
      'GET_STORES_SORTED_BY_RATING',
      'GET_STORES_SORTED_BY_RATING_ERROR',
      error,
      { queryOptions },
    );
    throw error;
  }
};

// Get products from top-rated stores
const getProductsFromTopRatedStores = async (queryOptions) => {
  try {
    const { page = 1, limit = 20, minRating = 0, category } = queryOptions;

    const result = await ReviewRepository.getProductsFromTopRatedStores({
      page,
      limit,
      categoryFilter: category,
      minRating: parseFloat(minRating),
    });

    return result;
  } catch (error) {
    logger.error(
      'Failed to get products from top rated stores',
      'GET_PRODUCTS_FROM_TOP_RATED_STORES',
      'GET_PRODUCTS_FROM_TOP_RATED_STORES_ERROR',
      error,
      { queryOptions },
    );
    throw error;
  }
};

const ReviewService = {
  postStoreReview,
  modifyStoreReview,
  removeStoreReview,
  getStoreReviews,
  findStoreById,
  getStoreAverageRating,
  getStoresSortedByRating,
  getProductsFromTopRatedStores,
};

module.exports = { ReviewService };
