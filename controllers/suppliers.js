const Supplier = require('../models/Supplier');

exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort('-createdAt');
        res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
    } catch (error) {
        console.error('Get Suppliers Error:', error.message);
        res.status(200).json({ success: true, data: [] });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.create(req.body);
        res.status(201).json({ success: true, data: supplier });
    } catch (error) {
        console.error('Create Supplier Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: false
        });
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found' });
        }
        res.status(200).json({ success: true, data: supplier });
    } catch (error) {
        console.error('Update Supplier Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        await Supplier.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Delete Supplier Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
