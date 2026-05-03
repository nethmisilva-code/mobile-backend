const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config({ path: './.env' });

const products = [
    {
        productCode: 'TEA001',
        name: 'Ceylon BOP Tea',
        category: 'Black Tea',
        teaType: 'BOP',
        price: 2800,
        stockQuantity: 100,
        reorderLevel: 20
    },
    {
        productCode: 'TEA002',
        name: 'Green Leaf Tea',
        category: 'Green Tea',
        teaType: 'Green',
        price: 1800,
        stockQuantity: 50,
        reorderLevel: 15
    },
    {
        productCode: 'TEA003',
        name: 'Dust Tea Pack',
        category: 'Black Tea',
        teaType: 'Dust',
        price: 950,
        stockQuantity: 200,
        reorderLevel: 50
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
        
        // Clear existing
        await Product.deleteMany();
        await User.deleteMany();
        
        // Add data
        await Product.insertMany(products);
        
        // Use create for users to trigger password hashing middleware
        for (const user of users) {
            await User.create(user);
        }
        
        console.log('Users and Products Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
