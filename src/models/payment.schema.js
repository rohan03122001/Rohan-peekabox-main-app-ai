const mongoose = require('mongoose');

const collection = 'payments';

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders', 
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stores', 
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true, // Ensures no extra spaces
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Prevents 0 or negative values
    },
    GrossRevenue: {
      type: Number,
      required: true,
      min: 0, // Revenue should not be negative
    },
    NetRevenue: {
      type: Number,
      required: true,
      min: 0, // Commission should not be negative
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model('payments', paymentSchema, collection);
module.exports = { Payment, paymentSchema };
