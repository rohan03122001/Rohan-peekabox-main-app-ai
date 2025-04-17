const validateOrderSearch = (req, res, next) => {
    const { startDate, endDate, orderId } = req.query;
    
    // Validate date 
    if (startDate && isNaN(new Date(startDate).getTime())) {
      return res.status(400).json({ error: 'Invalid startDate format' });
    }
    
    if (endDate && isNaN(new Date(endDate).getTime())) {
      return res.status(400).json({ error: 'Invalid endDate format' });
    }
    
    // Validate MongoDB ObjectId 
    if (orderId && !orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid orderId format' });
    }
    
    //succsess
    next();
  };
  
  module.exports = validateOrderSearch;