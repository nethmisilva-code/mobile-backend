const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    employeeId: {
        type: String,
        unique: true,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    basicSalary: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    joinedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
