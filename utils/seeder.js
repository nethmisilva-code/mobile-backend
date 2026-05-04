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
        image: 'https://images.unsplash.com/photo-1594631252845-29fc458631b6?auto=format&fit=crop&q=80&w=1000'
    },
    {
        productCode: 'TEA002',
        name: 'Masala Chai Mix',
        category: 'Flavored Tea',
        teaType: 'Blend',
        price: 1500,
        stockQuantity: 80,
        reorderLevel: 15,
        image: 'https://images.unsplash.com/photo-1544787210-2211d44b565a?auto=format&fit=crop&q=80&w=1000'
    },
    {
        productCode: 'TEA003',
        name: 'Green Tea Pure',
        category: 'Green Tea',
        teaType: 'Leaf',
        price: 1800,
        stockQuantity: 60,
        reorderLevel: 10,
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=1000'
    },
    {
        productCode: 'TEA004',
        name: 'Silver Tips',
        category: 'White Tea',
        teaType: 'Premium',
        price: 4500,
        stockQuantity: 25,
        reorderLevel: 5,
        image: 'https://images.unsplash.com/photo-1563911891283-14c90772bb76?auto=format&fit=crop&q=80&w=1000'
    },
    {
        productCode: 'TEA005',
        name: 'Earl Grey',
        category: 'Black Tea',
        teaType: 'Flavored',
        price: 1400,
        stockQuantity: 100,
        reorderLevel: 20,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1000'
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for seeding...');

        // Drop old unique indexes
        try { await Payment.collection.dropIndexes(); } catch (e) {}
        try { await Product.collection.dropIndexes(); } catch (e) {}
        try { await User.collection.dropIndexes(); } catch (e) {}

        // Clear ALL existing data to ensure clean credentials
        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();
        await Payment.deleteMany();
        await Supplier.deleteMany();
        console.log('Database cleared (including Users).');

        // Seed products
        await Product.insertMany(products);
        console.log('Products seeded.');

        // Seed base users with requested credentials
        await User.create([
            {
                name: 'Admin User',
                email: 'admin@ceylonsync.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                name: 'Test Customer',
                email: 'customer@gmail.com',
                password: 'Customer123',
                role: 'customer'
            },
            // Seeding 3 Employees
            {
                name: 'Sunil Perera',
                email: 'sunil@ceylonsync.com',
                password: 'employee123',
                role: 'employee'
            },
            {
                name: 'Kamal Silva',
                email: 'kamal@ceylonsync.com',
                password: 'employee123',
                role: 'employee'
            },
            {
                name: 'Nimali Jayawardena',
                email: 'nimali@ceylonsync.com',
                password: 'employee123',
                role: 'employee'
            }
        ]);
        console.log('Admin, Customer, and 3 Employees created.');

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

        console.log('Final clean seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
