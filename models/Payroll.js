const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        required: true
    },
    payPeriod: {
        type: String, // e.g., "May 2026"
        required: true
    },
    basicSalary: {
        type: Number,
        required: true
    },
    allowances: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payroll', PayrollSchema);
