const mongoose = require('mongoose');
const Review = require('../models/review.schema');
const { ClientErrors } = require('../errors/clientErrors');
const logger = require('./../config/logger');
const { Types } = require('mongoose');
const Store = require('../models/Store/store.schema');
const { Product } = require('../models/Product/product.schema');

const findStoreById = async (storeId) => {
  try {
    const store = await Store.findOne({ _id: storeId });

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

// Get average rating for a store
const getStoreAverageRating = async (storeId) => {
  try {
    const result = await Review.aggregate([
      { $match: { storeId: Types.ObjectId.createFromHexString(storeId) } },
      {
        $group: {
          _id: '$storeId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]).exec();

    if (result.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    return {
      averageRating: parseFloat(result[0].averageRating.toFixed(1)),
      totalReviews: result[0].totalReviews,
    };
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
const getStoresSortedByRating = async ({
  page = 1,
  limit = 20,
  minRating = 0,
}) => {
  try {
    const skip = (page - 1) * limit;

    // First check if there are any reviews in the system
    const hasReviews = (await Review.countDocuments()) > 0;
    if (!hasReviews) {
      // If no reviews, return stores sorted by standard criteria
      const stores = await Store.find({ isDeleted: { $ne: true } })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      const totalCount = await Store.countDocuments({
        isDeleted: { $ne: true },
      });
      const totalPages = Math.ceil(totalCount / limit);

      return {
        stores: stores.map((store) => ({
          ...store,
          averageRating: 0,
          reviewCount: 0,
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }

    // Use aggregation to calculate average rating for each store
    const result = await Review.aggregate([
      // Group by storeId to calculate average rating for each store
      {
        $group: {
          _id: '$storeId',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
      // Filter by minimum rating if provided
      {
        $match: {
          averageRating: { $gte: minRating },
        },
      },
      // Sort by average rating (descending)
      { $sort: { averageRating: -1 } },
      // Add pagination
      {
        $facet: {
          storeRatings: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]).exec();

    const storeRatings = result[0].storeRatings || [];
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // If no stores meet the rating criteria, return empty array
    if (storeRatings.length === 0) {
      return {
        stores: [],
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }

    // Get storeIds from the results
    const storeIds = storeRatings.map((item) => item._id);

    // Fetch the store details
    const stores = await Store.find({
      _id: { $in: storeIds },
      isDeleted: { $ne: true },
    }).lean();

    // Combine store details with rating information
    const storesWithRatings = storeIds
      .map((storeId) => {
        const store = stores.find(
          (s) => s._id.toString() === storeId.toString(),
        );
        const ratingInfo = storeRatings.find(
          (r) => r._id.toString() === storeId.toString(),
        );

        if (!store) return null;

        return {
          ...store,
          averageRating: ratingInfo
            ? parseFloat(ratingInfo.averageRating.toFixed(1))
            : 0,
          reviewCount: ratingInfo ? ratingInfo.reviewCount : 0,
        };
      })
      .filter((store) => store !== null);

    return {
      stores: storesWithRatings,
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
      'Failed to get stores sorted by rating',
      'GET_STORES_SORTED_BY_RATING',
      'GET_STORES_SORTED_BY_RATING_ERROR',
      error,
    );
    throw error;
  }
};

// Get products from top-rated stores
const getProductsFromTopRatedStores = async ({
  page = 1,
  limit = 20,
  categoryFilter,
  minRating = 0,
}) => {
  try {
    const skip = (page - 1) * limit;

    // First get the top-rated stores
    const topStoresResult = await getStoresSortedByRating({
      page: 1,
      limit: 20, // Get top 20 stores
      minRating,
    });

    const topStoreIds = topStoresResult.stores.map((store) => store._id);

    if (topStoreIds.length === 0) {
      return {
        products: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    // Prepare query to find products from these stores
    let productQuery = {
      storeId: { $in: topStoreIds },
    };

    // Add category filter if provided
    if (categoryFilter) {
      productQuery.category = categoryFilter;
    }

    // Get count for pagination
    const totalCount = await Product.countDocuments(productQuery);
    const totalPages = Math.ceil(totalCount / limit);

    // Get products with pagination
    const products = await Product.find(productQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    // Add store rating info to each product
    const productsWithStoreRatings = products.map((product) => {
      const store = topStoresResult.stores.find(
        (s) => s._id.toString() === product.storeId.toString(),
      );

      return {
        ...product,
        storeRating: store ? store.averageRating : 0,
        storeReviewCount: store ? store.reviewCount : 0,
      };
    });

    return {
      products: productsWithStoreRatings,
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
      'Failed to get products from top rated stores',
      'GET_PRODUCTS_FROM_TOP_RATED_STORES',
      'GET_PRODUCTS_FROM_TOP_RATED_STORES_ERROR',
      error,
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
  getStoreAverageRating,
  getStoresSortedByRating,
  getProductsFromTopRatedStores,
};

module.exports = { ReviewRepository };
