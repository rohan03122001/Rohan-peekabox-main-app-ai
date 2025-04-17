const Joi = require('joi');

const brandValidationSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  email: Joi.string().email().min(5).max(255).required().trim().lowercase(),
  image: Joi.string().uri().required(),
  country: Joi.string().min(2).max(100).required(),
  registrationNumber: Joi.string().min(2).max(100).required(),
  isDeleted: Joi.boolean().default(false),
  deletedAt: Joi.date().optional(),
}).options({ abortEarly: false });

module.exports = brandValidationSchema;
