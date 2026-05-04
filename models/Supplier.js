const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a supplier name']
    },
    email: {
        type: String
    },
    phone: {
        type: String,
        default: 'N/A'
    },
    address: {
        type: String,
        default: 'N/A'
    },
    rawMaterialType: {
        type: String,
        required: [true, 'Please specify the material type (e.g. Green Leaf)']
    },
    onHandQty: {
        type: Number,
        default: 0
    },
    lastDeliveryDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Supplier', SupplierSchema);
