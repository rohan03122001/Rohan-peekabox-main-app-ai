const { ReviewService } = require('../Services/review.service');
const mongoose = require('mongoose');
const { ClientErrors } = require('./../errors/clientErrors');
const logger = require('./../config/logger');

const postStoreReview = async (req, res, next) => {
  const { storeId } = req.params;
  const { title, description, rating } = req.body;

  // TODO: Add check for verified purchase

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
      { storeId, userId },
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

const removeStoreReview = async (req, res) => {
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

const ReviewController = {
  postStoreReview,
  modifyStoreReview,
  removeStoreReview,
  getStoreReviews,
};

module.exports = { ReviewController };
