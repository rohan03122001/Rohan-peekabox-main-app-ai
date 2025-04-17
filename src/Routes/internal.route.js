const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validateRequest');
const validateOrderSearch = require('../validations/orderSearch.validation');

const { BrandValidation } = require('../validations/brand.validation');
const { OrderValidation } = require('../validations/order.validation');
const { BrandController } = require('../Controllers/brand.controller');
const { StoreAuthController } = require('../Controllers/storeAuth.controller');
const { OrderController } = require('../Controllers/order.controller');

const { AuthMiddleware } = require('../middleware/auth.middleware');

const createAuthMiddleware = (options = {}) => {
  const { excludePaths = [] } = options;

  return (req, res, next) => {
    if (excludePaths.includes(req.path)) {
      return next();
    }
    return AuthMiddleware.authenticateInternalToken(req, res, next);
  };
};

router.use(
  createAuthMiddleware({
    excludePaths: [
      '/auth/initAuth',
      '/auth/triggerOTP',
      '/auth/verifyOTP',
      '/auth/logIn',
      '/brand/auth/initAuth',
      '/brand/auth/triggerOTP',
      '/brand/auth/verifyOTP',
      '/brand/auth/logIn',
    ],
  }),
);

// auth
// Brand auth ---------------------------------------------------------------------------------

router.post(
  '/brand/auth/initAuth',
  StoreAuthController.BrandinitAuth,
);

router.post(
  '/brand/auth/triggerOTP',
  StoreAuthController.BrandtriggerOTP,
);

router.post(
  '/brand/auth/verifyOTP',
  AuthMiddleware.setAuthType,
  StoreAuthController.BrandverifyOTP,
);

router.post(
  '/brand/auth/logIn',
  AuthMiddleware.setAuthType,
  StoreAuthController.BrandlogIn,
);

router.post(
  '/brand/auth/logOut',
  AuthMiddleware.setAuthType,
  StoreAuthController.BrandlogOut,
);

// brands
router.get(
  '/brands',
  validateRequest(BrandValidation.getBrandsSchema),
  BrandController.getBrands,
);

router.get(
  '/brand/:brandId',
  validateRequest(BrandValidation.getBrandByIdSchema),
  BrandController.getBrandById,
);

router.post(
  '/brand/Update/:brandId',
  AuthMiddleware.setAuthType,
  BrandController.updateBrand,
);


// get stores by brand 
router.get(
  '/brand/store/:brandId',
  AuthMiddleware.setAuthType,
  BrandController.getStoreByBrandId,
);




module.exports = router;
