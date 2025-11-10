const PriceAlert = require('../models/priceAlert');
const StockAlert = require('../models/stockAlert');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

// Create Price Alert
exports.createPriceAlert = async (req, res) => {
  try {
    const { productId, targetPrice } = req.body;
    const userId = req.profile._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user already has an active price alert for this product
    const existingAlert = await PriceAlert.findOne({
      user: userId,
      product: productId,
      isActive: true,
    });

    if (existingAlert) {
      return res.status(400).json({ error: 'Price alert already exists for this product' });
    }

    const priceAlert = new PriceAlert({
      user: userId,
      product: productId,
      targetPrice,
      currentPrice: product.price,
    });

    await priceAlert.save();
    await priceAlert.populate('product', 'name price');

    res.json(priceAlert);
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Create Stock Alert
exports.createStockAlert = async (req, res) => {
  try {
    const { productId, stockThreshold = 0 } = req.body;
    const userId = req.profile._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user already has an active stock alert for this product
    const existingAlert = await StockAlert.findOne({
      user: userId,
      product: productId,
      isActive: true,
    });

    if (existingAlert) {
      return res.status(400).json({ error: 'Stock alert already exists for this product' });
    }

    const stockAlert = new StockAlert({
      user: userId,
      product: productId,
      stockThreshold,
    });

    await stockAlert.save();
    await stockAlert.populate('product', 'name quantity');

    res.json(stockAlert);
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Get user's price alerts
exports.getUserPriceAlerts = async (req, res) => {
  try {
    const userId = req.profile._id;
    const { isActive = true } = req.query;

    const alerts = await PriceAlert.find({
      user: userId,
      isActive: isActive === 'true',
    })
      .populate('product', 'name price photo')
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Get user's stock alerts
exports.getUserStockAlerts = async (req, res) => {
  try {
    const userId = req.profile._id;
    const { isActive = true } = req.query;

    const alerts = await StockAlert.find({
      user: userId,
      isActive: isActive === 'true',
    })
      .populate('product', 'name quantity photo')
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Update price alert
exports.updatePriceAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { targetPrice, isActive } = req.body;
    const userId = req.profile._id;

    const alert = await PriceAlert.findOne({
      _id: alertId,
      user: userId,
    });

    if (!alert) {
      return res.status(404).json({ error: 'Price alert not found' });
    }

    if (targetPrice !== undefined) alert.targetPrice = targetPrice;
    if (isActive !== undefined) alert.isActive = isActive;

    await alert.save();
    await alert.populate('product', 'name price');

    res.json(alert);
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Update stock alert
exports.updateStockAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { stockThreshold, isActive } = req.body;
    const userId = req.profile._id;

    const alert = await StockAlert.findOne({
      _id: alertId,
      user: userId,
    });

    if (!alert) {
      return res.status(404).json({ error: 'Stock alert not found' });
    }

    if (stockThreshold !== undefined) alert.stockThreshold = stockThreshold;
    if (isActive !== undefined) alert.isActive = isActive;

    await alert.save();
    await alert.populate('product', 'name quantity');

    res.json(alert);
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Delete price alert
exports.deletePriceAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.profile._id;

    const alert = await PriceAlert.findOneAndDelete({
      _id: alertId,
      user: userId,
    });

    if (!alert) {
      return res.status(404).json({ error: 'Price alert not found' });
    }

    res.json({ message: 'Price alert deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Delete stock alert
exports.deleteStockAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.profile._id;

    const alert = await StockAlert.findOneAndDelete({
      _id: alertId,
      user: userId,
    });

    if (!alert) {
      return res.status(404).json({ error: 'Stock alert not found' });
    }

    res.json({ message: 'Stock alert deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};

// Get alert statistics
exports.getAlertStats = async (req, res) => {
  try {
    const userId = req.profile._id;

    const priceAlertStats = await PriceAlert.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          triggered: { $sum: { $cond: ['$isTriggered', 1, 0] } },
        },
      },
    ]);

    const stockAlertStats = await StockAlert.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          triggered: { $sum: { $cond: ['$isTriggered', 1, 0] } },
        },
      },
    ]);

    res.json({
      priceAlerts: priceAlertStats[0] || { total: 0, active: 0, triggered: 0 },
      stockAlerts: stockAlertStats[0] || { total: 0, active: 0, triggered: 0 },
    });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
  }
};
