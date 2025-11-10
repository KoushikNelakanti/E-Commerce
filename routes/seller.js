const express = require('express');
const router = express.Router();

const { requireSignin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');

const {
  getSellerProducts,
  updateProductPrice,
  updateProductStock,
  getProductAlertsSummary,
  getSellerDashboard,
  bulkUpdateProducts,
} = require('../controllers/seller');

// Seller Dashboard
router.get('/seller/dashboard/:userId', requireSignin, isAuth, getSellerDashboard);

// Seller Products Management
router.get('/seller/products/:userId', requireSignin, isAuth, getSellerProducts);
router.put('/seller/product/:productId/price/:userId', requireSignin, isAuth, updateProductPrice);
router.put('/seller/product/:productId/stock/:userId', requireSignin, isAuth, updateProductStock);
router.post('/seller/products/bulk-update/:userId', requireSignin, isAuth, bulkUpdateProducts);

// Product Alerts for Sellers
router.get('/seller/product/:productId/alerts/:userId', requireSignin, isAuth, getProductAlertsSummary);

// Parameter middleware
router.param('userId', userById);

module.exports = router;
