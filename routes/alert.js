const express = require('express');
const router = express.Router();

const { requireSignin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');

const {
  createPriceAlert,
  createStockAlert,
  getUserPriceAlerts,
  getUserStockAlerts,
  updatePriceAlert,
  updateStockAlert,
  deletePriceAlert,
  deleteStockAlert,
  getAlertStats,
} = require('../controllers/alert');

// Price Alert Routes
router.post('/alert/price/:userId', requireSignin, isAuth, createPriceAlert);
router.get('/alerts/price/:userId', requireSignin, isAuth, getUserPriceAlerts);
router.put('/alert/price/:alertId/:userId', requireSignin, isAuth, updatePriceAlert);
router.delete('/alert/price/:alertId/:userId', requireSignin, isAuth, deletePriceAlert);

// Stock Alert Routes
router.post('/alert/stock/:userId', requireSignin, isAuth, createStockAlert);
router.get('/alerts/stock/:userId', requireSignin, isAuth, getUserStockAlerts);
router.put('/alert/stock/:alertId/:userId', requireSignin, isAuth, updateStockAlert);
router.delete('/alert/stock/:alertId/:userId', requireSignin, isAuth, deleteStockAlert);

// Alert Statistics
router.get('/alerts/stats/:userId', requireSignin, isAuth, getAlertStats);

// Parameter middleware
router.param('userId', userById);

module.exports = router;
