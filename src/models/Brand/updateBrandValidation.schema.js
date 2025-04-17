const Joi = require('joi');

const updateBrandValidationSchema = Joi.object({
  _id: Joi.string().hex().length(24).forbidden(),
  name: Joi.string().min(2).max(100).trim().optional(),
  email: Joi.string().email().min(5).max(255).optional().trim().lowercase(),
  image: Joi.string().uri().optional(),
  country: Joi.string().min(2).max(100).optional(),
  registrationNumber: Joi.string().min(2).max(100).optional(),
  isDeleted: Joi.boolean().optional(),
  deletedAt: Joi.date().optional(),
})
  .min(1)
  .message('No valid fields provided for update')
  .options({ abortEarly: false, presence: 'optional' });

module.exports = updateBrandValidationSchema;
