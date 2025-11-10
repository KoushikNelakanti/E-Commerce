const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fakeStoreService = require('../services/fakeStoreService');

// Get product by ID middleware
exports.productById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id).populate('category').exec();
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }
    req.product = product;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Product not found' });
  }
};

// Read product details
exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

// Create a new product
exports.create = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Image could not be uploaded' });
    }

    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res
          .status(400)
          .json({ error: 'Image should be less than 1MB in size' });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    try {
      const result = await product.save();
      res.json(result);
    } catch (error) {
      return res.status(400).json({ error: errorHandler(error) });
    }
  });
};

// Delete a product
exports.remove = async (req, res) => {
  try {
    let product = req.product;
    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Update a product
exports.update = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Image could not be uploaded' });
    }

    let product = req.product;
    product = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res
          .status(400)
          .json({ error: 'Image should be less than 1MB in size' });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    try {
      const result = await product.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({ error: errorHandler(err) });
    }
  });
};

// List products with filters and pagination (Enhanced with Fake Store API)
exports.list = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 12,
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search,
      sortBy: req.query.sortBy || 'createdAt',
      order: req.query.order || 'desc'
    };

    const result = await fakeStoreService.getProducts(options);
    
    // Format products for frontend (handle both local and external images)
    const formattedProducts = result.products.map(product => {
      const productObj = product.toObject();
      // Remove photo data for performance, keep imageUrl for external images
      delete productObj.photo;
      return productObj;
    });

    res.json({
      ...result,
      products: formattedProducts
    });
  } catch (error) {
    console.error('Error listing products:', error);
    return res.status(400).json({ error: 'Products not found' });
  }
};

// List related products based on category
exports.listRelated = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 6;

  try {
    const products = await Product.find({
      _id: { $ne: req.product._id },
      category: req.product.category,
    })
      .limit(limit)
      .populate('category', '_id name')
      .exec();
    res.json(products);
  } catch (error) {
    return res.status(400).json({ error: 'Products not found' });
  }
};

// List categories used in products
exports.listCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', {}).exec();
    res.json(categories);
  } catch (error) {
    return res.status(400).json({ error: 'Categories not found' });
  }
};

// List products by search
exports.listBySearch = async (req, res) => {
  const order = req.body.order || 'desc';
  const sortBy = req.body.sortBy || '_id';
  const limit = req.body.limit ? parseInt(req.body.limit) : 100;
  const skip = parseInt(req.body.skip);
  const findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  try {
    const products = await Product.find(findArgs)
      .select('-photo')
      .populate('category')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec();
    res.json({ size: products.length, data: products });
  } catch (error) {
    return res.status(400).json({ error: 'Products not found' });
  }
};

// Product photo handler
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// List products by search (query-based)
exports.listSearch = async (req, res) => {
  const query = {};

  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };

    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    try {
      const products = await Product.find(query).select('-photo').exec();
      res.json(products);
    } catch (error) {
      return res.status(400).json({ error: errorHandler(error) });
    }
  }
};

// Decrease product quantity after purchase
exports.decreaseQuantity = async (req, res, next) => {
  const bulkOps = req.body.order.products.map((item) => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $inc: { quantity: -item.count, sold: +item.count } },
    },
  }));

  try {
    await Product.bulkWrite(bulkOps, {});
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Could not update product' });
  }
};

// Sync products from Fake Store API
exports.syncFakeStoreProducts = async (req, res) => {
  try {
    const sellerId = req.profile._id;
    
    // Check if user is admin or seller
    if (req.profile.role === 0) {
      return res.status(403).json({
        error: 'Access denied. Only sellers and admins can sync products.'
      });
    }

    console.log(`Starting Fake Store API sync for seller: ${req.profile.name}`);
    
    const syncedProducts = await fakeStoreService.syncProductsToDatabase(sellerId);
    
    res.json({
      success: true,
      message: `Successfully synced ${syncedProducts.length} products from Fake Store API`,
      syncedCount: syncedProducts.length,
      products: syncedProducts.map(p => ({
        id: p._id,
        name: p.name,
        price: p.price,
        category: p.category
      }))
    });
  } catch (error) {
    console.error('Error syncing Fake Store products:', error);
    return res.status(500).json({
      error: 'Failed to sync products from Fake Store API'
    });
  }
};

// Update prices from Fake Store API
exports.updatePricesFromAPI = async (req, res) => {
  try {
    // Check if user is admin
    if (req.profile.role !== 2) {
      return res.status(403).json({
        error: 'Access denied. Only admins can update prices from API.'
      });
    }

    const updatedCount = await fakeStoreService.updatePricesFromAPI();
    
    res.json({
      success: true,
      message: `Successfully updated prices for ${updatedCount} products`,
      updatedCount
    });
  } catch (error) {
    console.error('Error updating prices from API:', error);
    return res.status(500).json({
      error: 'Failed to update prices from Fake Store API'
    });
  }
};

// Get product statistics
exports.getProductStats = async (req, res) => {
  try {
    const stats = await fakeStoreService.getProductStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting product stats:', error);
    return res.status(500).json({
      error: 'Failed to get product statistics'
    });
  }
};

// Get products by category (enhanced)
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 12,
      category: category,
      sortBy: req.query.sortBy || 'createdAt',
      order: req.query.order || 'desc'
    };

    const result = await fakeStoreService.getProducts(options);
    
    // Format products for frontend
    const formattedProducts = result.products.map(product => {
      const productObj = product.toObject();
      delete productObj.photo;
      return productObj;
    });

    res.json({
      ...result,
      products: formattedProducts,
      category
    });
  } catch (error) {
    console.error('Error getting products by category:', error);
    return res.status(400).json({ error: 'Products not found for this category' });
  }
};
