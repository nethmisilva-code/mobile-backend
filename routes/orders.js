const express = require('express');
const {
    getOrders,
    createOrder,
    updateOrder
} = require('../controllers/orders');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getOrders)
    .post(createOrder);

router.route('/:id')
    .put(updateOrder);

module.exports = router;
