const { BrandRepository } = require('../Repositories/brand.repository');
const logger = require('./../config/logger');

const getBrands = async (queryOptions) => {
  try {
    const result = await BrandRepository.getBrands(queryOptions);
    return result;
  } catch (error) {
    logger.error('Failed to fetch brands', 'GET_BRANDS', 'GET_BRANDS', error);
    throw error;
  }
};

const createBrand = async (brandData) => {
  try {
    const newBrand = await BrandRepository.createBrand(brandData);
    return newBrand;
  } catch (error) {
    logger.error(
      'Failed to create brand',
      'CREATE_BRAND',
      'CREATE_BRAND',
      error,
      { brandName: brandData.name },
    );
    throw error;
  }
};
const updateBrand = async (brandId, brandUpdates) => {
  try {
    const updatedBrand = await BrandRepository.updateBrand(
      brandId,
      brandUpdates,
    );
    return updatedBrand;
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
    const brand = await BrandRepository.getBrandById(brandId);
    return brand;
  } catch (error) {
    logger.error(
      'Failed to fetch brand by id',
      'GET_BRAND',
      'GET_BRAND_BY_ID',
      error,
      { brandId },
    );
    throw error;
  }
};


const getStoreByBrandId = async (brandId) => {
  try {
    const store = await BrandRepository.getStoreByBrandId(brandId);

    return store;
  } catch (error) {
    logger.error(
      'Failed to fetch store from brand ID',
      'GET_STORE',
      'GET_STORE_BY_ID',
      error,
    );
    return error;
  }
}

const deleteBrandById = async (brandId) => {
  try {
    const result = await BrandRepository.deleteBrandById(brandId);
    return result;
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

const BrandService = {
  createBrand,
  updateBrand,
  getBrandById,
  getBrands,
  deleteBrandById,
  getStoreByBrandId,
};
module.exports = { BrandService };
