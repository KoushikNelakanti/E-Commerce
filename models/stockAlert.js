const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const stockAlertSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: ObjectId,
      ref: 'Product',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isTriggered: {
      type: Boolean,
      default: false,
    },
    triggeredAt: {
      type: Date,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    alertType: {
      type: String,
      enum: ['back_in_stock', 'low_stock'],
      default: 'back_in_stock',
    },
    stockThreshold: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
stockAlertSchema.index({ user: 1, product: 1 });
stockAlertSchema.index({ isActive: 1, isTriggered: 1 });

module.exports = mongoose.model('StockAlert', stockAlertSchema);
