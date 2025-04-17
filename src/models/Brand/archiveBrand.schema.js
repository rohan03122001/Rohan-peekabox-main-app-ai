const mongoose = require('mongoose');

const archiveBrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);
const archiveBrand = mongoose.model('archiveBrand', archiveBrandSchema);
module.exports = archiveBrand;
