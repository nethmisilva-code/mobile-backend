const express = require('express');
const {
    getPayments,
    createPayment,
    verifyPayment
} = require('../controllers/payments');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(protect, getPayments)
    .post(protect, authorize('customer'), createPayment);

router
    .route('/:id/verify')
    .put(protect, authorize('admin', 'staff'), verifyPayment);

module.exports = router;
