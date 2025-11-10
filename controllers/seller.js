const { errorHandler } = require('../helpers/dbErrorHandler');
const Product = require('../models/product');
const PriceAlert = require('../models/priceAlert');
const StockAlert = require('../models/stockAlert');
const NotificationService = require('../services/notificationService');

// Get seller's products
exports.getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.profile._id;
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const products = await Product.find({ seller: sellerId })
      .populate('category', 'name')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments({ seller: sellerId });

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Update product price (triggers price alerts)
exports.updateProductPrice = async (req, res) => {
  try {
    const { productId } = req.params;
    const { price } = req.body;
    const sellerId = req.profile._id;

    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    const oldPrice = product.price;
    
    // Update price and add to price history
    product.price = price;
    product.priceHistory.push({ price, date: new Date() });
    
    await product.save();

    // Check and trigger price alerts if price dropped
    if (price < oldPrice) {
      const triggeredAlerts = await PriceAlert.find({
        product: productId,
        targetPrice: { $gte: price },
        isActive: true,
        isTriggered: false,
      }).populate('user').populate('product');

      // Update alerts as triggered
      await PriceAlert.updateMany(
        {
          product: productId,
          targetPrice: { $gte: price },
          isActive: true,
          isTriggered: false,
        },
        {
          $set: {
            isTriggered: true,
            triggeredAt: new Date(),
            currentPrice: price,
          },
        }
      );

      // Send email notifications
      const notificationService = new NotificationService();
      for (const alert of triggeredAlerts) {
        try {
          await notificationService.sendPriceDropNotification(alert);
          console.log(`Price alert email sent to ${alert.user.email} for product ${alert.product.name}`);
        } catch (emailError) {
          console.error(`Failed to send price alert email to ${alert.user.email}:`, emailError);
        }
      }
    }

    res.json({
      message: 'Product price updated successfully',
      product,
      priceChange: price - oldPrice,
    });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Update product stock (triggers stock alerts)
exports.updateProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const sellerId = req.profile._id;

    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    const oldQuantity = product.quantity;
    
    // Update quantity and add to stock history
    product.quantity = quantity;
    product.stockHistory.push({ quantity, date: new Date() });
    
    await product.save();

    // Check and trigger stock alerts if item is back in stock
    if (oldQuantity === 0 && quantity > 0) {
      const triggeredStockAlerts = await StockAlert.find({
        product: productId,
        isActive: true,
        isTriggered: false,
      }).populate('user').populate('product');

      // Update alerts as triggered
      await StockAlert.updateMany(
        {
          product: productId,
          isActive: true,
          isTriggered: false,
        },
        {
          $set: {
            isTriggered: true,
            triggeredAt: new Date(),
          },
        }
      );

      // Send email notifications
      const notificationService = new NotificationService();
      for (const alert of triggeredStockAlerts) {
        try {
          await notificationService.sendBackInStockNotification(alert);
          console.log(`Stock alert email sent to ${alert.user.email} for product ${alert.product.name}`);
        } catch (emailError) {
          console.error(`Failed to send stock alert email to ${alert.user.email}:`, emailError);
        }
      }
    }

    res.json({
      message: 'Product stock updated successfully',
      product,
      stockChange: quantity - oldQuantity,
    });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Get product alerts summary for seller
exports.getProductAlertsSummary = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.profile._id;

    // Verify seller owns the product
    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    const priceAlerts = await PriceAlert.countDocuments({
      product: productId,
      isActive: true,
    });

    const stockAlerts = await StockAlert.countDocuments({
      product: productId,
      isActive: true,
    });

    const triggeredPriceAlerts = await PriceAlert.countDocuments({
      product: productId,
      isTriggered: true,
      notificationSent: false,
    });

    const triggeredStockAlerts = await StockAlert.countDocuments({
      product: productId,
      isTriggered: true,
      notificationSent: false,
    });

    res.json({
      productId,
      productName: product.name,
      activeAlerts: {
        price: priceAlerts,
        stock: stockAlerts,
      },
      pendingNotifications: {
        price: triggeredPriceAlerts,
        stock: triggeredStockAlerts,
      },
    });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Get seller dashboard statistics
exports.getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.profile._id;

    // Get product count
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // Get products with active alerts
    const productsWithAlerts = await Product.aggregate([
      { $match: { seller: sellerId } },
      {
        $lookup: {
          from: 'pricealerts',
          localField: '_id',
          foreignField: 'product',
          as: 'priceAlerts',
        },
      },
      {
        $lookup: {
          from: 'stockalerts',
          localField: '_id',
          foreignField: 'product',
          as: 'stockAlerts',
        },
      },
      {
        $addFields: {
          totalAlerts: {
            $add: [
              { $size: '$priceAlerts' },
              { $size: '$stockAlerts' },
            ],
          },
        },
      },
      { $match: { totalAlerts: { $gt: 0 } } },
      { $count: 'count' },
    ]);

    // Get low stock products
    const lowStockProducts = await Product.countDocuments({
      seller: sellerId,
      quantity: { $lte: 5, $gt: 0 },
    });

    // Get out of stock products
    const outOfStockProducts = await Product.countDocuments({
      seller: sellerId,
      quantity: 0,
    });

    res.json({
      totalProducts,
      productsWithAlerts: productsWithAlerts[0]?.count || 0,
      lowStockProducts,
      outOfStockProducts,
    });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Bulk update products
exports.bulkUpdateProducts = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { productId, price?, quantity? }
    const sellerId = req.profile._id;

    const results = [];

    for (const update of updates) {
      try {
        const product = await Product.findOne({
          _id: update.productId,
          seller: sellerId,
        });

        if (!product) {
          results.push({
            productId: update.productId,
            success: false,
            error: 'Product not found or unauthorized',
          });
          continue;
        }

        let updated = false;

        if (update.price !== undefined) {
          const oldPrice = product.price;
          product.price = update.price;
          product.priceHistory.push({ price: update.price, date: new Date() });
          
          // Trigger price alerts if price dropped
          if (update.price < oldPrice) {
            await PriceAlert.updateMany(
              {
                product: update.productId,
                targetPrice: { $gte: update.price },
                isActive: true,
                isTriggered: false,
              },
              {
                $set: {
                  isTriggered: true,
                  triggeredAt: new Date(),
                  currentPrice: update.price,
                },
              }
            );
          }
          updated = true;
        }

        if (update.quantity !== undefined) {
          const oldQuantity = product.quantity;
          product.quantity = update.quantity;
          product.stockHistory.push({ quantity: update.quantity, date: new Date() });
          
          // Trigger stock alerts if back in stock
          if (oldQuantity === 0 && update.quantity > 0) {
            await StockAlert.updateMany(
              {
                product: update.productId,
                isActive: true,
                isTriggered: false,
              },
              {
                $set: {
                  isTriggered: true,
                  triggeredAt: new Date(),
                },
              }
            );
          }
          updated = true;
        }

        if (updated) {
          await product.save();
        }

        results.push({
          productId: update.productId,
          success: true,
          product: {
            name: product.name,
            price: product.price,
            quantity: product.quantity,
          },
        });
      } catch (err) {
        results.push({
          productId: update.productId,
          success: false,
          error: err.message,
        });
      }
    }

    res.json({
      message: 'Bulk update completed',
      results,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};
