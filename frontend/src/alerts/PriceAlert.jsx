import React, { useState } from 'react';
import { createPriceAlert } from './apiAlerts';
import { isAuthenticated } from '../auth';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Alert,
  Box,
  Typography,
  Link
} from '@mui/material';
import { NotificationsActive } from '@mui/icons-material';

const PriceAlert = ({ product, onAlertCreated }) => {
  const [targetPrice, setTargetPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { user, token } = isAuthenticated();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!targetPrice || parseFloat(targetPrice) <= 0) {
      setMessage('Please enter a valid target price');
      return;
    }

    if (parseFloat(targetPrice) >= product.price) {
      setMessage('Target price should be lower than current price');
      return;
    }

    setLoading(true);
    setMessage('');

    const alertData = {
      productId: product._id,
      targetPrice: parseFloat(targetPrice),
    };

    createPriceAlert(user._id, token, alertData)
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage('Price alert created successfully!');
          setTargetPrice('');
          setShowForm(false);
          if (onAlertCreated) {
            onAlertCreated(data);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setMessage('Failed to create price alert');
        setLoading(false);
      });
  };

  if (!user) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        <Typography variant="body2">
          Please <Link href="/signin">sign in</Link> to set price alerts
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      {!showForm ? (
        <Button
          variant="outlined"
          size="small"
          startIcon={<NotificationsActive />}
          onClick={() => setShowForm(true)}
          sx={{ mb: 1 }}
        >
          Set Price Alert
        </Button>
      ) : (
        <Card sx={{ mt: 1 }}>
          <CardHeader 
            title={`Set Price Alert for ${product.name}`}
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Current Price: <strong>${product.price}</strong>
              </Typography>
              
              <TextField
                type="number"
                inputProps={{ step: "0.01" }}
                fullWidth
                size="small"
                label="Target Price"
                placeholder="Enter target price"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                required
                helperText="You'll be notified when the price drops to or below this amount"
                sx={{ mb: 2 }}
              />

              {message && (
                <Alert 
                  severity={message.includes('successfully') ? 'success' : 'error'}
                  sx={{ mb: 2 }}
                >
                  {message}
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Alert'}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setShowForm(false);
                    setMessage('');
                    setTargetPrice('');
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PriceAlert;
