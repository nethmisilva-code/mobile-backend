const express = require('express');
const {
    getPayments,
    createPayment,
    updatePaymentStatus,
    getInvoices
} = require('../controllers/payments');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Must define /invoices BEFORE /:id to prevent route conflict
router.get('/invoices', getInvoices);

router.route('/')
    .get(getPayments)
    .post(createPayment);

router.route('/:id')
    .put(authorize('admin', 'staff'), updatePaymentStatus);

module.exports = router;
