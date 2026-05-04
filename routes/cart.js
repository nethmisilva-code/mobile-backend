const express = require('express');
const {
    getCart,
    updateCart,
    clearCart
} = require('../controllers/cart');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getCart)
    .post(updateCart)
    .delete(clearCart);

module.exports = router;
