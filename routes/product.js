const express = require('express');
const router = express.Router();

const {
  create,
  productById,
  read,
  update,
  remove,
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo,
  listSearch,
  syncFakeStoreProducts,
  updatePricesFromAPI,
  getProductStats,
  getProductsByCategory
} = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
);

router.put(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  update
);

router.get('/products', list);
router.get('/products/search', listSearch);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCategories);
router.get('/products/category/:category', getProductsByCategory);
router.post('/products/by/search', listBySearch);
router.get('/product/photo/:productId', photo);

// Fake Store API routes
router.post('/products/sync-fakestore/:userId', requireSignin, isAuth, syncFakeStoreProducts);
router.put('/products/update-prices/:userId', requireSignin, isAuth, isAdmin, updatePricesFromAPI);
router.get('/products/stats', getProductStats);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
