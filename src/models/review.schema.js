const mongoose = require('mongoose');

const collection = 'reviews';

const reviewsSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    title: {
      type: String,
      maxlength: 50,
      required: true,
    },
    description: {
      type: String,
      maxlength: 240,
      required: true,
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Review = mongoose.model('Review', reviewsSchema, collection);

module.exports = Review;
