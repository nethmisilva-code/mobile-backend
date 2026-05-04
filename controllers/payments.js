const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res) => {
    try {
        let payments;
        if (req.user.role === 'admin' || req.user.role === 'staff') {
            payments = await Payment.find()
                .populate({ path: 'order', populate: { path: 'customer', select: 'name email' } })
                .sort('-createdAt');
        } else {
            // Customer: find their orders first, then find payments for those orders
            const myOrders = await Order.find({ customer: req.user.id }).select('_id');
            const orderIds = myOrders.map(o => o._id);
            payments = await Payment.find({ order: { $in: orderIds } })
                .populate('order')
                .sort('-createdAt');
        }
        res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        console.error('Get Payments Error:', error.message);
        res.status(200).json({ success: true, data: [] });
    }
};

// @desc    Create payment
// @route   POST /api/payments
// @access  Private (Customer)
exports.createPayment = async (req, res) => {
    try {
        // Auto-generate paymentId if not provided
        if (!req.body.paymentId) {
            req.body.paymentId = 'PAY-' + Date.now().toString().slice(-8);
        }
        const payment = await Payment.create(req.body);
        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        console.error('Create Payment Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Verify/Update payment status (Admin action)
// @route   PUT /api/payments/:id
// @access  Private (Admin)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { paymentStatus },
            { new: true }
        ).populate('order');

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // AUTO-GENERATE INVOICE when Admin verifies payment (Requirement 3.4.3)
        if (paymentStatus === 'verified' && payment.order) {
            // Mark order as paid
            await Order.findByIdAndUpdate(payment.order._id, { paymentStatus: 'paid' });

            // Only create invoice if one doesn't exist yet
            const existingInvoice = await Invoice.findOne({ payment: payment._id });
            if (!existingInvoice) {
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
        console.error('Update Payment Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get invoices
// @route   GET /api/payments/invoices
// @access  Private
exports.getInvoices = async (req, res) => {
    try {
        let invoices;
        if (req.user.role === 'admin' || req.user.role === 'staff') {
            invoices = await Invoice.find()
                .populate('customer', 'name email')
                .populate('order')
                .sort('-issueDate');
        } else {
            invoices = await Invoice.find({ customer: req.user.id })
                .populate('order')
                .sort('-issueDate');
        }
        res.status(200).json({ success: true, count: invoices.length, data: invoices });
    } catch (error) {
        console.error('Get Invoices Error:', error.message);
        res.status(200).json({ success: true, data: [] });
    }
};
