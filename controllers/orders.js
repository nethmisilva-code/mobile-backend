const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin, Staff, Customer)
exports.getOrders = async (req, res, next) => {
    try {
        let query;

        // If user is not admin/staff, they can only see their own orders
        if (req.user.role !== 'admin' && req.user.role !== 'staff') {
            query = Order.find({ customer: req.user.id }).populate('items.product');
        } else {
            query = Order.find().populate('customer', 'name email').populate('items.product');
        }

        const orders = await query;
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res, next) => {
    try {
        req.body.customer = req.user.id;
        
        // Generate order number
        req.body.orderNumber = 'ORD-' + Date.now().toString().slice(-10);

        const order = await Order.create(req.body);

        // Update stock quantity
        for (const item of req.body.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stockQuantity: -item.quantity }
            });
        }

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin, Staff)
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, {
            orderStatus: req.body.orderStatus
        }, {
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
