const { StoreAuth } = require('../models/Store/storeAuth.schema');
const { brandAuth } = require('../models/Brand/brandAuth.schema');
const logger = require('../config/logger');
const { ClientErrors } = require('../errors/clientErrors');

const findByEmail = async (email, includePassword = false) => {
  try {
    const storeAuth = await StoreAuth.findOne({ email }).exec();
    if (!storeAuth) {
      throw new ClientErrors.NotFoundError('Store', 404);
    }
    return includePassword ? storeAuth : storeAuth.toSafeObject();
  } catch (error) {
    logger.error(
      'Failed to verify store registration',
      'REQUEST_STORE_INIT_AUTH',
      'REQUEST_STORE_INIT_AUTH_FAILURE',
      error,
      { email },
    );
    throw error;
  }
};

const findById = async (storeId, includePassword = false) => {
  try {
    const storeAuth = await StoreAuth.findOne({ _id: storeId }).exec();
    if (!storeAuth) {
      throw new ClientErrors.NotFoundError('Store', 404);
    }
    return includePassword ? storeAuth : storeAuth.toSafeObject();
  } catch (error) {
    logger.error(
      'Failed to verify store registration',
      'REQUEST_STORE_INIT_AUTH',
      'REQUEST_STORE_INIT_AUTH_FAILURE',
      error,
      { storeId },
    );
    throw error;
  }
};

const create = async (email, passwordHash) => {
  try {
    const storeAuth = new StoreAuth({
      email,
      passwordHash,
    });

    const storeDetails = await storeAuth.save();
    return storeDetails;
  } catch (error) {
    console.log('error', error);
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

const updatePassword = async (storeId, hashedPassword) => {
  try {
    const storeAuth = await StoreAuth.findOneAndUpdate(
      { _id: storeId },
      {
        passwordHash: hashedPassword,
        $inc: { tokenVersion: 1 },
      },
      { new: true },
    ).exec();

    if (!storeAuth) {
      throw new Error('StoreAuth not found');
    }

    return storeAuth;
  } catch (error) {
    logger.error(
      'Failed to update store password',
      'REQUEST_UPDATE_STORE_PSWD',
      'REQUEST_UPDATE_STORE_PSWD_FAILURE',
      error,
      { storeId },
    );
    throw error;
  }
};





// brand 
const brandFindByEmail = async (email, includePassword = false) => {
  try {
    const brandAuthh = await brandAuth.findOne({ email }).exec();
    if (!brandAuthh) {
      throw new ClientErrors.NotFoundError('Brand', 404);
    }
    return includePassword ? brandAuthh : brandAuthh.toSafeObject();
  } catch (error) {
    logger.error(
      'Failed to verify brand registration',
      'REQUEST_BRAND_INIT_AUTH',
      'REQUEST_BRAND_INIT_AUTH_FAILURE',
      error,
      { email },
    );
    throw error;
  }
};

const brandFindById = async (brandId, includePassword = false) => {
  try {
    const brandAuthh = await brandAuth.findOne({ _id: brandId }).exec();
    if (!brandAuthh) {
      throw new ClientErrors.NotFoundError('Brand', 404);
    }
    return includePassword ? brandAuthh : brandAuthh.toSafeObject();
  } catch (error) {
    logger.error(
      'Failed to verify brand by ID',
      'REQUEST_BRAND_FIND_BY_ID',
      'REQUEST_BRAND_FIND_BY_ID_FAILURE',
      error,
      { brandId },
    );
    throw error;
  }
};

const brandCreate = async (email, passwordHash) => {
  try {
    const brandAuthh = new brandAuth({
      email,
      passwordHash,
    });

    const brandDetails = await brandAuthh.save();
    return brandDetails;
  } catch (error) {
    logger.error(
      'Failed to create brand auth entry',
      'REQUEST_BRAND_CREATE_AUTH',
      'REQUEST_BRAND_CREATE_AUTH_FAILURE',
      error,
      { email },
    );

    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

const brandUpdatePassword = async (brandId, hashedPassword) => {
  try {
    const brandAuthh = await brandAuth.findOneAndUpdate(
      { _id: brandId },
      {
        passwordHash: hashedPassword,
        $inc: { tokenVersion: 1 },
      },
      { new: true },
    ).exec();

    if (!brandAuthh) {
      throw new Error('BrandAuth not found');
    }

    return brandAuthh;
  } catch (error) {
    logger.error(
      'Failed to update brand password',
      'REQUEST_UPDATE_BRAND_PSWD',
      'REQUEST_UPDATE_BRAND_PSWD_FAILURE',
      error,
      { brandId },
    );
    throw error;
  }
};

const StoreAuthRepository = {
  findByEmail,
  create,
  updatePassword,
  findById,
  brandFindByEmail,
  brandCreate,
  brandUpdatePassword,
  brandFindById,
};

module.exports = { StoreAuthRepository };
