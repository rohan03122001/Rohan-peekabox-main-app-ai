const { PaymentRepository } = require('../Repositories/payment.repository');
const logger = require('../config/logger');

const storePayment = async (paymentData) => {
  try {
    const newPayment = await PaymentRepository.storePayment(paymentData);
    return newPayment;
  } catch (error) {
    logger.error('Failed to create Payment', {
      action: 'STORE_PAYMENT',
      error: error.message,
    });
    throw error;
  }
};

const getPaymentsByStoreId = async (storeId, page, pageSize) => {
  try {
    return await PaymentRepository.getPaymentsByStoreId(storeId, page, pageSize);
  } catch (error) {
    logger.error('Failed to fetch payments by storeId', {
      action: 'GET_PAYMENTS_BY_STORE_ID',
      storeId,
      error: error.message,
    });
    throw error;
  }
};

const getTotalSalesDeatils = async (storeId) => {
  try {
    return await PaymentRepository.getTotalSalesDetails(storeId);
  } catch (error) {
    logger.error('Failed to fetch payments by storeId', {
      action: 'GET_PAYMENTS_Details_BY_STORE_ID',
      error: error.message,
    });
    throw error;
  }
};


const searchPayment = async (filter, page = 1, limit = 10) => {
  try {
    return await PaymentRepository.searchPayment(filter, page, limit);
  } catch (error) {
    console.error("Failed to search orders in service:", error);
    throw new Error("Error retrieving orders");
  }
};


const PaymentService = {
  storePayment,
  searchPayment,
  getPaymentsByStoreId,
  getTotalSalesDeatils 
}

module.exports = {
  PaymentService
};
