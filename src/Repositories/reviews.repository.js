const mongoose = require('mongoose');
const Review = require('../models/review.schema');
const { ClientErrors } = require('../errors/clientErrors');
const logger = require('./../config/logger');
const { Types } = require('mongoose');

const findStoreById = async (storeId) => {
  try {
    const store = await Review.findOne(storeId);

    if (!store) {
      throw new ClientErrors.NotFoundError('store not found');
    }
    return store;
  } catch (error) {
    logger.error('Failed to find store by id', 'find store error', error, {
      storeId,
    });
    throw error;
  }
};

const postStoreReview = async ({
  title,
  description,
  rating,
  userId,
  storeId,
}) => {
  try {
    const review = new Review({ title, description, rating, userId, storeId });
    await review.save();
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

const modifyStoreReview = async (userId, storeId, reviewId, reviewUpdates) => {
  try {
    const newReview = await Review.findOneAndUpdate(
      { _id: reviewId },
      { $set: reviewUpdates },
      { new: true, runValidators: true },
    );

    return newReview;
  } catch (error) {
    logger.error(
      'Failed to update review',
      'UPDATE_REVIEW',
      'UPDATE_REVIEW_ERROR',
      error,
      { userId, storeId, reviewId },
    );
    throw error;
  }
};

const deleteReview = async ({ storeId, reviewId }) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: Types.ObjectId.createFromHexString(reviewId),
    });

    return review;
  } catch (error) {
    logger.error(
      'Failed to delete review',
      'DELETE_REVIEW',
      'DELETE_REVIEW_ERROR',
      error,
      { storeId, reviewId },
    );
    throw error;
  }
};

const getStoreReviews = async ({ storeId, page, limit, sort }) => {
  try {
    const skip = (page - 1) * limit;

    const result = await Review.aggregate([
      { $match: { storeId: Types.ObjectId.createFromHexString(storeId) } },
      {
        $facet: {
          reviews: [
            { $sort: { createdAt: sort === 'asc' ? 1 : -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]).exec();

    const reviews = result[0].reviews;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    return {
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrePage: page > 1,
      },
    };
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

const ReviewRepository = {
  postStoreReview,
  modifyStoreReview,
  deleteReview,
  getStoreReviews,
  findStoreById,
};

module.exports = { ReviewRepository };
