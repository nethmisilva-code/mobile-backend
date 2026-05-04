const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

dotenv.config();

const products = [
    {
        productCode: 'TEA001',
        name: 'Ceylon Black BOP',
        category: 'Black Tea',
        teaType: 'BOP',
        price: 1200,
        stockQuantity: 150,
        reorderLevel: 20,
        image: 'https://images.unsplash.com/photo-1594631252845-29fc458631b6'
    },
    {
        productCode: 'TEA002',
        name: 'Masala Chai Mix',
        category: 'Flavored Tea',
        teaType: 'Blend',
        price: 1500,
        stockQuantity: 80,
        reorderLevel: 15,
        image: 'https://images.unsplash.com/photo-1544787210-2211d44b565a'
    },
    {
        productCode: 'TEA003',
        name: 'Green Tea Pure',
        category: 'Green Tea',
        teaType: 'Leaf',
        price: 1800,
        stockQuantity: 60,
        reorderLevel: 10,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9'
    },
    {
        productCode: 'TEA004',
        name: 'Silver Tips',
        category: 'White Tea',
        teaType: 'Premium',
        price: 4500,
        stockQuantity: 25,
        reorderLevel: 5,
        image: 'https://images.unsplash.com/photo-1563911891283-14c90772bb76'
    },
    {
        productCode: 'TEA005',
        name: 'Earl Grey',
        category: 'Black Tea',
        teaType: 'Flavored',
        price: 1400,
        stockQuantity: 100,
        reorderLevel: 20,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3'
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for seeding...');

        // CRITICAL: Drop indexes to resolve "paymentNumber_1" duplicate key errors
        // This clears old unique constraints that are no longer in the schema
        try {
            await Payment.collection.dropIndexes();
            console.log('Payment indexes dropped.');
        } catch (e) { console.log('No payment indexes to drop.'); }

        try {
            await Product.collection.dropIndexes();
            console.log('Product indexes dropped.');
        } catch (e) { console.log('No product indexes to drop.'); }

        // Clear existing data
        await Product.deleteMany();
        await Order.deleteMany();
        await Payment.deleteMany();
        await Supplier.deleteMany();
        console.log('Data cleared.');

        // Seed products
        await Product.insertMany(products);
        console.log('Products seeded.');

        // Ensure base users exist
        const adminExists = await User.findOne({ email: 'admin@ceylonsync.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin User',
                email: 'admin@ceylonsync.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin user created.');
        }

        const customerExists = await User.findOne({ email: 'customer@gmail.com' });
        if (!customerExists) {
            await User.create({
                name: 'Test Customer',
                email: 'customer@gmail.com',
                password: 'password123',
                role: 'customer'
            });
            console.log('Customer user created.');
        }

        // Seed Suppliers
        await Supplier.insertMany([
            {
                name: 'Nuwara Eliya Tea Estates',
                email: 'supply@nuwara.com',
                phone: '0521122334',
                address: 'Nuwara Eliya, Sri Lanka',
                rawMaterialType: 'Green Leaf',
                onHandQty: 5000
            },
            {
                name: 'Kandy Hill Plantations',
                email: 'kandy@tea.com',
                phone: '0812233445',
                address: 'Kandy, Sri Lanka',
                rawMaterialType: 'Fertilizer',
                onHandQty: 1200
            }
        ]);
        console.log('Suppliers seeded.');

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
