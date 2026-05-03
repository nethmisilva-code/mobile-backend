const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        unique: true,
        required: true
    },
    order: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order',
        required: true
    },
    payment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Payment',
        required: true
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    invoiceStatus: {
        type: String,
        enum: ['issued', 'paid', 'cancelled'],
        default: 'issued'
    },
    issuedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
