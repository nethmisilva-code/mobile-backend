const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productCode: {
        type: String,
        required: [true, 'Please add a product code'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    teaType: {
        type: String,
        required: [true, 'Please add a tea type']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    stockQuantity: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        default: 0
    },
    reorderLevel: {
        type: Number,
        required: [true, 'Please add reorder level'],
        default: 10
    },
    isActive: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for inStock status
ProductSchema.virtual('inStock').get(function() {
    return this.stockQuantity > 0;
});

module.exports = mongoose.model('Product', ProductSchema);
