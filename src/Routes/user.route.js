const express = require('express');
const router = express.Router();

const { ProductValidation } = require('../validations/product.validation');
const { StoreValidation } = require('../validations/store.validation');
const { BrandValidation } = require('../validations/brand.validation');
const { UserAuthValidation } = require('../validations/userAuth.validation');
const { UserValidation } = require('../validations/user.validation');
const { ReviewValidation } = require('../validations/review.validation');
const { FavouriteValidation } = require('../validations/favourite.validation');
const { OrderValidation } = require('../validations/order.validation');

const { BrandController } = require('../Controllers/brand.controller');
const { ProductController } = require('../Controllers/product.controller');
const { StoreController } = require('../Controllers/store.controller');
const { UserAuthController } = require('../Controllers/userAuth.controller');
const { UserController } = require('../Controllers/user.controller');
const { OrderController } = require('../Controllers/order.controller');

const { AuthMiddleware } = require('../middleware/auth.middleware');
const { UserMiddleware } = require('../middleware/user.middleware');
const { ReviewController } = require('../Controllers/review.controller');
const { FavouriteController } = require('../Controllers/favourite.controller');
const {PaymentController} = require('../Controllers/payment.controller')

const validateRequest = require('../middleware/validateRequest');

const createAuthMiddleware = (options = {}) => {
  const { excludePaths = [] } = options;

  return (req, res, next) => {
    if (excludePaths.includes(req.path)) {
      return next();
    }
    return AuthMiddleware.authenticateUserToken(req, res, next);
  };
};

router.use(
  createAuthMiddleware({
    excludePaths: [
      '/auth/initAuth',
      '/auth/triggerOTP',
      '/auth/verifyOTP',
      '/auth/logIn',
      '/paymentSave',
    ],
  }),
);

// auth
router.post(
  '/auth/initAuth',
  validateRequest(UserAuthValidation.initAuthSchema),
  UserAuthController.initAuth,
);

router.post(
  '/auth/triggerOTP',
  validateRequest(UserAuthValidation.triggerOTPSchema),
  UserAuthController.triggerOTP,
);

router.post(
  '/auth/verifyOTP',
  validateRequest(UserAuthValidation.verifyOTPSchema),
  AuthMiddleware.setAuthType,
  UserAuthController.verifyOTP,
);

router.post(
  '/auth/logIn',
  validateRequest(UserAuthValidation.logInSchema),
  AuthMiddleware.setAuthType,
  UserAuthController.logIn,
);

router.post('/auth/refresh', UserAuthController.refresh);

router.post(
  '/auth/updatePassword',
  validateRequest(UserAuthValidation.updatePasswordSchema),
  UserAuthController.updatePassword,
);

router.post(
  '/auth/logOut',
  validateRequest(UserAuthValidation.logOutSchema),
  AuthMiddleware.setAuthType,
  UserAuthController.logOut,
);

// user
router.get(
  '/:userId',
  validateRequest(UserValidation.findByIdSchema),
  UserMiddleware.validateUserPermission,
  UserController.findById,
);

/*router.post(
  '/:userId',
  //validateRequest(UserValidation.updateByIdSchema),
  UserMiddleware.validateUserPermission,
  UserController.updateById,
); */

router.delete(
  '/:userId',
  validateRequest(UserValidation.deleteByIdSchema),
  UserMiddleware.validateUserPermission,
  UserController.deleteById,
); 

// orders
router.post(
  '/order',
 // validateRequest(OrderValidation.createSchema),
  //UserMiddleware.validateUserPermission,
  //StoreController.checkStoreExistence,
  //StoreController.checkDeliveryPossibility,
  //ProductController.checkProductAvailability,
  OrderController.create,
);

router.post(
  '/:userId/orders/:orderId/complete',
 validateRequest(OrderValidation.markCompletedSchema),
  UserMiddleware.validateUserPermission,
  OrderController.markCompleted,
);

router.get(
  '/:userId/orders',
 validateRequest(OrderValidation.getOrdersByUserIdSchema),
  UserMiddleware.validateUserPermission,
  OrderController.getOrdersByUserId,
);

router.get(
  '/:userId/orders/:orderId',
 validateRequest(OrderValidation.getUserOrderByIdSchema),
  UserMiddleware.validateUserPermission,
  OrderController.getUserOrderById,
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

// stores
router.get(
  '/:storeId',
 validateRequest(StoreValidation.getStoreByIdSchema),
  StoreController.getStoreById,
);

router.get(
  '/brand/:brandId',
 validateRequest(StoreValidation.getStoresByBrandIdSchema),
  StoreController.getStoresByBrandId,
);

// products
router.get(
  '/stores/:storeId/products',
  validateRequest(ProductValidation.getProductsByStoreIdSchema),
  ProductController.getProductsByStoreId,
);

router.get(
  '/stores/:storeId/product/:productId',
  validateRequest(ProductValidation.getProductByIdSchema),
  ProductController.getProductById,
);

// reviews
router.get(
  '/stores/:storeId/reviews',
  validateRequest(ReviewValidation.getStoreReviewsSchema),
  ReviewController.getStoreReviews,
);

router.post(
  '/stores/:storeId/reviews',
  validateRequest(ReviewValidation.postStoreReviewSchema),
  ReviewController.postStoreReview,
);

router.post(
  '/stores/:storeId/reviews/:reviewId',
  validateRequest(ReviewValidation.modifyStoreReviewSchema),
  ReviewController.modifyStoreReview,
);

router.delete(
  '/stores/:storeId/reviews/:reviewId',
  validateRequest(ReviewValidation.removeStoreReviewSchema),
  ReviewController.removeStoreReview,
);

// favourites
router.post(
  '/favourite/:productId',
 validateRequest(FavouriteValidation.addToUserFavouritesSchema),
  FavouriteController.addToUserFavourites,
);

router.get(
  '/favourites',
  validateRequest(FavouriteValidation.getUserFavouritesSchema),
  FavouriteController.getUserFavourites,
);

router.delete(
  '/favourite/:productId',
  validateRequest(FavouriteValidation.removeFromUserFavouritesSchema),
  FavouriteController.removeFromUserFavourites,
);


//Payment 
// This is just test router to store payment data 
router.post('/paymentSave',
  PaymentController.storePayment); 


module.exports = router;
