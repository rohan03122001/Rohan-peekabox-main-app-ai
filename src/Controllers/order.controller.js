const logger = require('../config/logger');
const { OrderService } = require('../Services/order.service');
const mongoose = require('mongoose');

const create = async (req, res, next) => {
  try {
    const orderData = req.body;
    console.log("Received Order Data:", orderData);

    const result = await OrderService.create(orderData);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to create order',
      'REQUEST_CREATE_ORDER',
      'REQUEST_CREATE_ORDER_FAILURE',
      error,
    );
    return next(error);
  }
};

const markCompleted = async (req, res, next) => {
  try {
    const { storeId , orderId } = req.params;
    const result = await OrderService.markCompleted({ storeId , orderId });
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to create order',
      'REQUEST_CREATE_ORDER',
      'REQUEST_CREATE_ORDER_FAILURE',
      error,
      { userId: req.user.id },
    );
    return next(error);
  }
};

const markCancelled = async (req, res, next) => {
  try {
    const { storeId , orderId } = req.params;
    const result = await OrderService.markCancelled({ storeId , orderId });
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to create order',
      'REQUEST_CREATE_ORDER',
      'REQUEST_CREATE_ORDER_FAILURE',
      error,
      { userId: req.user.id },
    );
    return next(error);
  }
};

const getUserOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const result = await OrderService.getOrderById({ orderId });
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to fetch order by id',
      'REQUEST_GET_USER_ORDER_BY_ID',
      'REQUEST_GET_USER_ORDER_BY_ID_FAILURE',
      error,
      { userId: req.user.id },
    );
    return next(error);
  }
};

const getOrdersByUserId = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { page, limit, sort } = req.query;
    const result = await OrderService.getOrdersByUserId({
      userId,
      page,
      limit,
      sort,
    });
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to get orders by user id',
      'REQUEST_GET_ORDERS_BY_USER_ID',
      'REQUEST_GET_ORDERS_BY_USER_ID_FAILURE',
      error,
      { userId: req.user.id },
    );
    return next(error);
  }
};

const getStoreOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const result = await OrderService.getOrderById({ orderId });
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to fetch order by id',
      'REQUEST_GET_STORE_ORDER_BY_ID',
      'REQUEST_GET_STORE_ORDER_BY_ID_FAILURE',
      error,
      { storeId: req.store.id, orderId: req.params.orderId },
    );
    return next(error);
  }
};

const getStoreOrders = async (req, res, next) => {
  try {
    const { storeId } = req.params;;
    const { page, limit, sort } = req.query;
    const result = await OrderService.getOrdersByStoreId({
      storeId,
      page,
      limit,
      sort,
    });
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to get orders by store id',
      'REQUEST_GET_ORDERS_BY_STORE_ID',
      'REQUEST_GET_ORDERS_BY_STORE_ID_FAILURE',
      error,
      { storeId: req.store.id },
    );
    return next(error);
  }
};


const getOrderToday = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const result = await OrderService.getOrderToday(storeId);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to get orders by store id',
      'REQUEST_GET_ORDERS_BY_STORE_ID',
      'REQUEST_GET_ORDERS_BY_STORE_ID_FAILURE',
      error,
      { storeId: req.store.id },
    );
    return next(error);
  }
};

const getInternalOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const result = await OrderService.getOrderById({ orderId });
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to fetch order by id',
      'REQUEST_GET_INTERNAL_ORDER_BY_ID',
      'REQUEST_GET_INTERNAL_ORDER_BY_ID_FAILURE',
      error,
      { internalUserId: req.internalUser.id, orderId: req.params.orderId },
    );
    return next(error);
  }
};

const getInternalUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page, limit, sort } = req.query;
    const result = await OrderService.getOrdersByUserId({
      userId,
      page,
      limit,
      sort,
    });
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to create order',
      'REQUEST_GET_INTERNAL_USER_ID',
      'REQUEST_GET_INTERNAL_USER_ID_FAILURE',
      error,
      { userId: req.params.userId },
    );
    return next(error);
  }
};

const getInternalStoreOrders = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { page, limit, sort } = req.query;
    const result = await OrderService.getOrdersByStoreId({
      storeId,
      page,
      limit,
      sort,
    });
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to get orders by store id',
      'REQUEST_GET_INTERNAL_ORDERS_BY_STORE_ID',
      'REQUEST_GET_INTERNAL_ORDERS_BY_STORE_ID_FAILURE',
      error,
      { storeId: req.store.id },
    );
    return next(error);
  }
};


const searchOrders = async (req, res, next) => {
  try {
    const { orderId, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Prepare the filter object based on query params
    let filter = {};

    // Validate orderId
    if (orderId && !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid order ID format",
      });
    }

    // Build the filter object if orderId is provided
    if (orderId) {
      filter._id = new mongoose.Types.ObjectId(orderId);
    }

     // Build the date range filter if both startDate and endDate are provided
     if (startDate && endDate) {
      // Convert startDate and endDate to Date objects
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      // Check if both dates are valid
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: "Invalid date format. Use a valid date format (e.g., YYYY-MM-DD).",
        });
      }

      // Adjust the times to get the full date range for the day
      const startOfDay = new Date(Date.UTC(parsedStartDate.getUTCFullYear(), parsedStartDate.getUTCMonth(), parsedStartDate.getUTCDate(), 0, 0, 0));
      const endOfDay = new Date(Date.UTC(parsedEndDate.getUTCFullYear(), parsedEndDate.getUTCMonth(), parsedEndDate.getUTCDate(), 23, 59, 59, 999));

      filter.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // Call the service to search for the order(s) with the filter
    const result = await OrderService.searchOrders(filter, page, limit);

    if (!result || result.orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No orders found matching the search criteria",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        orders: result.orders,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    console.error("Failed to search orders:", error);
    return next(error);
  }
};


const OrderController = {
  create,
  markCompleted,
  markCancelled ,
  getOrdersByUserId,
  getUserOrderById,
  getStoreOrderById,
  getStoreOrders,
  getInternalOrderById,
  getInternalUserOrders,
  getInternalStoreOrders,
  searchOrders,
  getOrderToday,
};

module.exports = {
  OrderController,
};
