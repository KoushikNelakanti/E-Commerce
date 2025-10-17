import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Eye, 
  Trash2, 
  Plus, 
  Minus,
  Check,
  X
} from 'lucide-react';

import { addItem, updateItem, removeItem } from './cartHelpers';

// Custom notification component
const Notification = ({ message, isVisible, onClose, type = 'success' }) => {
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
        type === 'success' 
          ? 'bg-green-500/90 text-white' 
          : 'bg-red-500/90 text-white'
      }`}
    >
      <div className="flex items-center space-x-2">
        {type === 'success' ? (
          <Check className="h-5 w-5" />
        ) : (
          <X className="h-5 w-5" />
        )}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = (f) => f,
  run = undefined,
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count || 1);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Handle different product data structures (local vs Fake Store API)
  const productName = product.name || product.title || 'Product';
  const productDescription = product.description || 'No description available';
  const productPrice = product.price || 0;
  const productQuantity = product.quantity || product.rating?.count || 10;
  const productCategory = product.category?.name || product.category || 'Uncategorized';
  const productCreatedAt = product.createdAt || new Date().toISOString();

  const addToCart = () => {
    addItem(product, () => {
      setNotificationMessage(`${productName} added to cart!`);
      setShowNotification(true);
      setRun(!run);
      setTimeout(() => setShowNotification(false), 3000);
    });
  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Navigate to='/cart' />;
    }
  };

  const handleQuantityChange = (newCount) => {
    const validCount = Math.max(1, Math.min(newCount, productQuantity));
    setCount(validCount);
    updateItem(product._id || product.id, validCount);
    setRun(!run);
    setNotificationMessage('Quantity updated!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleRemove = () => {
    removeItem(product._id || product.id);
    setRun(!run);
    setNotificationMessage(`${productName} removed from cart!`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <>
      {shouldRedirect(redirect)}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="apple-card group cursor-pointer h-full flex flex-col overflow-hidden"
      >
        {/* Product Image */}
        <div className="relative overflow-hidden bg-apple-gray-50 dark:bg-dark-surface-secondary aspect-square">
          <ShowImage item={product} url='product' />
          
          {/* Hover overlay with actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/20 dark:bg-black/30 flex items-center justify-center space-x-3"
          >
            {showViewProductButton && (
              <motion.a
                href={`/product/${product._id || product.id}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="apple-button-secondary flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </motion.a>
            )}
            
            {showAddToCartButton && productQuantity > 0 && (
              <motion.button
                onClick={addToCart}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="apple-button-primary flex items-center space-x-2"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Cart</span>
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-dark-text-primary line-clamp-2 flex-1 transition-colors duration-300">
              {productName}
            </h3>
            <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
              productQuantity > 0 
                ? 'bg-green-100 dark:bg-dark-green/20 text-green-800 dark:text-dark-green' 
                : 'bg-red-100 dark:bg-dark-red/20 text-red-800 dark:text-dark-red'
            }`}>
              {productQuantity > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>

          <p className="text-apple-gray-600 dark:text-dark-text-tertiary text-sm mb-4 line-clamp-3 flex-1 transition-colors duration-300">
            {productDescription}
          </p>

          <div className="space-y-3 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-apple-gray-900 dark:text-dark-text-primary transition-colors duration-300">
                ${productPrice}
              </span>
              <span className="text-sm text-apple-gray-500 dark:text-dark-text-tertiary transition-colors duration-300">
                {productCategory}
              </span>
            </div>

            {/* Cart Update Options */}
            {cartUpdate && (
              <div className="flex items-center justify-between p-3 bg-apple-gray-50 dark:bg-dark-surface-secondary rounded-xl transition-colors duration-300">
                <span className="text-sm font-medium text-apple-gray-700 dark:text-dark-text-secondary transition-colors duration-300">Quantity:</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(count - 1)}
                    disabled={count <= 1}
                    className="p-1 rounded-full hover:bg-apple-gray-200 dark:hover:bg-dark-surface-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    <Minus className="h-4 w-4 text-apple-gray-600 dark:text-dark-text-secondary" />
                  </button>
                  <span className="w-8 text-center font-medium text-apple-gray-900 dark:text-dark-text-primary transition-colors duration-300">{count}</span>
                  <button
                    onClick={() => handleQuantityChange(count + 1)}
                    disabled={count >= productQuantity}
                    className="p-1 rounded-full hover:bg-apple-gray-200 dark:hover:bg-dark-surface-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    <Plus className="h-4 w-4 text-apple-gray-600 dark:text-dark-text-secondary" />
                  </button>
                </div>
              </div>
            )}

            {/* Remove Button */}
            {showRemoveProductButton && (
              <button
                onClick={handleRemove}
                className="w-full flex items-center justify-center space-x-2 py-3 text-red-600 dark:text-dark-red hover:bg-red-50 dark:hover:bg-dark-red/10 rounded-xl transition-colors duration-300"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove from Cart</span>
              </button>
            )}

            <div className="text-xs text-apple-gray-500 dark:text-dark-text-quaternary text-center transition-colors duration-300">
              Added {moment(productCreatedAt).fromNow()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Custom Notification */}
      <Notification
        message={notificationMessage}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
};

export default Card;