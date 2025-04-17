const Joi = require('joi');
const { BrandService } = require('../Services/brand.service');
const brandValidationSchema = require('../models/Brand/brandValidation.schema');
const updateBrandValidationSchema = require('../models/Brand/updateBrandValidation.schema');

const logger = require('./../config/logger');

const getBrands = async (req, res, next) => {
  try {
    const { page, limit, sort } = req.query;
    const brands = await BrandService.getBrands({
      page,
      limit,
      sort,
    });
    return res.status(200).json(brands);
  } catch (error) {
    logger.error('Failed to fetch brands', 'GET_BRANDS', 'GET_BRANDS', error);
    return next(error);
  }
};


const getStoreByBrandId = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const store = await BrandService.getStoreByBrandId(brandId);

    return res.status(200).json(store);
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

const getBrandById = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const brand = await BrandService.getBrandById(brandId);

    return res.status(200).json(brand);
  } catch (error) {
    logger.error(
      'Failed to fetch brand by id',
      'GET_BRAND',
      'GET_BRAND_BY_ID',
      error,
      { brandId: req.params.brandId },
    );
    return next(error);
  }
};

const createBrand = async (req, res, next) => {
  try {
    const brandData = req.body;
    const result = await BrandService.createBrand(brandData);
    return res.status(201).json(result);
  } catch (error) {
    logger.error(
      'Failed to create brand',
      'CREATE_BRAND',
      'CREATE_BRAND',
      error,
      { brandName: req.body.name },
    );
    return next(error);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const brandData = req.body;
    const { brandId } = req.params;
    const brandUpdates = {};
    for (const [key, value] of Object.entries(brandData)) {
      if (value !== undefined) {
        brandUpdates[key] = value;
      }
    }

    const result = await BrandService.updateBrand(brandId, brandUpdates);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(
      'Failed to update brand',
      'UPDATE_BRAND',
      'UPDATE_BRAND_BY_ID',
      error,
      { brandId: req.params.brandId },
    );
    return next(error);
  }
};

const deleteBrandById = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    await BrandService.deleteBrandById(brandId);
    return res
      .status(200)
      .json({ message: `Brand with Id: ${brandId} deleted successfully` });
  } catch (error) {
    logger.error(
      'Failed to delete brand',
      'DELETE_BRAND',
      'DELETE_BRAND_BY_ID',
      error,
      { brandId: req.params.brandId },
    );
    return next(error);
  }
};

const BrandController = {
  createBrand,
  updateBrand,
  getBrandById,
  getBrands,
  deleteBrandById,
  getStoreByBrandId,
};
module.exports = { BrandController };
