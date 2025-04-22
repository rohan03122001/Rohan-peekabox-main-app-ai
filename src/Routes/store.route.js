const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validateRequest');
const { StoreController } = require('../Controllers/store.controller');
const { ProductController } = require('../Controllers/product.controller');
const { BrandController } = require('../Controllers/brand.controller');
const { StoreAuthController } = require('../Controllers/storeAuth.controller');
const { OrderController } = require('../Controllers/order.controller');

const { ProductValidation } = require('../validations/product.validation');
const { StoreAuthValidation } = require('../validations/storeAuth.validation');
const { StoreValidation } = require('../validations/store.validation');
const { BrandValidation } = require('../validations/brand.validation');
const { OrderValidation } = require('../validations/order.validation');

const { AuthMiddleware } = require('../middleware/auth.middleware');
const { StoreMiddleware } = require('../middleware/store.middleware');
const { PaymentController } = require('../Controllers/payment.controller');
const upload = require('../middleware/imageupload'); // Adjust the path based on where your upload.js is located

const createAuthMiddleware = (options = {}) => {
  const { excludePaths = [] } = options;

  return (req, res, next) => {
    if (excludePaths.includes(req.path)) {
      return next();
    }
    return AuthMiddleware.authenticateStoreToken(req, res, next);
  };
};

router.use(
  createAuthMiddleware({
    excludePaths: [
      '/auth/initAuth',
      '/auth/triggerOTP',
      '/auth/verifyOTP',
      '/auth/logIn',
      '/stores/nearby',
      '/stores/distance',
    ],
  }),
);

// auth
router.post(
  '/auth/initAuth',
  validateRequest(StoreAuthValidation.initAuthSchema),
  StoreAuthController.initAuth,
);

router.post(
  '/auth/triggerOTP',
  validateRequest(StoreAuthValidation.triggerOTPSchema),
  StoreAuthController.triggerOTP,
);

router.post(
  '/auth/verifyOTP',
  //validateRequest(StoreAuthValidation.verifyOTPSchema),
  AuthMiddleware.setAuthType,
  StoreAuthController.verifyOTP,
);

router.post(
  '/auth/logIn',
  validateRequest(StoreAuthValidation.logInSchema),
  AuthMiddleware.setAuthType,
  StoreAuthController.logIn,
);

router.post(
  '/auth/refresh',
  validateRequest(StoreAuthValidation.refreshSchema),
  StoreAuthController.refresh,
);

router.post(
  '/auth/updatePassword',
  validateRequest(StoreAuthValidation.updatePasswordSchema),
  StoreAuthController.updatePassword,
);

router.post(
  '/auth/logOut',
  validateRequest(StoreAuthValidation.logOutSchema),
  AuthMiddleware.setAuthType,
  StoreAuthController.logOut,
);

//------------------------------------------------------------------------

// brands
router.get(
  '/brand/:brandId',
  validateRequest(BrandValidation.getBrandByIdSchema),
  BrandController.getBrandById,
);

// stores
router.get(
  '/store/:storeId',
  validateRequest(StoreValidation.getStoreByIdSchema),
  StoreMiddleware.validateStorePermission,
  StoreController.getStoreById,
);

// get store by radius (original)
router.post(
  '/store/nearby',
  //validateRequest(StoreValidation.getStoreByIdSchema),
  StoreController.getStoreByRadius,
);

// get stores by distance
router.get(
  '/stores/distance',
  validateRequest(StoreValidation.getStoresByDistanceSchema),
  StoreController.getStoresByDistance,
);

router.get(
  '/brand/:brandId/stores',
  validateRequest(StoreValidation.getStoresByBrandIdSchema),
  StoreController.getStoresByBrandId,
);

router.post(
  '/store/:storeId',
  //validateRequest(StoreValidation.updateStoreByIdSchema),
  //StoreMiddleware.validateStorePermission,
  StoreController.updateStoreById,
); // TODO: only for store with check for ownership using JWT

router.delete(
  '/store/:storeId',
  validateRequest(StoreValidation.deleteStoreByIdSchema),
  StoreMiddleware.validateStorePermission,
  StoreController.deleteStoreById,
); // TODO: only for store with check for ownership using JWT

// products
router.get(
  '/:storeId/products',
  validateRequest(ProductValidation.getProductsByStoreIdSchema),
  StoreMiddleware.validateStorePermission,
  ProductController.getProductsByStoreId,
);

router.get(
  '/:storeId/product/:productId',
  //validateRequest(ProductValidation.getProductByIdSchema),
  StoreMiddleware.validateStorePermission,
  ProductController.getProductById,
);

router.post(
  '/:storeId/product',
  //validateRequest(ProductValidation.createStoreProductSchema),
  StoreMiddleware.validateStorePermission,
  ProductController.createStoreProduct,
);

// Product image upload
router.post('/ProductUpload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ imageUrl: req.file.location }); // Return S3 URL
});

router.post(
  '/:storeId/product/:productId',
  validateRequest(ProductValidation.updateStoreProductSchema),
  StoreMiddleware.validateStorePermission,
  ProductController.verifyProductOwnership,
  ProductController.updateStoreProduct,
);

router.delete(
  '/:storeId/product/:productId',
  validateRequest(ProductValidation.deleteStoreProductSchema),
  StoreMiddleware.validateStorePermission,
  //ProductController.verifyProductOwnership,
  ProductController.deleteStoreProduct,
);

// orders
router.get(
  '/:storeId/orders/:orderId',
  validateRequest(OrderValidation.getStoreOrderByIdSchema),
  StoreMiddleware.validateStorePermission,
  OrderController.getStoreOrderById,
);

router.get(
  '/:storeId/orders',
  validateRequest(OrderValidation.getStoreOrderschema),
  StoreMiddleware.validateStorePermission,
  OrderController.getStoreOrders,
);

router.get(
  '/:storeId/ordersToday',
  validateRequest(OrderValidation.getStoreOrderschema),
  StoreMiddleware.validateStorePermission,
  OrderController.getOrderToday,
);

// Order as complete
router.post(
  '/:storeId/orders/:orderId/complete',
  //validateRequest(OrderValidation.markCompletedSchema),
  StoreMiddleware.validateStorePermission,
  OrderController.markCompleted,
);

// Cancel Order
router.post(
  '/:storeId/orders/:orderId/cancel',
  //validateRequest(OrderValidation.markCompletedSchema),
  StoreMiddleware.validateStorePermission,
  OrderController.markCancelled,
);

// search
router.get('/orders/search', OrderController.searchOrders);

//Payments

// add validation later on
router.get(
  '/payments/:storeId/:page/:pageSize',
  PaymentController.getPaymentByStoreId,
);

// Get total sales, commission, total quantity
router.get(
  '/paymentTotalSalesDeatils/:storeId',
  PaymentController.getTotalSalesDeatils,
);

// search
router.get('/payment/search', PaymentController.searchPayment);

// Sales
router.post(
  '/getDateSalesQuantityByProductId',
  ProductController.getSalesByProductId,
);

module.exports = router;
