const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const products = [
    {
        productCode: 'TEA-BLK-001',
        name: 'Ceylon Black BOP',
        category: 'Black Tea',
        teaType: 'BOP',
        price: 2500,
        stockQuantity: 10, 
        reorderLevel: 20,
        image: 'https://images.unsplash.com/photo-1594631252845-29fc458631b6?q=80&w=800&auto=format&fit=crop'
    },
    {
        productCode: 'TEA-GRN-002',
        name: 'Pure Green Leaf',
        category: 'Green Tea',
        teaType: 'Green',
        price: 1800,
        stockQuantity: 50,
        reorderLevel: 15,
        image: 'https://images.unsplash.com/photo-1563911191470-353235b2e930?q=80&w=800&auto=format&fit=crop'
    },
    {
        productCode: 'TEA-WHT-003',
        name: 'Silver Tips White',
        category: 'White Tea',
        teaType: 'Tips',
        price: 8500,
        stockQuantity: 5, 
        reorderLevel: 10,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop'
    },
    {
        productCode: 'TEA-PRM-004',
        name: 'Organic Earl Grey',
        category: 'Premium',
        teaType: 'Infusion',
        price: 3200,
        stockQuantity: 40,
        reorderLevel: 10,
        image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop'
    }
];

const users = [
    {
        name: 'System Admin',
        email: 'admin@ceylonsync.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        name: 'John Customer',
        email: 'customer@gmail.com',
        password: 'customer123',
        role: 'customer'
    },
    {
        name: 'Jane Employee',
        email: 'employee@ceylonsync.com',
        password: 'employee123',
        role: 'employee'
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Atlas for Seeding...');
        
        await Product.deleteMany();
        await User.deleteMany();
        
        try {
            await User.collection.dropIndexes();
            console.log('Old database indexes cleared.');
        } catch (e) {
            console.log('No old indexes to clear.');
        }

        await Product.insertMany(products);
        
        for (const user of users) {
            await User.create(user);
        }
        
        console.log('Final System Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
