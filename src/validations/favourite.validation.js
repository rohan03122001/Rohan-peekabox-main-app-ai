const Joi = require('joi');

const addToUserFavouritesSchema = {
  params: Joi.object({
    productId: Joi.string().hex().length(24).required(),
  }),
};

const getUserFavouritesSchema = {
  params: Joi.object({}),
};

const removeFromUserFavouritesSchema = {
  params: Joi.object({
    productId: Joi.string().hex().length(24).required(),
  }),
};

const FavouriteValidation = {
  addToUserFavouritesSchema,
  getUserFavouritesSchema,
  removeFromUserFavouritesSchema,
};

module.exports = { FavouriteValidation };
