const express = require('express');
const {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
} = require('../controllers/suppliers');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin', 'staff'));

router.route('/')
    .get(getSuppliers)
    .post(createSupplier);

router.route('/:id')
    .put(updateSupplier)
    .delete(deleteSupplier);

module.exports = router;
