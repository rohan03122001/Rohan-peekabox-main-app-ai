const Joi = require('joi');

const getBrandsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

const getBrandByIdSchema = {
  params: Joi.object({
    brandId: Joi.string().hex().length(24).required(),
  }),
};

const createBrandSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).trim().required(),
    email: Joi.string().email().min(5).max(255).required().trim().lowercase(),
    image: Joi.string().uri().required(),
    country: Joi.string().min(2).max(100).required(),
    registrationNumber: Joi.string().min(2).max(100).required(),
    isDeleted: Joi.boolean().default(false),
    deletedAt: Joi.date().optional(),
  }),
};

const updateBrandSchema = {
  params: Joi.object({
    brandId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    name: Joi.string().min(2).max(100).trim().optional(),
    email: Joi.string().email().min(5).max(255).optional().trim().lowercase(),
    image: Joi.string().uri().optional(),
    country: Joi.string().min(2).max(100).optional(),
    registrationNumber: Joi.string().min(2).max(100).optional(),
    isDeleted: Joi.boolean().optional(),
    deletedAt: Joi.date().optional(),
  }),
};

const deleteBrandByIdSchema = {
  params: Joi.object({
    brandId: Joi.string().hex().length(24).required(),
  }),
};

const BrandValidation = {
  getBrandsSchema,
  getBrandByIdSchema,
  createBrandSchema,
  updateBrandSchema,
  deleteBrandByIdSchema,
};

module.exports = {
  BrandValidation,
};
