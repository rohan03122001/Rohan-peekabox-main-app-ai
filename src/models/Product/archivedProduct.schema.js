const mongoose = require('mongoose');
const { productSchema } = require('./product.schema');

const collection = 'archivedProducts';

const ArchiveProduct = mongoose.model(
  'ArchivedProduct',
  productSchema,
  collection,
);
module.exports = ArchiveProduct;
