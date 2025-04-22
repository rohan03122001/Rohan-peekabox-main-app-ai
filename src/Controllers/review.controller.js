const { ReviewService } = require('../Services/review.service');
const mongoose = require('mongoose');
const { ClientErrors } = require('./../errors/clientErrors');
const logger = require('./../config/logger');

const postStoreReview = async (req, res, next) => {
  const { storeId } = req.params;
  const { title, description, rating } = req.body;

  try {
    const userId = req.user?.id;
    const result = await ReviewService.postStoreReview({
      title,
      description,
      rating,
      userId,
      storeId,
    });
    res.status(201).json(result);
  } catch (error) {
    logger.error(
      'Failed to post store review',
      'POST_STORE_REVIEW',
      'POST_STORE_REVIEW_ERROR',
      error,
      { storeId, userId: req.user?.id },
    );
    return next(error);
  }
};

const modifyStoreReview = async (req, res, next) => {
  try {
    const { storeId, reviewId } = req.params;
    const reviewData = req.body;
    const userId = req.user?.id;
    const reviewUpdates = {};
    for (const [key, value] of Object.entries(reviewData)) {
      if (value !== undefined) {
        reviewUpdates[key] = value;
      }
    }
    const result = await ReviewService.modifyStoreReview(
      userId,
      storeId,
      reviewId,
      reviewUpdates,
    );

    res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to update store review',
      'UPDATE_STORE_REVIEW',
      'UPDATE_STORE_REVIEW_ERROR',
      error,
      { storeId: req.params.storeId, reviewId: req.params.reviewId },
    );
    return next(error);
  }
};

const removeStoreReview = async (req, res, next) => {
  const { storeId, reviewId } = req.params;
  try {
    await ReviewService.removeStoreReview({
      storeId,
      reviewId,
    });

    res.status(200).json({
      message: `Review with id:${reviewId} deleted successfully`,
    });
  } catch (error) {
    logger.error(
      'Failed to remove store review',
      'DELETE_STORE_REVIEW',
      'DELETE_STORE_REVIEW_ERROR',
      error,
      { storeId: req.params.storeId, reviewId: req.params.reviewId },
    );
    return next(error);
  }
};

const getStoreReviews = async (req, res, next) => {
  const { storeId } = req.params;
  const { page, limit, sort } = req.query;
  try {
    const result = await ReviewService.getStoreReviews({
      storeId,
      page,
      limit,
      sort,
    });
    res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to fetch store reviews',
      'GET_STORE_REVIEWS',
      'GET_STORE_REVIEWS_ERROR',
      error,
      { storeId: req.params.storeId },
    );
    return next(error);
  }
};

// Get a store's average rating
const getStoreAverageRating = async (req, res, next) => {
  const { storeId } = req.params;
  try {
    const ratingData = await ReviewService.getStoreAverageRating(storeId);
    res.status(200).json(ratingData);
  } catch (error) {
    logger.error(
      'Failed to get store average rating',
      'GET_STORE_AVERAGE_RATING',
      'GET_STORE_AVERAGE_RATING_ERROR',
      error,
      { storeId: req.params.storeId },
    );
    return next(error);
  }
};

// Get stores sorted by rating
const getStoresSortedByRating = async (req, res, next) => {
  try {
    const { page, limit, minRating } = req.query;
    const result = await ReviewService.getStoresSortedByRating({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      minRating: parseFloat(minRating) || 0,
    });
    res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to get stores sorted by rating',
      'GET_STORES_SORTED_BY_RATING',
      'GET_STORES_SORTED_BY_RATING_ERROR',
      error,
    );
    return next(error);
  }
};

// Get products from top-rated stores
const getProductsFromTopRatedStores = async (req, res, next) => {
  try {
    const { page, limit, minRating, category } = req.query;

    // Log the parameters
    console.log('Getting products from top rated stores with params:', {
      page,
      limit,
      minRating,
      category,
    });

    const result = await ReviewService.getProductsFromTopRatedStores({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      minRating: parseFloat(minRating) || 0,
      category,
    });

    res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to get products from top rated stores',
      'GET_PRODUCTS_FROM_TOP_RATED_STORES',
      'GET_PRODUCTS_FROM_TOP_RATED_STORES_ERROR',
      error,
    );
    return next(error);
  }
};

const ReviewController = {
  postStoreReview,
  modifyStoreReview,
  removeStoreReview,
  getStoreReviews,
  getStoreAverageRating,
  getStoresSortedByRating,
  getProductsFromTopRatedStores,
};

module.exports = { ReviewController };
