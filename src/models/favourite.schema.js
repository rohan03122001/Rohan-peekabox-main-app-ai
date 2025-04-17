const mongoose = require('mongoose');

const collection = 'favourites';

const favouriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

favouriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Favourite = mongoose.model('Favourite', favouriteSchema, collection);

module.exports = { Favourite };
