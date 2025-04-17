const { Types } = require('mongoose');
const { Order } = require('../models/order.schema');
const mongoose = require('mongoose');
const logger = require('../config/logger');
const { ClientErrors } = require('../errors/clientErrors');
const { CONSTANTS } = require('../config/constants');

const create = (orderData) => {
  try {
    const order = new Order(orderData);

    return order.save();
  } catch (error) {
    logger.error(
      'Failed to create Order',
      'CREATE_ORDER',
      'CREATE_ORDER_FAILURE',
      error,
    );
    throw error;
  }
};

const findById = async (orderId) => {
  try {
    const order = await Order.findOne({
      _id: Types.ObjectId.createFromHexString(orderId),
    });
    return order;
  } catch (error) {
    logger.error(
      'Failed to fetch Order',
      'FETCH_ORDER_BY_ID',
      'FETCH_ORDER_BY_ID_FAILURE',
      error,
      { orderId },
    );
    throw error;
  }
};

const markCompleted = async (orderId) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: { status: CONSTANTS.OrderStatus.COMPLETED },
        $push: {
          statusHistory: {
            status: CONSTANTS.OrderStatus.COMPLETED,
            timestamp: Date.now(),
          },
        },
      },
      { new: true },
    );
    return order;
  } catch (error) {
    logger.error(
      'Failed to fetch Order',
      'FETCH_ORDER_BY_ID',
      'FETCH_ORDER_BY_ID_FAILURE',
      error,
      { orderId },
    );
    throw error;
  }
};


const markCancelled = async (orderId) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: { status: CONSTANTS.OrderStatus.CANCELLED },
        $push: {
          statusHistory: {
            status: CONSTANTS.OrderStatus.CANCELLED,
            timestamp: Date.now(),
          },
        },
      },
      { new: true },
    );
    return order;
  } catch (error) {
    logger.error(
      'Failed to fetch Order',
      'FETCH_ORDER_BY_ID',
      'FETCH_ORDER_BY_ID_FAILURE',
      error,
      { orderId },
    );
    throw error;
  }
};

const getOrdersByUserId = async (queryOptions) => {
  try {
    const { userId, page, limit, sort } = queryOptions;
    const orderFilters = {
      userId: Types.ObjectId.createFromHexString(userId),
    };
    const skip = (page - 1) * limit;

    const result = await Order.aggregate([
      { $match: orderFilters },
      {
        $facet: {
          orders: [
            { $sort: { createdAt: sort === 'asc' ? 1 : -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]).exec();

    const orders = result[0].orders;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    return {
      orders,
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
      'Failed to fetch Orders by User Id',
      'GET_ORDERS_BY_USER_ID',
      'GET_ORDERS_BY_USER_ID_FAILURE',
      error,
      { userId },
    );
    throw error;
  }
};

const getOrdersByStoreId = async (queryOptions) => {
  try {
    const { storeId, page, limit, sort } = queryOptions;
    const orderFilters = {
      'storeId': Types.ObjectId.createFromHexString(storeId),
    };
    const skip = (page - 1) * limit;

    const result = await Order.aggregate([
      { $match: orderFilters },
      {
        $facet: {
          orders: [
            { $sort: { createdAt: sort === 'asc' ? 1 : -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]).exec();

    const orders = result[0].orders;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    return {
      orders,
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
      'Failed to get orders by store id',
      'REQUEST_GET_ORDERS_BY_STORE_ID',
      'REQUEST_GET_ORDERS_BY_STORE_ID_FAILURE',
      error,
      { userId },
    );
    throw error;
  }
};


const searchOrders = async (filter, page = 1, limit = 10) => {
  try {
    // Apply pagination
    const skip = (page - 1) * limit;

    // Find orders based on the filter (which can include orderId and date range)
    const orders = await Order.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });  // Sort by createdAt in descending order

    // Count the total number of orders for pagination
    const totalOrders = await Order.countDocuments(filter);

    // Return orders with pagination info
    return {
      orders,
      pagination: {
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error searching orders in repository:", error);
    throw new Error("Database error while searching for orders");
  }
};






const getOrderToday = async (storeId) => {
  try {
    const now = new Date();
    // Set start and end of the day in UTC
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    console.log("Start of Day:", startOfDay);
    console.log("End of Day:", endOfDay);

    const orders = await Order.find({
      'storeId': new Types.ObjectId(storeId),
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    })
    .sort({ createdAt: -1 }) // Latest to Oldest
    .lean();

    console.log("Orders Found:", orders);
    return orders;
  } catch (error) {
    logger.error(
      'Failed to fetch today\'s orders',
      'GET_TODAYS_ORDERS',
      'GET_TODAYS_ORDERS_FAILURE',
      error,
      { storeId }
    );
    throw error;
  }
};

const OrderRepository = {
  create,
  findById,
  markCompleted,
  markCancelled,
  getOrdersByUserId,
  getOrdersByStoreId,
  searchOrders,
  getOrderToday,
};

module.exports = { OrderRepository };
