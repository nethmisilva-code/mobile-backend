const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    paymentNumber: {
        type: String,
        unique: true,
        required: true
    },
    order: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order',
        required: true
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Bank Transfer'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    transactionReference: {
        type: String
    },
    receiptUrl: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    paidAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);
