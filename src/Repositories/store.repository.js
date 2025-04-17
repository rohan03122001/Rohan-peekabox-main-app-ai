const { Types } = require('mongoose');
const Store = require('../models/Store/store.schema');
const { ClientErrors } = require('../errors/clientErrors');

const logger = require('./../config/logger');

const getStoresByBrandId = async (queryOptions) => {
  try {
    const { brandId, page, limit, sort } = queryOptions;
    const query = {
      isDeleted: false,
      brandId: Types.ObjectId.createFromHexString(brandId),
    };
    const skip = (page - 1) * limit;
    const result = await Store.aggregate([
      { $match: query },
      {
        $facet: {
          stores: [
            { $sort: { createdAt: sort === 'asc' ? 1 : -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]).exec();

    const stores = result[0].stores;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    return {
      stores,
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
      'Failed to fetch stores',
      'GET_STORES',
      'GET_STORES_BY_BRAND_ID',
      error,
      { brandId: queryOptions.brandId },
    );
    throw error;
  }
};

const getStoreById = async (storeId) => {
  try {
    const store = await Store.findOne({
      _id: Types.ObjectId.createFromHexString(storeId),
    });
    if (!store) {
      throw new ClientErrors.NotFoundError('store');
    }
    return store;
  } catch (error) {
    logger.error(
      'Failed to fetch store',
      'GET_STORE',
      'GET_STORE_BY_ID',
      error,
      { storeId },
    );
    throw error;
  }
};



const getStoreByRadius = async (latitude, longitude, radiusInKm) => {
  try {
    const radiusInMeters = radiusInKm * 1000; // MongoDB expects distance in meters

    const stores = await Store.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [latitude, longitude] },
          $maxDistance: radiusInMeters,
        },
      },
      isDeleted: { $ne: true }, // Exclude deleted stores
    });

    return stores;
  } catch (err) {
    console.error('Error fetching nearby stores:', err);
    throw err;
  }
};

const create = async ({ storeId, email }) => {
  try {
    const store = new Store({
      _id: storeId,
      'contactDetails.email': email,
    });

    return await store.save();
  } catch (error) {
    logger.error(
      'Failed to create store by id',
      'REQUEST_CREATE_STORE_BY_ID',
      'REQUEST_CREATE_STORE_BY_ID_FAILURE',
      error,
      { storeId },
    );
    throw error;
  }
};

const updateStoreById = async (storeId, storeUpdates) => {
  try {
    const store = await Store.findByIdAndUpdate(
      storeId,
      { $set: storeUpdates },
      { new: true, runValidators: true },
    ).exec();

    return store;
  } catch (error) {
    logger.error(
      'Failed to update store',
      'UPDATE_STORE',
      'UPDATE_STORE_BY_ID',
      error,
      { storeId },
    );
    throw error;
  }
};

const deleteStoreById = async (storeId) => {
  try {
    const store = await Store.findByIdAndUpdate(
      storeId,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );

    return store;
  } catch (error) {
    logger.error(
      'Failed to delete store',
      'DELETE_STORE',
      'DELETE_STORE_BY_ID',
      error,
      { storeId },
    );
    throw error;
  }
};

const StoreRepository = {
  updateStoreById,
  getStoresByBrandId,
  getStoreById,
  getStoreByRadius,
  deleteStoreById,
  create,
};
module.exports = { StoreRepository };
