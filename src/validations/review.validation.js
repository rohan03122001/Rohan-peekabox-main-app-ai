const Joi = require('joi');

const postStoreReviewSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  }),
};

const modifyStoreReviewSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
    reviewId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    rating: Joi.number().min(1).max(5),
  })
    .min(1)
    .message('No valid fields provided for update')
    .options({ presence: 'optional' }),
};

const removeStoreReviewSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
    reviewId: Joi.string().hex().length(24).required(),
  }),
};

const getStoreReviewsSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

// Schema for getting a store's average rating
const getStoreAverageRatingSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
  }),
};

// Schema for getting stores sorted by rating
const getStoresSortedByRatingSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    minRating: Joi.number().min(0).max(5).default(0),
  }),
};

// Schema for getting products from top-rated stores
const getProductsFromTopRatedStoresSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    minRating: Joi.number().min(0).max(5).default(0),
    category: Joi.string().optional(),
  }),
};

const ReviewValidation = {
  postStoreReviewSchema,
  getStoreReviewsSchema,
  removeStoreReviewSchema,
  modifyStoreReviewSchema,
  getStoreAverageRatingSchema,
  getStoresSortedByRatingSchema,
  getProductsFromTopRatedStoresSchema,
};

module.exports = { ReviewValidation };
