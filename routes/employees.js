const express = require('express');
const {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employees');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin', 'staff'));

router.route('/')
    .get(getEmployees)
    .post(createEmployee);

router.route('/:id')
    .put(updateEmployee)
    .delete(deleteEmployee);

module.exports = router;
