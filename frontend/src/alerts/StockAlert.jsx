import React, { useState } from 'react';
import { createStockAlert } from './apiAlerts';
import { isAuthenticated } from '../auth';
import {
  Button,
  Alert,
  Box,
  Typography,
  Link
} from '@mui/material';
import { Inventory } from '@mui/icons-material';

const StockAlert = ({ product, onAlertCreated }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { user, token } = isAuthenticated();

  const handleCreateAlert = () => {
    if (!user) {
      setMessage('Please sign in to set stock alerts');
      return;
    }

    setLoading(true);
    setMessage('');

    const alertData = {
      productId: product._id,
      stockThreshold: 0, // Alert when quantity > 0
    };

    createStockAlert(user._id, token, alertData)
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage('Stock alert created successfully!');
          if (onAlertCreated) {
            onAlertCreated(data);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setMessage('Failed to create stock alert');
        setLoading(false);
      });
  };

  if (!user) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        <Typography variant="body2">
          Please <Link href="/signin">sign in</Link> to set stock alerts
        </Typography>
      </Alert>
    );
  }

  // Only show stock alert for out of stock products
  if (product.quantity > 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Alert severity="warning" sx={{ mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Out of Stock
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          This item is currently unavailable
        </Typography>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<Inventory />}
          onClick={handleCreateAlert}
          disabled={loading}
        >
          {loading ? 'Setting up...' : 'Notify When Available'}
        </Button>
      </Alert>

      {message && (
        <Alert 
          severity={message.includes('successfully') ? 'success' : 'error'}
          sx={{ mt: 1 }}
        >
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default StockAlert;
