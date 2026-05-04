const User = require('../models/User');

// @desc    Get all employees
// @route   GET /api/employees
exports.getEmployees = async (req, res, next) => {
    try {
        const employees = await User.find({ role: { $in: ['employee', 'staff'] } });
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Create employee
// @route   POST /api/employees
exports.createEmployee = async (req, res, next) => {
    try {
        req.body.role = req.body.role || 'employee';
        const employee = await User.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
exports.updateEmployee = async (req, res, next) => {
    try {
        const employee = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
exports.deleteEmployee = async (req, res, next) => {
    try {
        const employee = await User.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
