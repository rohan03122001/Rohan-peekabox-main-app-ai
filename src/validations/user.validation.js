const Joi = require('joi');

const findByIdSchema = {
  body: Joi.object({}),
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
};

const updateByIdSchema = {
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    address: {
      street: Joi.string(),
      city: Joi.string(),
      area: Joi.string(),
      country: Joi.string().valid('UAE', 'Saudi Arabia', 'Qatar'),
      postalCode: Joi.string(),
    },
    contactDetails: Joi.object({
      phone: Joi.object({
        countryCode: Joi.string().min(2).max(5).optional(),
        number: Joi.string().min(5).max(15).optional(),
      }).optional(),
    }).optional(),
  })
    .min(1)
    .message('No valid fields provided for update')
    .options({ presence: 'optional' }),
};

const deleteByIdSchema = {
  body: Joi.object({}),
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
};

const UserValidation = {
  findByIdSchema,
  updateByIdSchema,
  deleteByIdSchema,
};

module.exports = { UserValidation };
