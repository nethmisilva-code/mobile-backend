const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');

// @desc    Get all payments
// @route   GET /api/payments
exports.getPayments = async (req, res, next) => {
    try {
        let query;
        if (req.user && req.user.role === 'admin') {
            query = Payment.find().populate('order');
        } else {
            // For customers, we need to find orders first to find their payments
            const customerOrders = await Order.find({ customer: req.user.id }).select('_id');
            const orderIds = customerOrders.map(o => o._id);
            query = Payment.find({ order: { $in: orderIds } }).populate('order');
        }

        const payments = await query;
        res.status(200).json({ success: true, count: payments.length, data: payments || [] });
    } catch (error) {
        console.error('Payments Fetch Error:', error);
        res.status(200).json({ success: true, data: [] });
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
            await Order.findByIdAndUpdate(payment.order._id, { paymentStatus: 'paid' });

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
        if (!req.user) return res.status(200).json({ success: true, data: [] });

        if (req.user.role === 'admin') {
            query = Invoice.find().populate('customer', 'name email').populate('order');
        } else {
            query = Invoice.find({ customer: req.user.id }).populate('order');
        }

        const invoices = await query;
        res.status(200).json({ success: true, count: invoices.length, data: invoices || [] });
    } catch (error) {
        console.error('Invoices Fetch Error:', error);
        res.status(200).json({ success: true, data: [] });
    }
};

// @desc    Create payment record
// @route   POST /api/payments
exports.createPayment = async (req, res, next) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
