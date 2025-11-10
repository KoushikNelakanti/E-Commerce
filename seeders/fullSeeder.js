const mongoose = require('mongoose');
const { seedUsers, seedCategories } = require('./userSeeder');
const fakeStoreService = require('../services/fakeStoreService');
const User = require('../models/user');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for full seeding');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

// Full seeder function
const runFullSeeder = async () => {
  try {
    await connectDB();
    
    console.log('🚀 Starting complete database seeding...');
    console.log('=====================================');
    
    // Step 1: Seed users and categories
    console.log('📝 Step 1: Seeding users and categories...');
    const users = await seedUsers();
    const categories = await seedCategories();
    
    // Step 2: Get a seller for product assignment
    console.log('📝 Step 2: Finding seller for product assignment...');
    const seller = await User.findOne({ role: 1 }); // Find a seller
    
    if (!seller) {
      console.error('❌ No seller found! Please ensure user seeding completed successfully.');
      process.exit(1);
    }
    
    console.log(`✅ Using seller: ${seller.name} (${seller.email})`);
    
    // Step 3: Sync products from Fake Store API
    console.log('📝 Step 3: Syncing products from Fake Store API...');
    const syncedProducts = await fakeStoreService.syncProductsToDatabase(seller._id);
    
    console.log('=====================================');
    console.log('🎉 COMPLETE SEEDING SUCCESSFUL!');
    console.log('=====================================');
    console.log('');
    console.log('📊 SEEDING SUMMARY:');
    console.log(`   👥 Users: ${users.length} accounts created`);
    console.log(`   📂 Categories: ${categories.length} categories created`);
    console.log(`   📦 Products: ${syncedProducts.length} products synced from Fake Store API`);
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
    console.log('   ✅ Product browsing with Fake Store API data');
    console.log('   ✅ Price & stock alerts system');
    console.log('   ✅ Email notifications');
    console.log('   ✅ Seller dashboard & product management');
    console.log('   ✅ Admin panel with full control');
    console.log('   ✅ Shopping cart & checkout');
    console.log('   ✅ Order management');
    console.log('=====================================');
    
  } catch (error) {
    console.error('❌ Full seeding failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Export for use in other files
module.exports = {
  runFullSeeder,
};

// Run seeder if this file is executed directly
if (require.main === module) {
  runFullSeeder();
}
