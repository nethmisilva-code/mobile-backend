const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
    try {
        let orders;
        if (req.user.role === 'admin' || req.user.role === 'staff') {
            orders = await Order.find()
                .populate('customer', 'name email phone')
                .sort('-createdAt');
        } else {
            orders = await Order.find({ customer: req.user.id })
                .sort('-createdAt');
        }
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        console.error('Get Orders Error:', error.message);
        res.status(200).json({ success: true, data: [] });
    }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res) => {
    try {
        // Attach authenticated customer
        req.body.customer = req.user.id;
        req.body.orderNumber = 'ORD-' + Date.now().toString().slice(-8);

        const order = await Order.create(req.body);

        // Deduct stock from each product ordered
        if (req.body.items && req.body.items.length > 0) {
            for (const item of req.body.items) {
                if (item.product) {
                    await Product.findByIdAndUpdate(
                        item.product,
                        { $inc: { stockQuantity: -item.quantity } },
                        { new: true }
                    );
                }
            }
        }

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        console.error('Create Order Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin)
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: false }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Update Order Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
