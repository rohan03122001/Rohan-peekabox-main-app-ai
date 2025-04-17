const mongoose = require('mongoose');

const collection = 'usersAuth';

const userAuthSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  tokenVersion: { type: Number, default: 0 },
});

userAuthSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.tokenVersion;
  return obj;
};

userAuthSchema.index({ email: 1 });

const UserAuth = mongoose.model('UserAuth', userAuthSchema, collection);

module.exports = { UserAuth };
