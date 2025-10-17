import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Card from './Card.jsx';
import Search from './Search';
import Copyright from './Copyright.jsx';
import { motion } from 'framer-motion';
import HeroCarousel from '../components/HeroCarousel.jsx';
import { USE_FAKE_STORE_API } from '../config';

// Import both API services
import { getProducts as getLocalProducts } from './apiCore.js';
import { getProducts as getFakeStoreProducts } from './fakeStoreApi.js';

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState([]);

  // Determine which API service to use
  const getProductsService = USE_FAKE_STORE_API ? getFakeStoreProducts : getLocalProducts;

  const loadProductsBySell = () => {
    getProductsService('sold').then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsBySell(data);
      }
    });
  };

  const loadProductsByArrival = () => {
    getProductsService('createdAt').then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);

  return (
    <Layout
      title='Discover Amazing Products'
      description='Experience premium quality and exceptional design in every product we offer'
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <HeroCarousel />

        {/* Search Section */}
        <div>
          <Search />
        </div>

        {/* New Arrivals Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="section-title">
              New Arrivals
            </h2>
            <p className="section-description mt-4 max-w-2xl mx-auto">
              Discover our latest collection of carefully curated products
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsByArrival.map((product, i) => (
              <motion.div
                key={product._id || product.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card product={product} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Best Sellers Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="section-title">
              Best Sellers
            </h2>
            <p className="section-description mt-4 max-w-2xl mx-auto">
              Our most popular products loved by customers worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsBySell.map((product, i) => (
              <motion.div
                key={product._id || product.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card product={product} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
      
      <Copyright />
    </Layout>
  );
};

export default Home;