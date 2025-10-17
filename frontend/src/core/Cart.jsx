import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { getCart } from './cartHelpers.js';
import Card from './Card.jsx';
import Checkout from './Checkout';
import Copyright from './Copyright.jsx';
import {
  Box,
  Typography,
  Divider,
  Grid,
  Container,
  Button,
  Paper,
  Stack,
} from '@mui/material';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setItems(getCart());
  }, [run]);

  const showItems = (items) => (
    <Stack spacing={3}>
      <Typography variant='h5' textAlign='center' gutterBottom className="text-apple-gray-900 dark:text-dark-text-primary transition-colors duration-300">
        Your Cart ({items.length} {items.length === 1 ? 'Item' : 'Items'})
      </Typography>
      <Divider className="border-apple-gray-200 dark:border-dark-border" />
      {items.map((product, i) => (
        <Box key={i}>
          <Card
            product={product}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
            setRun={setRun}
            run={run}
          />
        </Box>
      ))}
    </Stack>
  );

  const noItemsMessage = () => (
    <Box textAlign='center' py={4}>
      <Typography variant='h5' gutterBottom className="text-gray-900 dark:text-white transition-colors duration-300">
        Your cart is empty
      </Typography>
      <Button
        component={Link}
        to='/shop'
        variant='contained'
        color='primary'
        size='large'
        sx={{ mt: 2 }}
      >
        Continue Shopping
      </Button>
    </Box>
  );

  return (
    <Layout
      title='Shopping Cart'
      description='Manage your cart items. Add remove checkout or continue shopping.'
    >
      {items.length > 0 ? (
        <Grid container spacing={2}>
          {/* Cart Items */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
              {showItems(items)}
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Paper
              elevation={2}
              sx={{ p: 3, position: { md: 'sticky' }, top: { md: 16 }, bgcolor: 'background.paper' }}
            >
              <Typography variant='h5' textAlign='center' gutterBottom className="text-gray-900 dark:text-white transition-colors duration-300">
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} className="border-gray-200 dark:border-gray-700" />
              <Checkout products={items} setRun={setRun} run={run} />
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Paper elevation={2} sx={{ p: 4, bgcolor: 'background.paper' }}>
            {noItemsMessage()}
          </Paper>
        </Box>
      )}
      <Copyright />
    </Layout>
  );
};

export default Cart;