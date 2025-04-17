const mongoose = require('mongoose');

const collection = 'products';

const productSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      discount: {
        type: Boolean,
        default : false,
      },
      amount: {
        type: Number,
        required: true,
      },
      discountPrice: {
        type: Number,
        default : 0,
      },
      currencyCode: {
        type: String,
        default: 'AED',
      },
    },
    category: {
      type: String, 
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    allergenInfo: {
      type: [String], 
      default: [],
    },
    collectionSchedule: [
      {
        day: {
          type: String, 
          required: true,
        },
        timeWindow: {
          start: {
            type: String,
            required: true,
          },
          end: {
            type: String,
            required: true,
          },
        },
        quantityAvailable: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true },
);

const Product = mongoose.model('products', productSchema, collection);
module.exports = { Product, productSchema };
