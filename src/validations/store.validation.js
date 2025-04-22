const Joi = require('joi');

const getStoresByBrandIdSchema = {
  params: Joi.object({
    brandId: Joi.string().hex().length(24).required(),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

const getStoreByIdSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
  }),
};

const getStoresByDistanceSchema = {
  query: Joi.object({
    latitude: Joi.number().min(-90).max(90).required().messages({
      'number.base': 'Latitude must be a number',
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90',
      'any.required': 'Latitude is required',
    }),
    longitude: Joi.number().min(-180).max(180).required().messages({
      'number.base': 'Longitude must be a number',
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180',
      'any.required': 'Longitude is required',
    }),
    radius: Joi.number().positive().default(10).messages({
      'number.base': 'Radius must be a number',
      'number.positive': 'Radius must be positive',
    }),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
  }),
};

const updateStoreByIdSchema = Joi.object({
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional().trim(),
    offersDelivery: Joi.boolean(),
    description: Joi.string().min(10).max(1000).optional().trim(),
    managerName: Joi.string().min(2).max(50).optional(),
    category: Joi.string().min(2).max(50).optional(),
    image: Joi.string().uri().max(2000).optional(),
    contactDetails: Joi.object({
      phone: Joi.object({
        countryCode: Joi.string().min(2).max(5).optional(),
        number: Joi.string().min(5).max(15).optional(),
      }).optional(),
      email: Joi.string().email().min(5).max(255).optional().trim().lowercase(),
    }).optional(),
    address: Joi.object({
      street: Joi.string().min(3).max(100).optional(),
      area: Joi.string().min(2).max(100).optional(),
      city: Joi.string().min(2).max(50).optional(),
      country: Joi.string().min(2).max(50).optional(),
    }).optional(),
    location: Joi.object({
      type: Joi.string().valid('Point').optional(),
      coordinates: Joi.array()
        .items(Joi.number().min(-180).max(180), Joi.number().min(-90).max(90))
        .length(2)
        .optional(),
    }).optional(),
    operatingHours: Joi.array()
      .min(1)
      .max(7)
      .items(
        Joi.object({
          day: Joi.string()
            .valid(
              'MONDAY',
              'TUESDAY',
              'WEDNESDAY',
              'THURSDAY',
              'FRIDAY',
              'SATURDAY',
              'SUNDAY',
            )
            .optional(),
          open: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .optional()
            .messages({
              'string.pattern.base': 'Please enter open time in HH:MM format',
            }),
          close: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .optional()
            .messages({
              'string.pattern.base': 'Please enter close time in HH:MM format',
            }),
        }).optional(),
      )
      .optional(),
    isDeleted: Joi.boolean().default(false).optional(),
    deletedAt: Joi.date().optional(),
  })
    .min(1)
    .message('No valid fields provided for update')
    .options({ presence: 'optional' }),
});

const deleteStoreByIdSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
  }),
};

const StoreValidation = {
  getStoresByBrandIdSchema,
  getStoreByIdSchema,
  getStoresByDistanceSchema,
  updateStoreByIdSchema,
  deleteStoreByIdSchema,
};

module.exports = {
  StoreValidation,
};
