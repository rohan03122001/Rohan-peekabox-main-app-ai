const Joi = require('joi');

const getProductsByStoreIdSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
    priceSort: Joi.string().valid('asc', 'desc').optional(),
    collectionDay: Joi.string()
      .valid(
        'today',
        'tomorrow',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      )
      .optional(),
  }),
};

//schema for getting products by collection day
const getProductsByCollectionDaySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
    priceSort: Joi.string().valid('asc', 'desc').optional(),
    collectionDay: Joi.string()
      .valid(
        'today',
        'tomorrow',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      )
      .default('today'),
    category: Joi.string().optional(),
  }),
};

// schema for getting products by category
const getProductsByCategorySchema = {
  params: Joi.object({
    category: Joi.string().required(),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
    priceSort: Joi.string().valid('asc', 'desc').optional(),
  }),
};

const getProductByIdSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
    productId: Joi.string().hex().length(24).required(),
  }),
};

const createStoreProductSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.object({
      amount: Joi.number().required(),
      currencyCode: Joi.string().default('AED').valid('AED'),
    }).required(),
    category: Joi.string().optional(), // Removed validation
    quantity: Joi.number().integer().required(),
    image: Joi.string().uri().required(),
    allergenInfo: Joi.array()
      .items(Joi.string().optional()) // Removed validation for allergens
      .default([]),
    collectionSchedule: Joi.object({
      day: Joi.string().optional(), // Removed validation for days
      timeWindow: Joi.object({
        start: Joi.string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .optional(), // Removed validation for time format
        end: Joi.string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .optional(), // Removed validation for time format
      }).optional(),
    }).optional(), // Made collectionSchedule optional
    isAvailable: Joi.boolean().default(true),
  }),
};

const updateStoreProductSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
    productId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    storeId: Joi.string().hex().length(24),
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.object({
      amount: Joi.number(),
      currencyCode: Joi.string().valid('AED').default('AED'),
    }),
    category: Joi.string().valid('BAKERY', 'GROCERY', 'MEALS', 'OTHERS'),
    quantity: Joi.number().integer(),
    image: Joi.string().uri(),
    allergenInfo: Joi.array().items(
      Joi.string().valid('NUTS', 'DAIRY', 'VEGAN', 'GLUTEN FREE', 'VEGETARIAN'),
    ),
    collectionSchedule: Joi.object({
      day: Joi.string().valid(
        'SUNDAY',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
      ),
      timeWindow: Joi.object({
        start: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        end: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
      }),
    }),
  })
    .min(1)
    .message('No valid fields provided for update')
    .options({ presence: 'optional' }),
};

const deleteStoreProductSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
    productId: Joi.string().hex().length(24).required(),
  }),
};

const ProductValidation = {
  getProductsByStoreIdSchema,
  getProductByIdSchema,
  createStoreProductSchema,
  updateStoreProductSchema,
  deleteStoreProductSchema,
  getProductsByCollectionDaySchema,
  getProductsByCategorySchema,
};

module.exports = {
  ProductValidation,
};
