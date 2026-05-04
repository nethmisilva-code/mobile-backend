const express = require('express');
const {
    getPayments,
    updatePaymentStatus,
    getInvoices
} = require('../controllers/payments');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Anyone can view invoices (filtered by user in controller)
router.get('/invoices', getInvoices);

// Admin only for list and verification
router.route('/')
    .get(authorize('admin', 'staff'), getPayments);

router.route('/:id')
    .put(authorize('admin', 'staff'), updatePaymentStatus);

module.exports = router;
