const { OrderRepository } = require('../Repositories/order.repository');
const { ProductRepository } = require('../Repositories/product.repository');
const logger = require('../config/logger');
const { CONSTANTS } = require('../config/constants.js');
const { ClientErrors } = require('../errors/clientErrors.js');
const { error } = require('../models/Brand/brandValidation.schema.js');
//const {sendPushNotification} = require('./pushnotification.service.js')

const create = async (orderData) => {
  try {
    const totalPrice = (Number(orderData.quantity) || 0) * (Number(orderData.consumerPrice) || 0);
if (isNaN(totalPrice)) {
  throw new Error("Invalid totalPrice calculation");
}
    const orderDatas = {
      userId : orderData.userId,
      storeId: orderData.storeId,
      productId: orderData.productId,
      productName: orderData.productName,
      quantity: orderData.quantity,
      salesAmount: orderData.salesAmount,
      consumerPrice: orderData.consumerPrice,
      currencyCode: orderData.currencyCode,
      status: CONSTANTS.OrderStatus.PENDING,
      totalPrice,
    };
    const order = await OrderRepository.create(orderDatas);
    ProductRepository.insertSale(orderData.storeId, orderData.productId, orderData.quantity, totalPrice);

    // notification service 
    // Send push notification
    /*if (fcmToken) {
      const title = 'New Order Created';
      const message = `Your order of ${orderItems.length} items is confirmed.`;
      await sendPushNotification(fcmToken, title, message); // Call the function with the fcmToken, title, and message
    } */

    return order;
  } catch (error) {
    logger.error(
      'Failed to create order',
      'REQUEST_CREATE_ORDER',
      'REQUEST_CREATE_ORDER_FAILURE',
      error,
    );
    throw error;
  }
};

const markCompleted = async ({ userId, orderId }) => {
  try {
    const order = await OrderRepository.findById(orderId);
    
      const updatedOrder = await OrderRepository.markCompleted(order._id);
      return updatedOrder;

  } catch (error) {
    logger.error(
      'Failed to mark order completed',
      'REQUEST_MARK_ORDER_COMPLETED',
      'REQUEST_MARK_ORDER_COMPLETED_FAILURE',
      error,
      { userId, orderId },
    );
    throw error;
  }
};


const markCancelled = async ({ userId, orderId }) => {
  try {
    const order = await OrderRepository.findById(orderId);
    
      const updatedOrder = await OrderRepository.markCancelled(order._id);
      return updatedOrder;
      
  } catch (error) {
    logger.error(
      'Failed to mark order completed',
      'REQUEST_MARK_ORDER_COMPLETED',
      'REQUEST_MARK_ORDER_COMPLETED_FAILURE',
      error,
      { userId, orderId },
    );
    throw error;
  }
};

const getOrdersByUserId = async (queryOptions) => {
  try {
    const orders = OrderRepository.getOrdersByUserId(queryOptions);
    return orders;
  } catch (error) {
    logger.error(
      'Failed to get orders by user id',
      'REQUEST_GET_ORDERS_BY_USER_ID',
      'REQUEST_GET_ORDERS_BY_USER_ID_FAILURE',
      error,
      { userId: queryOptions.userId },
    );
    throw error;
  }
};

const getOrderById = async ({ orderId }) => {
  try {
    const order = await OrderRepository.findById(orderId);
    return order;
  } catch (error) {
    logger.error(
      'Failed to get order by id',
      'REQUEST_GET_ORDER_BY_ID',
      'REQUEST_GET_ORDER_BY_ID_FAILURE',
      error,
      { orderId },
    );
    throw error;
  }
};


const getOrderToday = async (storeId) => {
  try {
    const orders = OrderRepository.getOrderToday(storeId);
    return orders;
  } catch (error) {
    logger.error(
      'Failed to get orders by store id',
      'REQUEST_GET_ORDERS_BY_STORE_ID',
      'REQUEST_GET_ORDERS_BY_STORE_ID_FAILURE',
      error,
      { storeId: queryOptions.storeId },
    );
    throw error;
  }
};

const getOrdersByStoreId = async (queryOptions) => {
  try {
    const orders = OrderRepository.getOrdersByStoreId(queryOptions);
    return orders;
  } catch (error) {
    logger.error(
      'Failed to get orders by store id',
      'REQUEST_GET_ORDERS_BY_STORE_ID',
      'REQUEST_GET_ORDERS_BY_STORE_ID_FAILURE',
      error,
      { storeId: queryOptions.storeId },
    );
    throw error;
  }
};

const searchOrders = async (filter, page = 1, limit = 10) => {
  try {
    return await OrderRepository.searchOrders(filter, page, limit);
  } catch (error) {
    console.error("Failed to search orders in service:", error);
    throw new Error("Error retrieving orders");
  }
};


const OrderService = {
  create,
  markCompleted,
  markCancelled,
  getOrderById,
  getOrdersByUserId,
  getOrdersByStoreId,
  searchOrders,
  getOrderToday,
};

module.exports = {
  OrderService,
};
