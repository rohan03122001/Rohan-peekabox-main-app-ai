const Joi = require('joi');

const addToUserFavouritesSchema = {
  params: Joi.object({
    productId: Joi.string().hex().length(24).required(),
  }),
};

const getUserFavouritesSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
  }),
};

const removeFromUserFavouritesSchema = {
  params: Joi.object({
    productId: Joi.string().hex().length(24).required(),
  }),
};

const isProductInFavoritesSchema = {
  params: Joi.object({
    productId: Joi.string().hex().length(24).required(),
  }),
};

const getUserFavouritesCountSchema = {
  query: Joi.object({}),
};

const clearUserFavouritesSchema = {
  query: Joi.object({}),
};

const FavouriteValidation = {
  addToUserFavouritesSchema,
  getUserFavouritesSchema,
  removeFromUserFavouritesSchema,
  isProductInFavoritesSchema,
  getUserFavouritesCountSchema,
  clearUserFavouritesSchema,
};

module.exports = { FavouriteValidation };
