const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');
const Supplier = require('../models/Supplier');

dotenv.config();

const products = [
    {
        productCode: 'TEA-BLK-001',
        name: 'Ceylon Black BOP',
        category: 'Black Tea',
        teaType: 'BOP',
        price: 2500,
        stockQuantity: 15,
        reorderLevel: 5,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=800&auto=format&fit=crop'
    },
    {
        productCode: 'TEA-GRN-002',
        name: 'Pure Green Leaf',
        category: 'Green Tea',
        teaType: 'Green',
        price: 1800,
        stockQuantity: 0,
        reorderLevel: 5,
        isAvailable: false,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop'
    },
    {
        productCode: 'TEA-WHT-003',
        name: 'Silver Tips White',
        category: 'White Tea',
        teaType: 'Tips',
        price: 8500,
        stockQuantity: 8,
        reorderLevel: 5,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop'
    },
    {
        productCode: 'TEA-PRM-004',
        name: 'Organic Earl Grey',
        category: 'Premium',
        teaType: 'Infusion',
        price: 3200,
        stockQuantity: 0,
        reorderLevel: 5,
        isAvailable: false,
        image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop'
    },
    {
        productCode: 'TEA-MSL-005',
        name: 'Masala Chai Mix',
        category: 'Black Tea',
        teaType: 'Spiced',
        price: 1500,
        stockQuantity: 25,
        reorderLevel: 5,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop'
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

// 2 Pre-registered suppliers as requested
const suppliers = [
    {
        name: 'Nuwara Eliya Green Leaf Estate',
        email: 'estate@nuwara.lk',
        phone: '0812223344',
        address: 'Nuwara Eliya, Central Province',
        rawMaterialType: 'Green Leaf',
        onHandQty: 540
    },
    {
        name: 'Uva Highlands Tea Growers',
        email: 'supply@uvahighlands.lk',
        phone: '0552234567',
        address: 'Badulla, Uva Province',
        rawMaterialType: 'Orthodox Black Leaf',
        onHandQty: 320
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas...');

        // Drop existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Supplier.deleteMany();

        // Drop indexes to avoid conflicts
        try {
            await User.collection.dropIndexes();
            await Supplier.collection.dropIndexes();
            await Product.collection.dropIndexes();
        } catch (e) {
            console.log('Index cleanup skipped (first run)');
        }

        // Insert all data
        await Product.insertMany(products);
        console.log(`✅ ${products.length} Products seeded`);

        for (const user of users) {
            await User.create(user);
        }
        console.log(`✅ ${users.length} Users seeded (admin / customer / employee)`);

        await Supplier.insertMany(suppliers);
        console.log(`✅ ${suppliers.length} Suppliers seeded`);

        console.log('\n🎉 SEED COMPLETE! Credentials:');
        console.log('   Admin:    admin@ceylonsync.com / admin123');
        console.log('   Customer: customer@gmail.com / customer123');
        console.log('   Employee: employee@ceylonsync.com / employee123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed Error:', error.message);
        process.exit(1);
    }
};

seedData();
