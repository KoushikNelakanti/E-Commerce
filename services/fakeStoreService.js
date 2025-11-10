const axios = require('axios');
const Product = require('../models/product');
const Category = require('../models/category');

class FakeStoreService {
  constructor() {
    this.baseURL = 'https://fakestoreapi.com';
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  // Fetch all products from Fake Store API
  async fetchAllProducts() {
    try {
      const response = await this.axiosInstance.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products from Fake Store API:', error);
      throw error;
    }
  }

  // Fetch single product from Fake Store API
  async fetchProductById(id) {
    try {
      const response = await this.axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id} from Fake Store API:`, error);
      throw error;
    }
  }

  // Fetch all categories from Fake Store API
  async fetchAllCategories() {
    try {
      const response = await this.axiosInstance.get('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories from Fake Store API:', error);
      throw error;
    }
  }

  // Fetch products by category from Fake Store API
  async fetchProductsByCategory(category) {
    try {
      const response = await this.axiosInstance.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  }

  // Map Fake Store API category to our database category
  async mapCategoryToDatabase(fakeStoreCategory) {
    try {
      // Normalize category names
      const categoryMap = {
        'electronics': 'Electronics',
        'jewelery': 'Jewelery',
        "men's clothing": "Men's Clothing",
        "women's clothing": "Women's Clothing"
      };

      const normalizedName = categoryMap[fakeStoreCategory.toLowerCase()] || fakeStoreCategory;
      
      let category = await Category.findOne({ name: normalizedName });
      
      if (!category) {
        category = new Category({
          name: normalizedName,
          description: `${normalizedName} products from Fake Store API`
        });
        await category.save();
      }
      
      return category;
    } catch (error) {
      console.error('Error mapping category to database:', error);
      throw error;
    }
  }

  // Convert Fake Store API product to our database format
  async convertToLocalProduct(fakeStoreProduct, sellerId) {
    try {
      const category = await this.mapCategoryToDatabase(fakeStoreProduct.category);
      
      return {
        name: fakeStoreProduct.title,
        description: fakeStoreProduct.description,
        price: parseFloat(fakeStoreProduct.price),
        originalPrice: parseFloat(fakeStoreProduct.price),
        category: category._id,
        quantity: Math.floor(Math.random() * 100) + 10, // Random stock between 10-109
        sold: Math.floor(Math.random() * 50), // Random sold count
        seller: sellerId,
        shipping: true,
        fakeStoreId: fakeStoreProduct.id, // Keep reference to original
        photo: {
          data: null, // We'll store the URL instead for external images
          contentType: 'image/jpeg'
        },
        imageUrl: fakeStoreProduct.image, // Store external image URL
        priceHistory: [{
          price: parseFloat(fakeStoreProduct.price),
          date: new Date()
        }],
        stockHistory: [{
          quantity: Math.floor(Math.random() * 100) + 10,
          date: new Date()
        }]
      };
    } catch (error) {
      console.error('Error converting Fake Store product:', error);
      throw error;
    }
  }

  // Sync products from Fake Store API to local database
  async syncProductsToDatabase(sellerId) {
    try {
      console.log('🔄 Starting Fake Store API sync...');
      
      const fakeStoreProducts = await this.fetchAllProducts();
      const syncedProducts = [];
      
      for (const fakeProduct of fakeStoreProducts) {
        // Check if product already exists
        const existingProduct = await Product.findOne({ fakeStoreId: fakeProduct.id });
        
        if (existingProduct) {
          console.log(`Product "${fakeProduct.title}" already exists, skipping...`);
          syncedProducts.push(existingProduct);
          continue;
        }
        
        // Convert and save new product
        const localProductData = await this.convertToLocalProduct(fakeProduct, sellerId);
        const localProduct = new Product(localProductData);
        await localProduct.save();
        
        syncedProducts.push(localProduct);
        console.log(`✅ Synced: ${fakeProduct.title}`);
      }
      
      console.log(`🎉 Sync completed! ${syncedProducts.length} products processed.`);
      return syncedProducts;
    } catch (error) {
      console.error('Error syncing products to database:', error);
      throw error;
    }
  }

  // Get products with pagination and filtering (hybrid approach)
  async getProducts(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        minPrice,
        maxPrice,
        search,
        sortBy = 'createdAt',
        order = 'desc'
      } = options;

      let query = {};

      // Category filter
      if (category) {
        const categoryDoc = await Category.findOne({ name: new RegExp(category, 'i') });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        }
      }

      // Price range filter
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      // Search filter
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') }
        ];
      }

      const products = await Product.find(query)
        .populate('category', 'name')
        .populate('seller', 'name email')
        .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Product.countDocuments(query);

      return {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      };
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  // Update product prices from Fake Store API (for price tracking)
  async updatePricesFromAPI() {
    try {
      console.log('🔄 Updating prices from Fake Store API...');
      
      const localProducts = await Product.find({ fakeStoreId: { $exists: true } });
      const fakeStoreProducts = await this.fetchAllProducts();
      
      let updatedCount = 0;
      
      for (const localProduct of localProducts) {
        const fakeProduct = fakeStoreProducts.find(fp => fp.id === localProduct.fakeStoreId);
        
        if (fakeProduct && fakeProduct.price !== localProduct.price) {
          const oldPrice = localProduct.price;
          localProduct.price = parseFloat(fakeProduct.price);
          
          // Add to price history
          localProduct.priceHistory.push({
            price: parseFloat(fakeProduct.price),
            date: new Date()
          });
          
          await localProduct.save();
          updatedCount++;
          
          console.log(`💰 Updated price for "${localProduct.name}": $${oldPrice} → $${fakeProduct.price}`);
        }
      }
      
      console.log(`✅ Price update completed! ${updatedCount} products updated.`);
      return updatedCount;
    } catch (error) {
      console.error('Error updating prices from API:', error);
      throw error;
    }
  }

  // Get product statistics
  async getProductStats() {
    try {
      const totalProducts = await Product.countDocuments();
      const fakeStoreProducts = await Product.countDocuments({ fakeStoreId: { $exists: true } });
      const categories = await Category.countDocuments();
      
      const priceRange = await Product.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
            avgPrice: { $avg: '$price' }
          }
        }
      ]);
      
      return {
        totalProducts,
        fakeStoreProducts,
        localProducts: totalProducts - fakeStoreProducts,
        categories,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 }
      };
    } catch (error) {
      console.error('Error getting product stats:', error);
      throw error;
    }
  }
}

module.exports = new FakeStoreService();
