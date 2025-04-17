const mongoose = require('mongoose');

const collection = 'brands';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },
    ManagerEmail: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Brand = mongoose.model('Brand', brandSchema, collection);
module.exports = Brand;
