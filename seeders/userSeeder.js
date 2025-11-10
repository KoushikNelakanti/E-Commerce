const mongoose = require('mongoose');
const User = require('../models/user');
const Category = require('../models/category');
require('dotenv').config();

// Default user accounts
const defaultUsers = [
  {
    name: 'System Administrator',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    role: 2, // Admin
    about: 'System administrator with full access to all features',
    alertPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
    phoneNumber: '+1234567890',
  },
  {
    name: 'John Seller',
    email: 'seller@ecommerce.com',
    password: 'seller123',
    role: 1, // Seller
    about: 'Product seller managing electronics and gadgets',
    alertPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
    },
    phoneNumber: '+1234567891',
  },
  {
    name: 'Jane Customer',
    email: 'customer@ecommerce.com',
    password: 'customer123',
    role: 0, // Customer
    about: 'Regular customer who loves shopping for deals',
    alertPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
    phoneNumber: '+1234567892',
  },
  {
    name: 'Alice Buyer',
    email: 'alice@example.com',
    password: 'alice123',
    role: 0, // Customer
    about: 'Fashion enthusiast and frequent shopper',
    alertPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: false,
    },
    phoneNumber: '+1234567893',
  },
  {
    name: 'Bob Merchant',
    email: 'bob@merchant.com',
    password: 'bob123',
    role: 1, // Seller
    about: 'Clothing and accessories merchant',
    alertPreferences: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
    },
    phoneNumber: '+1234567894',
  },
];

// Default categories matching Fake Store API
const defaultCategories = [
  {
    name: "Electronics",
    description: "Electronic devices and gadgets"
  },
  {
    name: "Jewelery",
    description: "Jewelry and accessories"
  },
  {
    name: "Men's Clothing",
    description: "Men's fashion and clothing"
  },
  {
    name: "Women's Clothing",
    description: "Women's fashion and clothing"
  },
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    console.log('🌱 Starting user seeding...');

    // Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});
    // console.log('Cleared existing users');

    const createdUsers = [];

    for (const userData of defaultUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        createdUsers.push(existingUser);
        continue;
      }

      // Create new user
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      
      console.log(`✅ Created ${userData.role === 2 ? 'Admin' : userData.role === 1 ? 'Seller' : 'Customer'}: ${userData.email}`);
    }

    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Seed categories
const seedCategories = async () => {
  try {
    console.log('🌱 Starting category seeding...');

    const createdCategories = [];

    for (const categoryData of defaultCategories) {
      // Check if category already exists
      const existingCategory = await Category.findOne({ name: categoryData.name });
      
      if (existingCategory) {
        console.log(`Category ${categoryData.name} already exists, skipping...`);
        createdCategories.push(existingCategory);
        continue;
      }

      // Create new category
      const category = new Category(categoryData);
      await category.save();
      createdCategories.push(category);
      
      console.log(`✅ Created category: ${categoryData.name}`);
    }

    return createdCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

// Main seeder function
const runSeeder = async () => {
  try {
    await connectDB();
    
    console.log('🚀 Starting database seeding...');
    console.log('=====================================');
    
    const users = await seedUsers();
    const categories = await seedCategories();
    
    console.log('=====================================');
    console.log('✅ Seeding completed successfully!');
    console.log('');
    console.log('📋 Default Accounts Created:');
    console.log('');
    console.log('👨‍💻 ADMIN ACCOUNT:');
    console.log('   Email: admin@ecommerce.com');
    console.log('   Password: admin123');
    console.log('   Role: Administrator (Full Access)');
    console.log('');
    console.log('🏪 SELLER ACCOUNTS:');
    console.log('   Email: seller@ecommerce.com');
    console.log('   Password: seller123');
    console.log('   Role: Seller (Product Management)');
    console.log('');
    console.log('   Email: bob@merchant.com');
    console.log('   Password: bob123');
    console.log('   Role: Seller (Product Management)');
    console.log('');
    console.log('👤 CUSTOMER ACCOUNTS:');
    console.log('   Email: customer@ecommerce.com');
    console.log('   Password: customer123');
    console.log('   Role: Customer (Shopping & Alerts)');
    console.log('');
    console.log('   Email: alice@example.com');
    console.log('   Password: alice123');
    console.log('   Role: Customer (Shopping & Alerts)');
    console.log('');
    console.log('📂 Categories Created:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name}`);
    });
    console.log('');
    console.log('🌐 You can now login with any of these accounts!');
    console.log('=====================================');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Export for use in other files
module.exports = {
  runSeeder,
  seedUsers,
  seedCategories,
  defaultUsers,
  defaultCategories,
};

// Run seeder if this file is executed directly
if (require.main === module) {
  runSeeder();
}
