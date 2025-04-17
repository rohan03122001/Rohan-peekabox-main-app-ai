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
      storeId: objectId,
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
      { storeId },
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
};

module.exports = { ReviewService };
