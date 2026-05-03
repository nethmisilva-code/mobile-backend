const Employee = require('../models/Employee');
const Payroll = require('../models/Payroll');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (Admin, Staff)
exports.getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find().populate('user', 'name email');
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get employee profile (for logged in employee)
// @route   GET /api/employees/me
// @access  Private (Employee)
exports.getEmployeeProfile = async (req, res, next) => {
    try {
        const employee = await Employee.findOne({ user: req.user.id }).populate('user', 'name email');
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found' });
        }
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Create employee profile
// @route   POST /api/employees
// @access  Private (Admin)
exports.createEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get payroll for an employee
// @route   GET /api/employees/:id/payroll
// @access  Private (Admin, Staff, Employee)
exports.getEmployeePayroll = async (req, res, next) => {
    try {
        let employeeId = req.params.id;

        // If user is employee, verify it's their own payroll
        if (req.user.role === 'employee') {
            const empProfile = await Employee.findOne({ user: req.user.id });
            if (!empProfile || empProfile._id.toString() !== req.params.id) {
                return res.status(403).json({ success: false, message: 'Not authorized' });
            }
        }

        const payroll = await Payroll.find({ employee: employeeId });
        res.status(200).json({ success: true, count: payroll.length, data: payroll });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Generate payroll
// @route   POST /api/employees/payroll
// @access  Private (Admin)
exports.generatePayroll = async (req, res, next) => {
    try {
        const { employeeId, payPeriod, allowances, deductions } = req.body;
        
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        const netSalary = employee.basicSalary + (allowances || 0) - (deductions || 0);

        const payroll = await Payroll.create({
            employee: employeeId,
            payPeriod,
            basicSalary: employee.basicSalary,
            allowances,
            deductions,
            netSalary
        });

        res.status(201).json({ success: true, data: payroll });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
