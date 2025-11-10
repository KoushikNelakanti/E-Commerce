const express = require('express');
const router = express.Router();
const { 
  signup, 
  signin, 
  signout, 
  forgotPassword, 
  resetPassword, 
  changePassword,
  requireSignin,
  isAuth
} = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { userSignupValidator } = require('../validator');

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/change-password/:userId', requireSignin, isAuth, changePassword);

// Parameter middleware
router.param('userId', userById);

module.exports = router;
