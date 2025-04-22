const { StoreRepository } = require('../Repositories/store.repository');
const logger = require('./../config/logger');

const getStoresByBrandId = async (queryOptions) => {
  try {
    const result = await StoreRepository.getStoresByBrandId(queryOptions);
    return result;
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
    const store = await StoreRepository.getStoreById(storeId);
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


// Store by radius service 
const getStoreByRadius = async (latitude, longitude, radius) => {
  try {
    const store = await StoreRepository.getStoreByRadius(latitude, longitude, radius);
    return store;
  } catch (error) {
    logger.error(
      'Failed to fetch store',
      'GET_STORE',
      'GET_STORE_BY_ID',
      error,
      { latitude, longitude, radius },
    );
    throw error;
  }
};

const getStoresByDistance = async (queryOptions) => {
  try {
    const { latitude, longitude, radius, page, limit } = queryOptions;
    const stores = await StoreRepository.getStoresByDistance({
      latitude, 
      longitude, 
      radius,
      page,
      limit
    });
    return stores;
  } catch (error) {
    logger.error(
      'Failed to fetch stores by distance',
      'GET_STORES_BY_DISTANCE',
      'GET_STORES_BY_DISTANCE_FAILURE',
      error,
      { latitude: queryOptions.latitude, longitude: queryOptions.longitude }
    );
    throw error;
  }
};

const updateStoreById = async (storeId, storeUpdates) => {
  try {
    const updatedStore = await StoreRepository.updateStoreById(
      storeId,
      storeUpdates,
    );
    return updatedStore;
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
    const result = await StoreRepository.deleteStoreById(storeId);
    return result;
  } catch (error) {
    logger.error(
      'Failed to delete store',
      'DELETE_STORE',
      'DELETE_STORE_BY_ID',
      error,
      { storeId },
    );
  }
};
const StoreService = {
  updateStoreById,
  getStoresByBrandId,
  getStoreById,
  getStoreByRadius,
  getStoresByDistance,
  deleteStoreById,
};
module.exports = { StoreService };