const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Sample products to seed
const sampleProducts = [
  {
    name: "iPhone 15 Pro Max",
    description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Features 6.7-inch Super Retina XDR display.",
    price: 99500,
    categoryName: "Electronics",
    quantity: 50,
    shipping: true,
    photo: null // Will be handled by photo upload in real app
  },
  {
    name: "MacBook Air M3",
    description: "13-inch MacBook Air with M3 chip, 8GB RAM, 256GB SSD. Ultra-thin and lightweight design with all-day battery life.",
    price: 91200,
    categoryName: "Electronics",
    quantity: 30,
    shipping: true,
    photo: null
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen, 200MP camera, and AI-powered features. 6.8-inch Dynamic AMOLED display.",
    price: 107800,
    categoryName: "Electronics",
    quantity: 25,
    shipping: true,
    photo: null
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones with premium sound quality and 30-hour battery life.",
    price: 33100,
    categoryName: "Electronics",
    quantity: 100,
    shipping: true,
    photo: null
  },
  {
    name: "iPad Pro 12.9-inch",
    description: "Powerful tablet with M2 chip, Liquid Retina XDR display, and support for Apple Pencil and Magic Keyboard.",
    price: 91200,
    categoryName: "Electronics",
    quantity: 40,
    shipping: true,
    photo: null
  },
  {
    name: "Diamond Engagement Ring",
    description: "Elegant 1-carat diamond solitaire ring in 14k white gold setting. Perfect for proposals and special occasions.",
    price: 249000,
    categoryName: "Jewelery",
    quantity: 15,
    shipping: true,
    photo: null
  },
  {
    name: "Gold Chain Necklace",
    description: "18k gold chain necklace, 20 inches long. Classic design suitable for everyday wear or special occasions.",
    price: 74600,
    categoryName: "Jewelery",
    quantity: 25,
    shipping: true,
    photo: null
  },
  {
    name: "Pearl Earrings Set",
    description: "Elegant freshwater pearl earrings with sterling silver posts. Comes with matching necklace.",
    price: 16500,
    categoryName: "Jewelery",
    quantity: 50,
    shipping: true,
    photo: null
  },
  {
    name: "Men's Leather Jacket",
    description: "Premium genuine leather jacket for men. Classic biker style with multiple pockets and comfortable fit.",
    price: 24800,
    categoryName: "Men's Clothing",
    quantity: 35,
    shipping: true,
    photo: null
  },
  {
    name: "Men's Casual Shirt",
    description: "100% cotton casual shirt in navy blue. Comfortable fit perfect for work or casual outings.",
    price: 4100,
    categoryName: "Men's Clothing",
    quantity: 80,
    shipping: true,
    photo: null
  },
  {
    name: "Men's Denim Jeans",
    description: "Classic fit denim jeans in dark wash. Durable construction with comfortable stretch fabric.",
    price: 6600,
    categoryName: "Men's Clothing",
    quantity: 60,
    shipping: true,
    photo: null
  },
  {
    name: "Men's Running Shoes",
    description: "High-performance running shoes with cushioned sole and breathable mesh upper. Perfect for daily workouts.",
    price: 10700,
    categoryName: "Men's Clothing",
    quantity: 45,
    shipping: true,
    photo: null
  },
  {
    name: "Women's Summer Dress",
    description: "Elegant floral summer dress made from lightweight fabric. Perfect for casual outings and summer events.",
    price: 7400,
    categoryName: "Women's Clothing",
    quantity: 55,
    shipping: true,
    photo: null
  },
  {
    name: "Women's Handbag",
    description: "Designer leather handbag with multiple compartments. Available in black, brown, and navy colors.",
    price: 16500,
    categoryName: "Women's Clothing",
    quantity: 40,
    shipping: true,
    photo: null
  },
  {
    name: "Women's High Heels",
    description: "Elegant high heel shoes in black leather. 3-inch heel height, perfect for formal occasions.",
    price: 12400,
    categoryName: "Women's Clothing",
    quantity: 30,
    shipping: true,
    photo: null
  },
  {
    name: "Women's Yoga Set",
    description: "Comfortable yoga set including leggings and sports bra. Made from moisture-wicking fabric.",
    price: 5700,
    categoryName: "Women's Clothing",
    quantity: 70,
    shipping: true,
    photo: null
  },
  {
    name: "Gaming Laptop",
    description: "High-performance gaming laptop with RTX 4070, Intel i7 processor, 16GB RAM, and 1TB SSD.",
    price: 157600,
    categoryName: "Electronics",
    quantity: 20,
    shipping: true,
    photo: null
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking and long battery life. Perfect for office work.",
    price: 3200,
    categoryName: "Electronics",
    quantity: 150,
    shipping: true,
    photo: null
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with 360-degree sound and waterproof design. 12-hour battery life.",
    price: 7400,
    categoryName: "Electronics",
    quantity: 75,
    shipping: true,
    photo: null
  },
  {
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health monitoring, GPS, and 7-day battery life. Compatible with iOS and Android.",
    price: 24800,
    categoryName: "Electronics",
    quantity: 65,
    shipping: true,
    photo: null
  }
];

const seedProducts = async () => {
  try {
    console.log('🌱 Starting product seeding...');
    
    // Get categories
    const categories = await Category.find();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Get a seller to assign products to
    const seller = await User.findOne({ role: 1 });
    if (!seller) {
      throw new Error('No seller found. Please seed users first.');
    }

    const createdProducts = [];

    for (const productData of sampleProducts) {
      // Check if product already exists
      const existingProduct = await Product.findOne({ name: productData.name });
      if (existingProduct) {
        console.log(`Product "${productData.name}" already exists, skipping...`);
        createdProducts.push(existingProduct);
        continue;
      }

      // Create product
      const product = new Product({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: categoryMap[productData.categoryName],
        quantity: productData.quantity,
        shipping: productData.shipping,
        sold: Math.floor(Math.random() * 10), // Random sold count
        seller: seller._id,
        originalPrice: productData.price,
        priceHistory: [{
          price: productData.price,
          date: new Date()
        }],
        stockHistory: [{
          quantity: productData.quantity,
          date: new Date(),
          reason: 'Initial stock'
        }]
      });

      await product.save();
      createdProducts.push(product);
      console.log(`✅ Created product: ${productData.name} - $${productData.price}`);
    }

    console.log(`🎉 Product seeding completed! Created ${createdProducts.length} products`);
    return createdProducts;

  } catch (error) {
    console.error('❌ Product seeding failed:', error);
    throw error;
  }
};

// Export for use in other files
module.exports = {
  seedProducts
};

// Run seeder if this file is executed directly
if (require.main === module) {
  const runProductSeeder = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected for product seeding');
      
      await seedProducts();
      
    } catch (error) {
      console.error('❌ Product seeder failed:', error);
    } finally {
      mongoose.connection.close();
      console.log('Database connection closed');
    }
  };

  runProductSeeder();
}
