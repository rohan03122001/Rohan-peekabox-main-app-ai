const Joi = require('joi');
const { CONSTANTS } = require('../config/constants');

const createSchema = {
  body: Joi.object({
    userId: Joi.string().hex().length(24).required(),  // Validates userId as a 24-char MongoDB ObjectId
    storeId: Joi.string().hex().length(24).required(),  // Validates storeId as a 24-char MongoDB ObjectId
    productId: Joi.string().hex().length(24).required(), // Validates productId as a 24-char MongoDB ObjectId
    productName: Joi.string().required(),  // Ensures productName is a string
    quantity: Joi.number().min(1).required(),  // Ensures quantity is a number and >= 1
    salesAmount: Joi.number().required(), // Validates salesAmount as a number
    consumerPrice: Joi.number().required(), // Validates consumerPrice as a number
    currencyCode: Joi.string().length(3).required(), // Validates currencyCode as a 3-character string
    status: Joi.string().valid('PENDING', 'COMPLETED').required(), // Validates that status is either PENDING or COMPLETED
    totalPrice: Joi.number().required(), // Validates totalPrice as a number
  }),
};


const markCompletedSchema = {
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
    orderId: Joi.string().hex().length(24).required(),
  }),
};

const getUserOrderByIdSchema = {
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
    orderId: Joi.string().hex().length(24).required(),
  }),
};

const getOrdersByUserIdSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
  }),
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
};

const getStoreOrderByIdSchema = {
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
    orderId: Joi.string().hex().length(24).required(),
  }),
};

const getStoreOrderschema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
  }),
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
  }),
};

const getInternalOrderByIdSchema = {
  params: Joi.object({
    orderId: Joi.string().hex().length(24).required(),
  }),
};

const getInternalUserOrdersSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
  }),
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
};

const getInternalStoreOrdersSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
  }),
  params: Joi.object({
    storeId: Joi.string().hex().length(24).required(),
  }),
};

const OrderValidation = {
  createSchema,
  markCompletedSchema,
  getOrdersByUserIdSchema,
  getUserOrderByIdSchema,
  getStoreOrderByIdSchema,
  getStoreOrderschema,
  getInternalOrderByIdSchema,
  getInternalUserOrdersSchema,
  getInternalStoreOrdersSchema,
};

module.exports = { OrderValidation };
