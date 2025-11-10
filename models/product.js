const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true,
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      required: false,
      type: Boolean,
    },
    seller: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    originalPrice: {
      type: Number,
      trim: true,
    },
    priceHistory: [{
      price: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }],
    stockHistory: [{
      quantity: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }],
    fakeStoreId: {
      type: Number,
      unique: true,
      sparse: true, // Allows null values and only enforces uniqueness for non-null values
    },
    imageUrl: {
      type: String, // For external image URLs (Fake Store API)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
