import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts } from './apiCore.js';
import Card from './Card.jsx';
import Search from './Search';
import Copyright from './Copyright.jsx';
import { Box, Container, Typography } from '@mui/material';

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState([]);

  const loadProductsBySell = () => {
    getProducts('sold').then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        // Ensure data is an array
        setProductsBySell(Array.isArray(data) ? data : []);
      }
    }).catch((err) => {
      console.error('Error loading products by sell:', err);
      setProductsBySell([]);
    });
  };

  const loadProductsByArrival = () => {
    getProducts('createdAt').then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        // Ensure data is an array
        setProductsByArrival(Array.isArray(data) ? data : []);
      }
    }).catch((err) => {
      console.error('Error loading products by arrival:', err);
      setProductsByArrival([]);
    });
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);

  return (
    <Layout
      title='Home page'
      description='MERN E-commerce App'
      className='container-fluid'
    >
      <Search />
      <Container maxWidth='lg'>
        <Box sx={{ my: 4 }}>
          <Typography variant='h4' gutterBottom>
            New Arrivals
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 4,
            }}
          >
            {Array.isArray(productsByArrival) && productsByArrival.length > 0 ? (
              productsByArrival.map((product, i) => (
                <Card key={i} product={product} />
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No new arrivals available at the moment.
              </Typography>
            )}
          </Box>

          <Typography variant='h4' gutterBottom>
            Best Sellers
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {Array.isArray(productsBySell) && productsBySell.length > 0 ? (
              productsBySell.map((product, i) => (
                <Card key={i} product={product} />
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No best sellers available at the moment.
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
      <Copyright />
    </Layout>
  );
};

export default Home;
