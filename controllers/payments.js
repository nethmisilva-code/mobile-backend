const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');

// @desc    Get all payments
// @route   GET /api/payments
exports.getPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find().populate('order');
        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update payment status (Verification)
// @route   PUT /api/payments/:id
exports.updatePaymentStatus = async (req, res, next) => {
    try {
        const { paymentStatus } = req.body;
        
        const payment = await Payment.findByIdAndUpdate(req.params.id, { paymentStatus }, {
            new: true,
            runValidators: true
        }).populate('order');

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // AUTO-INVOICE GENERATION (Requirement 3.4.3)
        if (paymentStatus === 'verified') {
            // Update order status to paid
            await Order.findByIdAndUpdate(payment.order._id, { paymentStatus: 'paid' });

            // Create Invoice
            const invoiceExists = await Invoice.findOne({ payment: payment._id });
            if (!invoiceExists) {
                await Invoice.create({
                    invoiceNumber: 'INV-' + Date.now().toString().slice(-8),
                    order: payment.order._id,
                    payment: payment._id,
                    customer: payment.order.customer,
                    totalAmount: payment.amount
                });
            }
        }

        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get invoices
// @route   GET /api/payments/invoices
exports.getInvoices = async (req, res, next) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = Invoice.find().populate('customer', 'name email').populate('order');
        } else {
            query = Invoice.find({ customer: req.user.id }).populate('order');
        }

        const invoices = await query;
        res.status(200).json({ success: true, count: invoices.length, data: invoices });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
