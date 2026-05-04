const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a supplier name'],
        unique: true
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Please add a contact number']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
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
