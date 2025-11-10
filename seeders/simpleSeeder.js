const mongoose = require('mongoose');
const User = require('../models/user');
const Category = require('../models/category');
const { seedProducts } = require('./productSeeder');
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

// Main seeder function
const runSimpleSeeder = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
    
    console.log('🚀 Starting complete database seeding...');
    console.log('=====================================');
    
    // Step 1: Seed users
    console.log('📝 Step 1: Seeding users...');
    const createdUsers = [];
    
    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        createdUsers.push(existingUser);
        continue;
      }

      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      
      console.log(`✅ Created ${userData.role === 2 ? 'Admin' : userData.role === 1 ? 'Seller' : 'Customer'}: ${userData.email}`);
    }

    // Step 2: Seed categories
    console.log('📝 Step 2: Seeding categories...');
    const createdCategories = [];

    for (const categoryData of defaultCategories) {
      const existingCategory = await Category.findOne({ name: categoryData.name });
      
      if (existingCategory) {
        console.log(`Category ${categoryData.name} already exists, skipping...`);
        createdCategories.push(existingCategory);
        continue;
      }

      const category = new Category(categoryData);
      await category.save();
      createdCategories.push(category);
      
      console.log(`✅ Created category: ${categoryData.name}`);
    }

    // Step 3: Get a seller for product assignment
    console.log('📝 Step 3: Finding seller for product assignment...');
    const seller = await User.findOne({ role: 1 });
    
    if (!seller) {
      console.error('❌ No seller found! Please ensure user seeding completed successfully.');
      process.exit(1);
    }
    
    console.log(`✅ Using seller: ${seller.name} (${seller.email})`);
    
    // Step 4: Seed sample products
    console.log('📝 Step 4: Seeding sample products...');
    let createdProducts = [];
    
    try {
      createdProducts = await seedProducts();
      console.log(`✅ Successfully created ${createdProducts.length} products`);
    } catch (error) {
      console.log('⚠️ Product seeding failed, but seeding will continue...');
      console.log('Error:', error.message);
      createdProducts = [];
    }
    
    console.log('=====================================');
    console.log('🎉 SEEDING COMPLETED!');
    console.log('=====================================');
    console.log('');
    console.log('📊 SEEDING SUMMARY:');
    console.log(`   👥 Users: ${createdUsers.length} accounts created`);
    console.log(`   📂 Categories: ${createdCategories.length} categories created`);
    console.log(`   📦 Products: ${createdProducts.length} sample products created`);
    console.log('');
    console.log('🔐 LOGIN CREDENTIALS:');
    console.log('');
    console.log('👨‍💻 ADMIN ACCOUNT:');
    console.log('   Email: admin@ecommerce.com');
    console.log('   Password: admin123');
    console.log('   Access: Full system control');
    console.log('');
    console.log('🏪 SELLER ACCOUNTS:');
    console.log('   Email: seller@ecommerce.com');
    console.log('   Password: seller123');
    console.log('   Access: Product management & alerts');
    console.log('');
    console.log('   Email: bob@merchant.com');
    console.log('   Password: bob123');
    console.log('   Access: Product management & alerts');
    console.log('');
    console.log('👤 CUSTOMER ACCOUNTS:');
    console.log('   Email: customer@ecommerce.com');
    console.log('   Password: customer123');
    console.log('   Access: Shopping & price alerts');
    console.log('');
    console.log('   Email: alice@example.com');
    console.log('   Password: alice123');
    console.log('   Access: Shopping & price alerts');
    console.log('');
    console.log('🌐 NEXT STEPS:');
    console.log('   1. Start the application: npm run dev');
    console.log('   2. Visit: http://localhost:5173');
    console.log('   3. Login with any of the above credentials');
    console.log('   4. Explore the features based on your role!');
    console.log('');
    console.log('💡 FEATURES AVAILABLE:');
    console.log('   ✅ User authentication (login/logout/forgot password)');
    console.log('   ✅ Product browsing with 20 sample products');
    console.log('   ✅ Price & stock alerts system');
    console.log('   ✅ Email notifications');
    console.log('   ✅ Seller dashboard & product management');
    console.log('   ✅ Admin panel with full control');
    console.log('   ✅ Shopping cart & checkout');
    console.log('   ✅ Order management');
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
  runSimpleSeeder,
};

// Run seeder if this file is executed directly
if (require.main === module) {
  runSimpleSeeder();
}
