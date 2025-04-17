const mongoose = require('mongoose');

const collection = 'storesAuth';

const storeAuthSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  tokenVersion: { type: Number, default: 0 },
});

storeAuthSchema.index({ email: 1 });

storeAuthSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.tokenVersion;
  return obj;
};

const StoreAuth = mongoose.model('StoreAuth', storeAuthSchema, collection);

module.exports = { StoreAuth };
