const Cart = require('../models/Cart');

// @desc    Get current user's cart
// @route   GET /api/cart
exports.getCart = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(200).json({ success: true, data: { items: [] } });
        }
        
        let cart = await Cart.findOne({ customer: req.user.id });
        if (!cart) {
            cart = await Cart.create({ customer: req.user.id, items: [] });
        }
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error('Cart Fetch Error:', error);
        res.status(200).json({ success: true, data: { items: [] } });
    }
};

// @desc    Update cart items
// @route   POST /api/cart
exports.updateCart = async (req, res, next) => {
    try {
        const { items } = req.body;
        if (!req.user) return res.status(401).json({ success: false });

        let cart = await Cart.findOneAndUpdate(
            { customer: req.user.id },
            { items, updatedAt: Date.now() },
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
exports.clearCart = async (req, res, next) => {
    try {
        await Cart.findOneAndDelete({ customer: req.user.id });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
