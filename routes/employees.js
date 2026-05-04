const express = require('express');
const {
    getEmployees,
    getMyProfile,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employees');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Employee can access their own profile
router.get('/me', getMyProfile);

// Admin/staff only routes
router.route('/')
    .get(authorize('admin', 'staff'), getEmployees)
    .post(authorize('admin', 'staff'), createEmployee);

router.route('/:id')
    .put(authorize('admin', 'staff'), updateEmployee)
    .delete(authorize('admin', 'staff'), deleteEmployee);

module.exports = router;
