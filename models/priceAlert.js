const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const priceAlertSchema = new mongoose.Schema(
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
    targetPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currentPrice: {
      type: Number,
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
      enum: ['price_drop', 'price_target'],
      default: 'price_drop',
    },
  },
  { timestamps: true }
);

// Index for efficient queries
priceAlertSchema.index({ user: 1, product: 1 });
priceAlertSchema.index({ isActive: 1, isTriggered: 1 });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
