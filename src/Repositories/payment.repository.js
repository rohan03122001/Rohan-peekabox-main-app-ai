const {Payment} = require('../models/payment.schema');
const logger = require('../config/logger');
const mongoose = require('mongoose'); 

const storePayment = async (paymentData) => {
  try {
    const payment = new Payment({
      orderId: paymentData.orderId,
      storeId: paymentData.storeId,
      productName: paymentData.productName,
      quantity: paymentData.quantity,
      GrossRevenue: paymentData.GrossRevenue,
      NetRevenue: paymentData.NetRevenue,
    });

    await payment.save();
    return payment;
  } catch (error) {
    logger.error('Failed to store Payment', {
      action: 'STORE_PAYMENT',
      error: error.message,
    });
    throw error;
  }
};


const getPaymentsByStoreId = async (storeId, page, pageSize) => {
  try {
    const skip = (page - 1) * pageSize;
    
    // Get total number of payments for pagination
    const totalOrders = await Payment.countDocuments({ storeId });

    // Fetch paginated data
    const payments = await Payment.find({ storeId })
      .skip(skip)
      .limit(pageSize);

    return { payments, totalOrders };  // Return totalOrders

  } catch (error) {
    logger.error('Failed to fetch payments by storeId', {
      action: 'GET_PAYMENTS_BY_STORE_ID',
      storeId,
      error: error.message,
    });
    throw error;
  }
};



const getTotalSalesDetails = async (storeId) => {
  try {
    const result = await Payment.aggregate([
      { $match: { storeId: new mongoose.Types.ObjectId(storeId) } }, // Filter by storeId
      {
        $group: {
          _id: null,
          totalGrossSales: { $sum: "$GrossRevenue" }, // Sum of all GrossRevenue
          totalNetSales: { $sum: "$NetRevenue" }, // Sum of all NetRevenue
          totalQuantitySold: { $sum: "$quantity" }, // Sum of all quantities (bags sold)
        },
      },
      {
        $project: {
          _id: 0,
          totalGrossSales: 1,
          totalNetSales: 1,
          totalCommission: { $subtract: ["$totalGrossSales", "$totalNetSales"] }, // Gross - Net
          totalQuantitySold: 1,
        },
      },
    ]);

    return result.length > 0 ? result[0] : { totalGrossSales: 0, totalNetSales: 0, totalCommission: 0, totalQuantitySold: 0 };
  } catch (error) {
    logger.error("Failed to calculate total sales details", {
      action: "CALCULATE_TOTAL_SALES",
      error: error.message,
    });
    throw error;
  }
};



const searchPayment = async (filter, page = 1, limit = 10) => {
  try {
    // Apply pagination
    const skip = (page - 1) * limit;

    // Find orders based on the filter (which can include orderId and date range)
    const payment = await Payment.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });  // Sort by createdAt in descending order

    // Count the total number of orders for pagination
    const totalPayment = await Payment.countDocuments(filter);

    // Return orders with pagination info
    return {
      payment,
      pagination: {
        totalPages: Math.ceil(totalPayment / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error searching orders in repository:", error);
    throw new Error("Database error while searching for orders");
  }
};



const PaymentRepository = {
  storePayment,
  searchPayment,
  getPaymentsByStoreId,
  getTotalSalesDetails
};

module.exports = {
  PaymentRepository
};
