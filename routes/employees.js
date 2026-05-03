const express = require('express');
const {
    getEmployees,
    getEmployeeProfile,
    createEmployee,
    getEmployeePayroll,
    generatePayroll
} = require('../controllers/employees');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin', 'staff'), getEmployees);
router.post('/', protect, authorize('admin'), createEmployee);
router.get('/me', protect, authorize('employee'), getEmployeeProfile);
router.post('/payroll', protect, authorize('admin'), generatePayroll);
router.get('/:id/payroll', protect, getEmployeePayroll);

module.exports = router;
