const { ProductRepository } = require('../Repositories/product.repository');
const { ClientErrors } = require('./../errors/clientErrors');
const logger = require('./../config/logger');

const getProductsByStoreId = (queryOptions) => {
  try {
    const products = ProductRepository.getProductsByStoreId(queryOptions);
    return products;
  } catch (error) {
    logger.error(
      'Failed to fetch Products',
      'GET_PRODUCTS',
      'GET_PRODUCTS_BY_STORE_ID',
      error,
      { storeId: queryOptions.storeId },
    );
    throw error;
  }
};

const getProductById = async (productId) => {
  try {
    const product = await ProductRepository.getProductById(productId);
    return product;
  } catch (error) {
    logger.error(
      'Failed to fetch Product by id',
      'GET_PRODUCTS',
      'GET_PRODUCTS_BY_ID',
      error,
      { productId },
    );
    throw error;
  }
};

const createProduct = async (storeId, productData) => {
  try {
    const newProduct = await ProductRepository.createProduct(
      storeId,
      productData,
    );
    return newProduct;
  } catch (error) {
    logger.error(
      'Failed to create Product',
      'CREATE_PRODUCT',
      'CREATE_PRODUCT_BY_STORE',
      error,
      { storeId: productData.storeId },
    );
    throw error;
  }
};

const updateStoreProduct = async (storeId, productId, productUpdates) => {
  try {
    const updatedProduct = await ProductRepository.updateStoreProduct(
      storeId,
      productId,
      productUpdates,
    );
    return updatedProduct;
  } catch (error) {
    logger.error(
      'Failed to update Product',
      'UPDATE_PRODUCT',
      'UPDATE_PRODUCT_BY_STORE',
      error,
      { productId: productId, storeId: storeId },
    );
    throw error;
  }
};

const deleteStoreProduct = async (productId, storeId) => {
  try {
    const result = await ProductRepository.deleteStoreProduct(
      productId,
      storeId,
    );
    return result;
  } catch (error) {
    console.error('Error in softDeleteProduct service:', error.message);
    throw error;
  }
};

const checkProductAvailability = async ({
  userId,
  storeId,
  productId,
  quantity,
}) => {
  try {
    const product = await ProductRepository.isProductAvailable({
      storeId,
      productId,
      quantity,
    });

    if (!product) {
      throw new ClientErrors.ProductNotAvailableError(productId);
    } else if (product.quantity < quantity) {
      throw new ClientErrors.MaxProductQuantityExceededError(
        product._id,
        product.quantity,
        { quantity },
      );
    }
    return product;
  } catch (error) {
    logger.error(
      'Failed to check Product availabilty',
      'CHECK_PRODUCT_AVAILABILTY',
      'CHECK_PRODUCT_AVAILABILTY_FAILURE',
      error,
      { userId, productId, storeId },
    );
    throw error;
  }
};


// Controller to get sales by productId, storeId, and date
const getSalesByProductId = async (productId, storeId) => {
  try {
    // Call the service to get sales data
    const sales = await ProductRepository.getSalesByProductId(productId, storeId);
    return sales;
  } catch (error) {
    
    // Handle any other errors
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const ProductService = {
  getProductsByStoreId,
  createProduct,
  updateStoreProduct,
  getProductById,
  deleteStoreProduct,
  checkProductAvailability,
  getSalesByProductId
};

module.exports = { ProductService };
