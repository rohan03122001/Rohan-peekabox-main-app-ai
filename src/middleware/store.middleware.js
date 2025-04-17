const validateStorePermission = (req, res, next) => {
  if (req.store.id !== req.params.storeId) {
    return res.status(403).json({
      message: 'Forbidden: You do not have permission to access this resource.',
    });
  }

  next();
};

const StoreMiddleware = {
  validateStorePermission,
};

module.exports = { StoreMiddleware };
