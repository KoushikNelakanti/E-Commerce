import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Button from '@mui/material/Button';
import Card from './Card.jsx';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Search from './Search';
import { prices } from './fixedPrices.js';
import Copyright from './Copyright';
import { USE_FAKE_STORE_API } from '../config';

// Import both API services
import { getCategories as getLocalCategories, getFilteredProducts as getLocalFilteredProducts } from './apiCore.js';
import { getCategories as getFakeStoreCategories, getFilteredProducts as getFakeStoreFilteredProducts } from './fakeStoreApi.js';
import CategoriesFilter from './CategoriesFilter';
import PriceRangeFilter from './PriceRangeFilter';

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 20px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  },
}));

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);

  // Determine which API service to use
  const getCategoriesService = USE_FAKE_STORE_API ? getFakeStoreCategories : getLocalCategories;
  const getFilteredProductsService = USE_FAKE_STORE_API ? getFakeStoreFilteredProducts : getLocalFilteredProducts;

  const init = () => {
    getCategoriesService().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const loadFilteredResults = (newFilters) => {
    getFilteredProductsService(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    getFilteredProductsService(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <div className="text-center py-8">
          <GradientButton onClick={loadMore} variant='contained'>
            Load more
          </GradientButton>
        </div>
      )
    );
  };

  useEffect(() => {
    init();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === 'price') {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  const handlePrice = (value) => {
    const data = prices;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  return (
    <Layout
      title='Shop page'
      description='Search and find books'
      className='container-fluid'
    >
      <Search />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <div className="apple-card p-6 mb-6">
            <CategoriesFilter
              categories={categories}
              handleFilters={(filters) => handleFilters(filters, 'category')}
            />
          </div>
          <div className="apple-card p-6">
            <PriceRangeFilter
              prices={prices}
              handleFilters={(filters) => handleFilters(filters, 'price')}
            />
          </div>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Typography variant='h4' gutterBottom className="text-gray-900 dark:text-white transition-colors duration-300">
            Products
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
            {filteredResults.map((product, i) => (
              <Grid item key={i} xs={6} md={4}>
                <Card product={product} />
              </Grid>
            ))}
          </Box>
          <hr className="border-gray-200 dark:border-gray-700" />
          {loadMoreButton()}
        </Grid>
      </Grid>
      <Copyright />
    </Layout>
  );
};

export default Shop;