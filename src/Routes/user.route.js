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
const { ReviewController } = require('../Controllers/review.controller');
const { FavouriteController } = require('../Controllers/favourite.controller');
const { PaymentController } = require('../Controllers/payment.controller');

const { AuthMiddleware } = require('../middleware/auth.middleware');
const { UserMiddleware } = require('../middleware/user.middleware');
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

//=====================================================================
// AUTHENTICATION ROUTES
//=====================================================================
// These come first as they handle user session management

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

//=====================================================================
// FIXED PATH ROUTES WITHOUT PARAMETERS
//=====================================================================
// These must come BEFORE any routes with path parameters like /:userId
// Otherwise Express will interpret /favourites as a userId parameter

// Favorites routes
router.get('/favourites', FavouriteController.getUserFavourites);
router.get('/favourites/count', FavouriteController.getUserFavouritesCount);
router.delete('/favourites/clear', FavouriteController.clearUserFavourites);

// Payment routes
router.post('/paymentSave', PaymentController.storePayment);

// Order creation
router.post('/order', OrderController.create);

// Get top-rated stores
router.get(
  '/stores/top-rated',
  validateRequest(ReviewValidation.getStoresSortedByRatingSchema),
  ReviewController.getStoresSortedByRating,
);

// Get products from top-rated stores (instead of rating products directly)
router.get(
  '/products/top-rated-stores',
  validateRequest(ReviewValidation.getProductsFromTopRatedStoresSchema),
  ReviewController.getProductsFromTopRatedStores,
);

//=====================================================================
// ROUTES WITH SPECIFIC PARAMETERS (NOT USER ID)
//=====================================================================
// These have parameters but are specific enough that they won't conflict

// Favorites with productId parameter
router.post(
  '/favourite/:productId',
  validateRequest(FavouriteValidation.addToUserFavouritesSchema),
  FavouriteController.addToUserFavourites,
);
router.delete(
  '/favourite/:productId',
  validateRequest(FavouriteValidation.removeFromUserFavouritesSchema),
  FavouriteController.removeFromUserFavourites,
);
router.get(
  '/favourite/:productId/check',
  validateRequest(FavouriteValidation.isProductInFavoritesSchema),
  FavouriteController.isProductInFavorites,
);

// Products collection routes
router.get(
  '/products/collection',
  validateRequest(ProductValidation.getProductsByCollectionDaySchema),
  ProductController.getProductsByCollectionDay,
);

router.get(
  '/products/category/:category',
  validateRequest(ProductValidation.getProductsByCategorySchema),
  ProductController.getProductsByCategory,
);

// Store routes with distance
router.get(
  '/stores/distance',
  validateRequest(StoreValidation.getStoresByDistanceSchema),
  StoreController.getStoresByDistance,
);

// Brands routes
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

// Specific store routes
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

// Review routes
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

// Get store's average rating
router.get(
  '/stores/:storeId/rating',
  validateRequest(ReviewValidation.getStoreAverageRatingSchema),
  ReviewController.getStoreAverageRating,
);

//=====================================================================
// ROUTES WITH GENERIC PATH PARAMETERS (LOWEST PRIORITY)
//=====================================================================
// These come last as they have broad path parameters that could match other routes

// User routes
router.get(
  '/:userId',
  validateRequest(UserValidation.findByIdSchema),
  UserMiddleware.validateUserPermission,
  UserController.findById,
);

router.delete(
  '/:userId',
  validateRequest(UserValidation.deleteByIdSchema),
  UserMiddleware.validateUserPermission,
  UserController.deleteById,
);

// User order routes
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

// Store by ID (must be after more specific store routes)
router.get(
  '/:storeId',
  validateRequest(StoreValidation.getStoreByIdSchema),
  StoreController.getStoreById,
);

// Brand stores (must be after more specific brand routes)
router.get(
  '/brand/:brandId',
  validateRequest(StoreValidation.getStoresByBrandIdSchema),
  StoreController.getStoresByBrandId,
);

module.exports = router;
