const Brand = require('../models/Brand/brand.schema');
const logger = require('./../config/logger');
const Store = require('../models/Store/store.schema');
const { ClientErrors } = require('../errors/clientErrors');

const getBrands = async (queryOptions) => {
  try {
    const { page, limit, sort } = queryOptions;
    const brandFilters = { isDeleted: false };

    const skip = (page - 1) * limit;

    const result = await Brand.aggregate([
      { $match: brandFilters },
      {
        $facet: {
          brands: [
            { $sort: { createdAt: sort === 'asc' ? 1 : -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]).exec();

    const brands = result[0].brands;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    return {
      brands,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    logger.error('Failed to fetch brands', 'GET_BRANDS', 'GET_BRANDS', error);
    throw error;
  }
};

const createBrand = async ({brandId}) => {
  try {
    const brand = new Brand({
      _id: brandId,
    });
    await brand.save();
    return brand;
  } catch (error) {
    logger.error(
      'Failed to create brand',
      'CREATE_BRAND',
      'CREATE_BRAND',
      error,
      { brand: brandId},
    );
  }
};


const updateBrand = async (brandId, brandUpdates) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      brandId,
      { $set: brandUpdates },
      { new: true, runValidators: true },
    ).exec();

    return brand;
  } catch (error) {
    logger.error(
      'Failed to update brand',
      'UPDATE_BRAND',
      'UPDATE_BRAND_BY_ID',
      error,
      { brandId },
    );
    throw error;
  }
};

const getBrandById = async (brandId) => {
  try {
    const brand = await Brand.findOne({ _id: brandId, isDeleted: false });
    if (!brand) {
      throw new ClientErrors.NotFoundError('product');
    }

    return brand;
  } catch (error) {
    logger.error(
      'Failed to fetch Product by id',
      'GET_PRODUCTS',
      'GET_PRODUCTS_BY_ID',
      error,
      { brandId },
    );
    throw error;
  }
};


const getStoreByBrandId = async (brandId) => {
  try {
    const stores = await Store.find({ brandId: brandId}).exec();
    if (!stores || stores.length === 0) {
      throw new ClientErrors.NotFoundError('No stores found for this brand');
    }
    return stores;
  } catch (error) {
    logger.error(
      'Failed to fetch stores by brand ID',
      'GET_STORE',
      'GET_STORE_BY_BRAND_ID',
      error,
    );
    throw error;
  }
};

const deleteBrandById = async (brandId) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      brandId,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );

    return brand;
  } catch (error) {
    logger.error(
      'Failed to delete brand',
      'DELETE_BRAND',
      'DELETE_BRAND_BY_ID',
      error,
      { brandId },
    );
    throw error;
  }
};
const BrandRepository = {
  createBrand,
  updateBrand,
  getBrandById,
  getBrands,
  deleteBrandById,
  getStoreByBrandId,
};

module.exports = { BrandRepository };