const validateUserPermission = (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return res.status(403).json({
      message: 'Forbidden: You do not have permission to access this resource.',
    });
  }

  next();
};

const UserMiddleware = {
  validateUserPermission,
};

module.exports = { UserMiddleware };
