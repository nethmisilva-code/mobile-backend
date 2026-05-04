const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all orders
// @route   GET /api/orders
exports.getOrders = async (req, res, next) => {
    try {
        let query;
        if (req.user && req.user.role === 'admin') {
            // Admin sees everything, populated with customer details
            query = Order.find().populate('customer', 'name email');
        } else {
            // Customers see only their orders
            query = Order.find({ customer: req.user.id });
        }

        const orders = await query.sort('-createdAt');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Create order
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
    try {
        req.body.customer = req.user.id;
        
        // Generate unique order number
        req.body.orderNumber = 'ORD-' + Date.now().toString().slice(-6).toUpperCase();
        
        const order = await Order.create(req.body);

        // Deduct stock from products
        for (const item of req.body.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stockQuantity: -item.quantity }
            });
        }

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        console.error('Order Creation Error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
