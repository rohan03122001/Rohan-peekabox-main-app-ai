const logger = require('../config/logger');
const { PaymentService } = require('../Services/payment.service');
const mongoose = require('mongoose');


const storePayment = async (req, res, next) => {
  try {
    const paymentData = req.body;
    console.log('Payment Data:', paymentData);
    const result = await PaymentService.storePayment(paymentData);
    
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    logger.error('Failed to save Payment', {
      action: 'STORE_PAYMENT',
      error: error.message,
      stack: error.stack,
    });
    return next(error);
  }
};

const getPaymentByStoreId = async (req, res, next) => {
  try {
    const { storeId, page, pageSize } = req.params;
    const result = await PaymentService.getPaymentsByStoreId(storeId , page, pageSize );
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Payments not found' });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error('Failed to fetch payments by storeId', {
      action: 'GET_PAYMENTS_BY_STORE_ID',
      storeId,
      error: error.message,
    });
    return next(error);
  }
};


const getTotalSalesDeatils = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const result = await PaymentService.getTotalSalesDeatils(storeId);
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Sales details not found' });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error('Failed to fetch payments by storeId', {
      action: 'GET_Sales_BY_STORE_ID',
      error: error.message,
    });
    return next(error);
  }
};




const searchPayment = async (req, res, next) => {
  try {
    const { orderId, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Prepare the filter object based on query params
    let filter = {};

    // Validate orderId
    if (orderId && !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid order ID format",
      });
    }

    // Build the filter object if orderId is provided
    if (orderId) {
      filter.orderId = new mongoose.Types.ObjectId(orderId);
    }

     // Build the date range filter if both startDate and endDate are provided
     if (startDate && endDate) {
      // Convert startDate and endDate to Date objects
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      // Check if both dates are valid
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: "Invalid date format. Use a valid date format (e.g., YYYY-MM-DD).",
        });
      }

      // Adjust the times to get the full date range for the day
      const startOfDay = new Date(Date.UTC(parsedStartDate.getUTCFullYear(), parsedStartDate.getUTCMonth(), parsedStartDate.getUTCDate(), 0, 0, 0));
      const endOfDay = new Date(Date.UTC(parsedEndDate.getUTCFullYear(), parsedEndDate.getUTCMonth(), parsedEndDate.getUTCDate(), 23, 59, 59, 999));

      filter.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // Call the service to search for the order(s) with the filter
    const result = await PaymentService.searchPayment(filter, page, limit);

    if (!result || result.payment.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No orders found matching the search criteria",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        payment: result.payment,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    console.error("Failed to search orders:", error);
    return next(error);
  }
};


const PaymentController = {
    storePayment,
    searchPayment,
    getPaymentByStoreId,
    getTotalSalesDeatils

};

module.exports = {
    PaymentController
};
