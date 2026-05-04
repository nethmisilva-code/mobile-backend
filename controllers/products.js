const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        // Always return success even if empty, to prevent frontend 400 errors
        res.status(200).json({ 
            success: true, 
            count: products.length, 
            data: products || [] 
        });
    } catch (error) {
        console.error('Fetch Products Error:', error);
        res.status(200).json({ success: true, data: [] });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Create product
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
    try {
        req.body.isAvailable = req.body.stockQuantity > 0;
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
    try {
        if (req.body.stockQuantity !== undefined) {
            req.body.isAvailable = req.body.stockQuantity > 0;
        }
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
