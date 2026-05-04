const User = require('../models/User');

// @desc    Get all employees/staff
// @route   GET /api/employees
// @access  Private (Admin)
exports.getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ 
            role: { $in: ['employee', 'staff'] } 
        }).select('-password');
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (error) {
        console.error('Get Employees Error:', error.message);
        res.status(200).json({ success: true, data: [] });
    }
};

// @desc    Get logged-in employee's own profile
// @route   GET /api/employees/me
// @access  Private (Employee/Staff)
exports.getMyProfile = async (req, res) => {
    try {
        const employee = await User.findById(req.user.id).select('-password');
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        console.error('Get My Profile Error:', error.message);
        res.status(200).json({ success: true, data: null });
    }
};

// @desc    Create employee
// @route   POST /api/employees
// @access  Private (Admin)
exports.createEmployee = async (req, res) => {
    try {
        req.body.role = req.body.role || 'employee';
        if (!req.body.password) {
            req.body.password = 'employee123';
        }
        const employee = await User.create(req.body);
        const { password, ...safeEmployee } = employee.toObject();
        res.status(201).json({ success: true, data: safeEmployee });
    } catch (error) {
        console.error('Create Employee Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin)
exports.updateEmployee = async (req, res) => {
    try {
        delete req.body.password;
        const employee = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: false
        }).select('-password');
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        console.error('Update Employee Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin)
exports.deleteEmployee = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Delete Employee Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
