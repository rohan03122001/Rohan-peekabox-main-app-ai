const { ProductService } = require('../Services/product.service');
const logger = require('./../config/logger');
const { ClientErrors } = require('./../errors/clientErrors');

const getProductsByStoreId = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { page, limit, sort, priceSort, collectionDay } = req.query;
    const result = await ProductService.getProductsByStoreId({
      storeId,
      page,
      limit,
      sort,
      priceSort,
      collectionDay, // Pass the collection day parameter
    });

    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to fetch Products',
      'GET_PRODUCTS',
      'GET_PRODUCTS_BY_STORE_ID',
      error,
      { storeId: req.params.storeId },
    );
    return next(error);
  }
};

//get products by collection day
const getProductsByCollectionDay = async (req, res, next) => {
  try {
    const { page, limit, sort, priceSort, collectionDay, category } = req.query;
    const result = await ProductService.getProductsByCollectionDay({
      page,
      limit,
      sort,
      priceSort,
      collectionDay,
      category,
    });

    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to fetch Products by collection day',
      'GET_PRODUCTS_BY_COLLECTION_DAY',
      'GET_PRODUCTS_BY_COLLECTION_DAY_FAILURE',
      error,
    );
    return next(error);
  }
};

//get products by category
const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page, limit, sort, priceSort } = req.query;
    const result = await ProductService.getProductsByCategory({
      category,
      page,
      limit,
      sort,
      priceSort,
    });

    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to fetch Products by category',
      'GET_PRODUCTS_BY_CATEGORY',
      'GET_PRODUCTS_BY_CATEGORY_FAILURE',
      error,
      { category: req.params.category },
    );
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await ProductService.getProductById(productId);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to fetch Product by id',
      'GET_PRODUCT',
      'GET_PRODUCT_BY_ID',
      error,
      { productId: req.params.productId },
    );
    return next(error);
  }
};

const createStoreProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    console.log('Products :' + productData);

    const result = await ProductService.createProduct(
      req.params.storeId,
      productData,
    );
    return res.status(201).json(result);
  } catch (error) {
    logger.error(
      'Failed to create Product',
      'CREATE_PRODUCT',
      'CREATE_PRODUCT_BY_STORE',
      error,
      { storeId: req.params.storeId },
    );
    return next(error);
  }
};

const verifyProductOwnership = async (req, res, next) => {
  try {
    const { productId, storeId } = req.params;

    const product = await ProductService.getProductById(productId);

    // Check for the store making the request owns the product
    if (product.storeId.toString() !== storeId.toString()) {
      throw new ClientErrors.UnauthorizedError(
        'Store does not own this product',
      );
    }
    req.product = product;
    next();
  } catch (error) {
    next(error);
  }
};

const updateStoreProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    const { productId, storeId } = req.body;
    const productUpdates = {};
    for (const [key, value] of Object.entries(productData)) {
      if (value !== undefined) {
        productUpdates[key] = value;
      }
    }
    const result = await ProductService.updateStoreProduct(
      storeId,
      productId,
      productUpdates,
    );

    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to create Product',
      'UPDATE_PRODUCT',
      'UPDATE_PRODUCT_BY_STORE',
      error,
      { storeId: req.params.storeId, productId: req.params.productId },
    );
    return next(error);
  }
};

const deleteStoreProduct = async (req, res, next) => {
  try {
    const { storeId, productId } = req.params;

    await ProductService.deleteStoreProduct(productId, storeId);

    return res.status(200).json({
      message: `Product with Id: ${productId} deleted successfully`,
    });
  } catch (error) {
    logger.error(
      'Failed to delete Product',
      'DELETE_PRODUCT',
      'DELETE_PRODUCT_BY_STORE',
      error,
      { storeId: req.params.storeId, productId: req.params.productId },
    );
    return next(error);
  }
};

const checkProductAvailability = async (req, res, next) => {
  try {
    const { storeId, productId, quantity } = req.body;
    const { userId } = req.params;
    const product = await ProductService.checkProductAvailability({
      userId,
      storeId,
      productId,
      quantity,
    });
    req.product = product;
    next();
  } catch (error) {
    logger.error(
      'Failed to check Product availabilty',
      'CHECK_PRODUCT_AVAILABILTY',
      'CHECK_PRODUCT_AVAILABILTY_FAILURE',
      error,
      { storeId: req.body.storeId, productId: req.body.productId },
    );
    return next(error);
  }
};

// Controller to get sales by productId, storeId, and date
const getSalesByProductId = async (req, res) => {
  const product = req.body;
  try {
    const sales = await ProductService.getSalesByProductId(
      product.productId,
      product.storeId,
    );
    return res.status(200).json(sales);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const ProductController = {
  getProductsByStoreId,
  getSalesByProductId,
  createStoreProduct,
  verifyProductOwnership,
  updateStoreProduct,
  getProductById,
  deleteStoreProduct,
  checkProductAvailability,
  getProductsByCollectionDay,
  getProductsByCategory,
};

module.exports = { ProductController };
