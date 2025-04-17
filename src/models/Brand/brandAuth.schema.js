const mongoose = require('mongoose');


const collection = 'brandAuth' 


const brandAuthSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
   tokenVersion: { type: Number, default: 0 },
  });


  
brandAuthSchema.index({ email: 1 });


brandAuthSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.tokenVersion;
  return obj;
};

const brandAuth = mongoose.model('brandAuth', brandAuthSchema, collection);
module.exports = {brandAuth};
