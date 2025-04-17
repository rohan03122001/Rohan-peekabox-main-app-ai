const mongoose = require('mongoose');
const { CONSTANTS } = require('./../config/constants.js');

const collection = 'orders';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storeId: { // Changed from store.id to storeId
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    salesAmount: { 
      type: Number,
      required: true,
    },
    consumerPrice: { 
      type: Number,
      required: true,
    },
    currencyCode: { 
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.OrderStatus),
      required: true,
      default: CONSTANTS.OrderStatus.PENDING, 
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes
orderSchema.index({ storeId: 1 });
orderSchema.index({ storeId: 1, status: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ paymentId: 1 });

const Order = mongoose.model('Order', orderSchema, collection);

module.exports = { Order };
