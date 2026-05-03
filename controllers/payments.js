const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin, Staff, Customer)
exports.getPayments = async (req, res, next) => {
    try {
        let query;

        if (req.user.role !== 'admin' && req.user.role !== 'staff') {
            query = Payment.find({ customer: req.user.id }).populate('order');
        } else {
            query = Payment.find().populate('customer', 'name email').populate('order');
        }

        const payments = await query;
        res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private (Customer)
exports.createPayment = async (req, res, next) => {
    try {
        req.body.customer = req.user.id;
        req.body.paymentNumber = 'PAY-' + Date.now().toString().slice(-10);

        const payment = await Payment.create(req.body);

        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Verify payment (Admin/Staff)
// @route   PUT /api/payments/:id/verify
// @access  Private (Admin, Staff)
exports.verifyPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, {
            paymentStatus: 'paid',
            paidAt: Date.now()
        }, {
            new: true
        });

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // Update Order payment status
        await Order.findByIdAndUpdate(payment.order, { paymentStatus: 'paid' });

        // Generate Invoice
        const invoiceCount = await Invoice.countDocuments();
        const invoiceNumber = 'INV-' + (invoiceCount + 1001);

        const invoice = await Invoice.create({
            invoiceNumber,
            order: payment.order,
            payment: payment._id,
            customer: payment.customer,
            totalAmount: payment.amount
        });

        res.status(200).json({ success: true, data: { payment, invoice } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
