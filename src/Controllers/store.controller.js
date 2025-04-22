const { CONSTANTS } = require('../config/constants');
const { ClientErrors } = require('../errors/clientErrors');
const { StoreService } = require('../Services/store.service');

const logger = require('./../config/logger');

const getStoresByBrandId = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const { page, limit, sort } = req.query;

    const result = await StoreService.getStoresByBrandId({
      brandId,
      page,
      limit,
      sort,
    });

    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to fetch stores',
      'GET_STORES',
      'GET_STORES_BY_BRAND_ID',
      error,
      { brandId: req.params.brandId },
    );
    return next(error);
  }
};

const getStoreById = async (req, res, next) => {
  try {
    const { id: storeId } = req.store;
    const store = await StoreService.getStoreById(storeId);

    return res.status(200).json(store);
  } catch (error) {
    logger.error(
      'Failed to fetch store',
      'GET_STORE',
      'GET_STORE_BY_ID',
      error,
      { storeId: req.store.id },
    );
    return next(error);
  }
};

// Get store by radius - original function
const getStoreByRadius = async (req, res, next) => {
  try {
    // Extract latitude, longitude, and radius from the request (you can adjust based on your data format)
    const { latitude, longitude, radius } = req.body; // Or use req.body if that's where they are coming from

    // Validate required fields
    if (!latitude || !longitude || !radius) {
      return res
        .status(400)
        .json({ message: 'Latitude, longitude, and radius are required' });
    }

    // Call the service to get stores by radius
    const stores = await StoreService.getStoreByRadius(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(radius),
    );

    // Return the stores within the specified radius
    return res.status(200).json(stores);
  } catch (error) {
    logger.error(
      'Failed to fetch stores by radius',
      'GET_STORE',
      'GET_STORE_BY_RADIUS',
      error,
      { latitude, longitude, radius },
    );
    return next(error);
  }
};

const getStoresByDistance = async (req, res, next) => {
  try {
    // Extract parameters
    const { latitude, longitude, radius, page, limit } = req.query;

    // Validate
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: true,
        data: null,
        errorMessage: 'Latitude and longitude are required',
      });
    }

    const stores = await StoreService.getStoresByDistance({
      latitude,
      longitude,
      radius,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    // Return stores sorted by distance
    return res.status(200).json(stores);
  } catch (error) {
    logger.error(
      'Failed to fetch stores by distance',
      'GET_STORES_BY_DISTANCE',
      'GET_STORES_BY_DISTANCE_FAILURE',
      error,
      { latitude: req.query.latitude, longitude: req.query.longitude },
    );
    return next(error);
  }
};

const updateStoreById = async (req, res, next) => {
  try {
    const storeData = req.body;
    // Log the incoming store data
    console.log('Function is triggered');
    logger.info('Received store data:', storeData);
    const { id: storeId } = req.store;

    const storeUpdates = {};
    for (const [key, value] of Object.entries(storeData)) {
      if (value !== undefined) {
        storeUpdates[key] = value;
      }
    }
    const result = await StoreService.updateStoreById(storeId, storeUpdates);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to update store',
      'UPDATE_STORE',
      'UPDATE_STORE_BY_ID',
      error,
      { storeId: req.store.id },
    );
    return next(error);
  }
};

const deleteStoreById = async (req, res, next) => {
  try {
    const { id: storeId } = req.store;

    await StoreService.deleteStoreById(storeId);
    return res
      .status(200)
      .json({ message: `Store with Id: ${storeId}deleted successfully` });
  } catch (error) {
    logger.error(
      'Failed to delete store',
      'DELETE_STORE',
      'DELETE_STORE_BY_ID',
      error,
      { storeId: req.store.id },
    );
    return next(error);
  }
};

const checkStoreExistence = async (req, res, next) => {
  try {
    const { storeId } = req.body;
    const store = await StoreService.getStoreById(storeId);
    req.store = store;
    next();
  } catch (error) {
    logger.error(
      'Failed to check store existence',
      'CHECK_STORE_EXISTENCE',
      'CHECK_STORE_EXISTENCE_FAILURE',
      error,
      { userId: req.user.id },
    );
    return next(error);
  }
};

const checkDeliveryPossibility = async (req, res, next) => {
  try {
    const { orderType } = req.body;
    if (
      orderType === CONSTANTS.OrderType.DELIVERY &&
      !req.store.offersDelivery
    ) {
      throw new ClientErrors.DeliveryNotOfferedError(req.store._id);
    }
    next();
  } catch (error) {
    logger.error(
      'Failed to check delivery possibility',
      'CHECK_DELIVERY_POSSIBILITY',
      'CHECK_DELIVERY_POSSIBILITY_FAILURE',
      error,
      { userId: req.user.id },
    );
    return next(error);
  }
};

const StoreController = {
  updateStoreById,
  getStoresByBrandId,
  getStoreById,
  getStoreByRadius,
  getStoresByDistance,
  deleteStoreById,
  checkStoreExistence,
  checkDeliveryPossibility,
};

module.exports = { StoreController };
