const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product collection
    required: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store', // Reference to the Store collection
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Timestamp when the sale happens
  },
  quantity_sold: {
    type: Number,
    required: true,
    min: 1, // Minimum quantity sold should be 1
  },
  total_price: {
    type: Number,
    required: true,
  },
});

const Sale = mongoose.model('Sale', salesSchema);

module.exports = Sale;
