const express = require('express');
const {
    getOrders,
    createOrder,
    updateOrderStatus
} = require('../controllers/orders');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(protect, getOrders)
    .post(protect, authorize('customer'), createOrder);

router
    .route('/:id/status')
    .put(protect, authorize('admin', 'staff'), updateOrderStatus);

module.exports = router;
