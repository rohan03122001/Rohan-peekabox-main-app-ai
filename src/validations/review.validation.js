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

const ReviewValidation = {
  postStoreReviewSchema,
  getStoreReviewsSchema,
  removeStoreReviewSchema,
  modifyStoreReviewSchema,
};

module.exports = { ReviewValidation };
