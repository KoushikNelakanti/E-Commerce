const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const { expressjwt } = require('express-jwt'); // for auth check
const { errorHandler } = require('../helpers/dbErrorHandler');
const crypto = require('crypto');
const notificationService = require('../services/notificationService');

require('dotenv').config();

exports.signup = async (req, res) => {
  const user = new User(req.body);
  try {
    const data = await user.save();
    if (!data) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user based on email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User with that email doesn't exist. Please signup.",
      });
    }

    // If user found, check if the password matches
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password didn't match",
      });
    }

    // Generate a signed token with user ID and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Persist the token as 't' in cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 9999 });

    // Return the token and user details to the frontend client
    const { _id, name, email: userEmail, role } = user;
    return res.json({ token, user: { _id, email: userEmail, name, role } });
  } catch (err) {
    return res.status(400).json({
      error: 'Signin failed. Please try again later.',
    });
  }
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Signout success' });
};

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth',
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'Access denied',
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access denied',
    });
  }
  next();
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: 'User not found with this email',
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    try {
      await notificationService.sendPasswordResetEmail(user.email, resetUrl, user.name);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully',
      });
    } catch (err) {
      console.error('Email send error:', err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        error: 'Email could not be sent',
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      error: 'Server error',
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: 'Password is required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long',
      });
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired reset token',
      });
    }

    // Set new password
    user.resetPassword(password);
    await user.save();

    // Generate new JWT token for automatic login
    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Set cookie
    res.cookie('t', jwtToken, { expire: new Date() + 9999 });

    // Return response
    const { _id, name, email, role } = user;
    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token: jwtToken,
      user: { _id, email, name, role },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      error: 'Server error',
    });
  }
};

// Change password (for logged in users)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.profile._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Check current password
    if (!user.authenticate(currentPassword)) {
      return res.status(400).json({
        error: 'Current password is incorrect',
      });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      error: 'Server error',
    });
  }
};
