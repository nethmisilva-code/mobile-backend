const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productCode: {
        type: String,
        required: [true, 'Please add a unique product code'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    category: {
        type: String,
        required: [true, 'Please select a category']
    },
    teaType: {
        type: String,
        required: [true, 'Please specify tea type']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    stockQuantity: {
        type: Number,
        required: [true, 'Please add quantity on hand']
    },
    reorderLevel: {
        type: Number,
        default: 10
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1594631252845-29fc458631b6'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-update availability based on stock
ProductSchema.pre('save', function(next) {
    this.isAvailable = this.stockQuantity > 0;
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
