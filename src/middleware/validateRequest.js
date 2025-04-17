const validateRequest = (schema) => (req, _, next) => {
  const validated = {};

  // Loop through each property defined in the schema
  for (const property of Object.keys(schema)) {
    if (!schema[property]) return;

    const { error, value } = schema[property].validate(req[property], {
      abortEarly: true,
      stripUnknown: true,
    });

    if (error) {
      return next(error);
    }

    validated[property] = value;
  }

  // Attach all validated data to request
  Object.keys(validated).forEach((property) => {
    req[property] = validated[property];
  });

  next();
};

module.exports = validateRequest;
