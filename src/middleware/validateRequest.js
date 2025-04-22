const validateRequest = (schema) => (req, _, next) => {
  try {
    const validated = {};

    // Loop through each property defined in the schema
    for (const property of Object.keys(schema)) {
      if (!schema[property]) continue;

      // Validate the property (body, params, query, etc.)
      const { error, value } = schema[property].validate(req[property], {
        abortEarly: false, // Return all errors, not just the first one
        stripUnknown: true,
      });

      if (error) {
        // Format the error for better readability
        const formattedError = new Error('Validation Error');
        formattedError.status = 400;
        formattedError.details = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));

        // Log the validation error
        console.error('Validation error:', {
          property,
          reqValue: req[property],
          errors: formattedError.details,
        });

        return next(formattedError);
      }

      validated[property] = value;
    }

    // Attach all validated data to request
    Object.keys(validated).forEach((property) => {
      req[property] = validated[property];
    });

    next();
  } catch (err) {
    console.error('Unexpected error in validation middleware:', err);
    next(err);
  }
};

module.exports = validateRequest;
