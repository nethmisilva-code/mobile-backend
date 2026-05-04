const express = require('express');
const {
    getPayments,
    updatePaymentStatus,
    getInvoices,
    createPayment
} = require('../controllers/payments');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Anyone can view invoices
router.get('/invoices', getInvoices);

// Customers can create payments, Admins can view all
router.route('/')
    .get(getPayments)
    .post(createPayment);

router.route('/:id')
    .put(authorize('admin', 'staff'), updatePaymentStatus);

module.exports = router;
