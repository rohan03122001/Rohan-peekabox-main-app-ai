const express = require('express');
const router = express.Router();
const userRoutes = require('./user.route');
const storeRoutes = require('./store.route');
const internalRoutes = require('./internal.route');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Mount routes with their respective middleware
router.use('/users', userRoutes);

router.use('/stores', storeRoutes);

router.use('/internal', internalRoutes);

const routerV1 = router;

module.exports = { routerV1 };
