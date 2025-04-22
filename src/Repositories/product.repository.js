const { Types } = require('mongoose');
const { Product } = require('../models/Product/product.schema');
const Sales = require('../models/Product/sales.schema');
const ArchivedProduct = require('../models/Product/archivedProduct.schema');
const mongoose = require('mongoose');

const { ClientErrors } = require('../errors/clientErrors');
const logger = require('./../config/logger');

// Helper function to get day name from current date
const getDayName = (date = new Date()) => {
  const days = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];
  return days[date.getDay()];
};

// Helper function to get tomorrow day
const getTomorrowDayName = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDayName(tomorrow);
};

const getProductsByStoreId = async (queryOptions) => {
  try {
    const {
      storeId,
      page = 1,
      limit = 20,
      sort = 'desc',
      priceSort,
      collectionDay,
    } = queryOptions;

    const productFilters = {
      storeId: Types.ObjectId.createFromHexString(storeId),
    };

    if (collectionDay) {
      // Handle cases like 'today' and 'tomorrow'
      let dayToFilter = collectionDay;

      if (collectionDay === 'today') {
        dayToFilter = getDayName();
      } else if (collectionDay === 'tomorrow') {
        dayToFilter = getTomorrowDayName();
      }

      productFilters['collectionSchedule'] = {
        $elemMatch: {
          day: dayToFilter,
          quantityAvailable: { $gt: 0 },
        },
      };
    }

    const skip = (page - 1) * limit;

    let sortConfig = { createdAt: sort === 'asc' ? 1 : -1 };

    if (priceSort === 'asc') {
      sortConfig = { 'price.amount': 1 }; // Low to high price
    } else if (priceSort === 'desc') {
      sortConfig = { 'price.amount': -1 }; // High to low price
    }

    const result = await Product.aggregate([
      { $match: productFilters },
      {
        $facet: {
          products: [{ $sort: sortConfig }, { $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]).exec();

    const products = result[0].products;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    return {
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
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

// Get products available for collection on a specific day (across all stores)
const getProductsByCollectionDay = async (queryOptions) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = 'desc',
      priceSort,
      collectionDay = 'today', // Default to today
      category, // Optional category filter
    } = queryOptions;

    // Determine which day to filter by
    let dayToFilter = collectionDay;

    if (collectionDay === 'today') {
      dayToFilter = getDayName();
    } else if (collectionDay === 'tomorrow') {
      dayToFilter = getTomorrowDayName();
    }

    // Build the filter
    const productFilters = {
      collectionSchedule: {
        $elemMatch: {
          day: dayToFilter,
          quantityAvailable: { $gt: 0 }, // Only include products with available quantity
        },
      },
    };

    // Add category filter if specified
    if (category) {
      productFilters.category = category;
    }

    const skip = (page - 1) * limit;

    // Determine the sort configuration based on parameters
    let sortConfig = { createdAt: sort === 'asc' ? 1 : -1 };

    // If price sorting is requested, override the sort configuration
    if (priceSort === 'asc') {
      sortConfig = { 'price.amount': 1 }; // Low to high price
    } else if (priceSort === 'desc') {
      sortConfig = { 'price.amount': -1 }; // High to low price
    }

    const result = await Product.aggregate([
      { $match: productFilters },
      {
        $facet: {
          products: [{ $sort: sortConfig }, { $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]).exec();

    const products = result[0].products;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    return {
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    logger.error(
      'Failed to fetch Products by collection day',
      'GET_PRODUCTS_BY_COLLECTION_DAY',
      'GET_PRODUCTS_BY_COLLECTION_DAY_FAILURE',
      error,
      { collectionDay: queryOptions.collectionDay },
    );
    throw error;
  }
};

const getProductById = async (productId) => {
  try {
    const product = await Product.findOne({
      _id: Types.ObjectId.createFromHexString(productId),
    }).exec();

    if (!product) {
      throw new ClientErrors.NotFoundError('product');
    }
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
    const product = new Product({
      storeId,
      name: productData.name,
      description: productData.description,
      price: {
        discount: productData.price.discount,
        amount: productData.price.amount,
        discountPrice: productData.price.discountPrice,
        currencyCode: productData.price.currencyCode || 'AED',
      },
      category: productData.category,
      image: productData.image,
      allergenInfo: productData.allergenInfo || [],
      collectionSchedule: productData.collectionSchedule.map((schedule) => ({
        day: schedule.day,
        timeWindow: {
          start: schedule.timeWindow.start,
          end: schedule.timeWindow.end,
        },
        quantityAvailable: schedule.quantityAvailable || 0,
      })),
    });

    await product.save({ validateBeforeSave: false });
    return product;
  } catch (error) {
    logger.error(
      'Failed to create Product',
      'CREATE_PRODUCT',
      'CREATE_PRODUCT_BY_STORE',
      error,
      { storeId },
    );
    throw error;
  }
};

const updateStoreProduct = async (storeId, productId, productUpdates) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: productUpdates },
      { new: true, runValidators: true },
    ).exec();

    return product;
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

const insertSale = async (storeId, productId, quantitySold, totalPrice) => {
  try {
    console.log('dates' + storeId, productId, quantitySold, totalPrice);
    // Step 1: Find the product by its ID and storeId
    const product = await Product.findOne({
      _id: productId,
      storeId: storeId,
    }).exec();

    if (!product) {
      throw new ClientErrors.NotFoundError('Product not found');
    }

    // Step 2: Create a new Sale record regardless of existing sales
    const sale = new Sales({
      product_id: product._id,
      storeId: storeId,
      quantity_sold: quantitySold,
      total_price: totalPrice,
    });

    // Step 3: Save the new sale record (This will insert a new record)
    await sale.save(); // Save the new sale record
    return sale; // Return the newly created sale document
  } catch (error) {
    logger.error(
      'Failed to insert Sale',
      'INSERT_SALE',
      'INSERT_SALE_FAILURE',
      error,
      { storeId, productId, quantitySold },
    );
    throw error;
  }
};

const getSalesByProductId = async (productIdd, storeIdd) => {
  try {
    // Ensure the input date is properly formatted
    const parsedDate = new Date(); // Convert date input to a Date object

    const productId = new mongoose.Types.ObjectId(productIdd); // Convert to ObjectId
    const storeId = new mongoose.Types.ObjectId(storeIdd); // Convert to ObjectId

    // Check if the date is invalid
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format');
    }

    // Calculate the start and end of the day (UTC)
    const startOfDay = new Date(
      Date.UTC(
        parsedDate.getUTCFullYear(),
        parsedDate.getUTCMonth(),
        parsedDate.getUTCDate(),
        0,
        0,
        0,
      ),
    );
    const endOfDay = new Date(
      Date.UTC(
        parsedDate.getUTCFullYear(),
        parsedDate.getUTCMonth(),
        parsedDate.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );

    // Log start and end of day for debugging
    console.log('Start of day:', startOfDay);
    console.log('End of day:', endOfDay);

    // Use aggregation to get sales for the given date range
    const sales = await Sales.aggregate([
      {
        $match: {
          product_id: productId,
          storeId: storeId,
          timestamp: {
            $gte: startOfDay, // Greater than or equal to startOfDay
            $lte: endOfDay, // Less than or equal to endOfDay
          },
        },
      },
      {
        $group: {
          _id: null, // Aggregate all results
          totalQuantitySold: { $sum: '$quantity_sold' }, // Sum quantity_sold
        },
      },
    ]);

    return sales;
  } catch (error) {
    console.error(
      'Failed to fetch Sales by Product ID, Store ID, and Date:',
      error,
    );
    throw error;
  }
};

const deleteStoreProduct = async (productId, storeId) => {
  try {
    const productIdd = new mongoose.Types.ObjectId(productId);
    const product = await Product.findByIdAndDelete(productIdd);

    return product;
  } catch (error) {
    logger.error(
      'Failed to delete Product',
      'DELETE_PRODUCT',
      'DELETE_PRODUCT_BY_STORE',
      error,
      { productId: productId, storeId: storeId },
    );
    throw error;
  }
};

const getProductsByIds = async (productIds) => {
  try {
    const products = await Product.find({ _id: { $in: productIds } }).exec();
    return products;
  } catch (error) {
    logger.error(
      'Failed to fetch Products by ids',
      'GET_PRODUCTS_BY_IDS',
      'GET_PRODUCTS_BY_IDS_FAILURE',
      error,
      { productIds },
    );
    throw error;
  }
};

const isProductAvailable = async ({ storeId, productId, quantity }) => {
  try {
    const product = await Product.findOne({
      _id: Types.ObjectId.createFromHexString(productId),
      storeId: Types.ObjectId.createFromHexString(storeId),
      isAvailable: true,
      quantity: { $gt: 0 },
    }).exec();

    return product;
  } catch (error) {
    logger.error(
      'Failed to check Product availabilty',
      'CHECK_PRODUCT_AVAILABILTY',
      'CHECK_PRODUCT_AVAILABILTY_FAILURE',
      error,
      { storeId, productId },
    );
    throw error;
  }
};

const getProductsByCategory = async (queryOptions) => {
  try {
    const {
      category,
      page = 1,
      limit = 20,
      sort = 'desc',
      priceSort,
    } = queryOptions;

    // Require category
    if (!category) {
      throw new ClientErrors.ValidationError('Category is required');
    }

    const productFilters = {
      category: category,
    };

    const skip = (page - 1) * limit;

    // Determine the sort configuration
    let sortConfig = { createdAt: sort === 'asc' ? 1 : -1 };

    if (priceSort === 'asc') {
      sortConfig = { 'price.amount': 1 };
    } else if (priceSort === 'desc') {
      sortConfig = { 'price.amount': -1 };
    }

    const result = await Product.aggregate([
      { $match: productFilters },
      {
        $facet: {
          products: [{ $sort: sortConfig }, { $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]).exec();

    const products = result[0].products;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    logger.error(
      'Failed to fetch Products by category',
      'GET_PRODUCTS_BY_CATEGORY',
      'GET_PRODUCTS_BY_CATEGORY_FAILURE',
      error,
      { category: queryOptions.category },
    );
    throw error;
  }
};

const ProductRepository = {
  getProductsByStoreId,
  createProduct,
  updateStoreProduct,
  getProductById,
  deleteStoreProduct,
  insertSale,
  getProductsByIds,
  isProductAvailable,
  getSalesByProductId,
  getProductsByCollectionDay,
  getProductsByCategory,
};

module.exports = { ProductRepository };
