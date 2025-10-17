import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, ChevronDown } from 'lucide-react';
import Card from './Card';
import { USE_FAKE_STORE_API } from '../config';

// Import both API services
import { getCategories as getLocalCategories, list as listLocal } from './apiCore';
import { getCategories as getFakeStoreCategories, list as listFakeStore } from './fakeStoreApi';

const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: '',
    search: '',
    results: [],
    searched: false,
  });

  const { categories, category, search, results, searched } = data;

  // Determine which API service to use
  const getCategoriesService = USE_FAKE_STORE_API ? getFakeStoreCategories : getLocalCategories;
  const listService = USE_FAKE_STORE_API ? listFakeStore : listLocal;

  const loadCategories = () => {
    getCategoriesService().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData((prevData) => ({ ...prevData, categories: data }));
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const searchData = () => {
    if (search) {
      listService({ search: search || undefined, category: category }).then(
        (response) => {
          if (response.error) {
            console.log(response.error);
          } else {
            setData((prevData) => ({
              ...prevData,
              results: response,
              searched: true,
            }));
          }
        }
      );
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  const handleChange = (name) => (event) => {
    setData((prevData) => ({
      ...prevData,
      [name]: event.target.value,
      searched: false,
    }));
  };

  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} products`;
    }
    if (searched && results.length < 1) {
      return `No products found`;
    }
    return '';
  };

  const searchedProducts = (results = []) => {
    return (
      <div className="mt-8">
        {searched && (
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-apple-gray-900">
              {searchMessage(searched, results)}
            </h3>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product, i) => (
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
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.form
        onSubmit={searchSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-apple-gray-200 p-6 mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Category Dropdown */}
          <div className="relative w-full sm:w-48">
            <select
              value={category}
              onChange={handleChange('category')}
              className="w-full appearance-none bg-apple-gray-50 border border-apple-gray-200 rounded-xl px-4 py-3 pr-10 text-apple-gray-900 focus:outline-none focus:ring-2 focus:ring-apple-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((c, i) => (
                <option key={i} value={c.name || c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-apple-gray-400 pointer-events-none" />
          </div>

          {/* Search Input */}
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-apple-gray-400 dark:text-dark-text-tertiary" />
            <input
              type="search"
              value={data.search}
              onChange={handleChange('search')}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-apple-gray-50 dark:bg-dark-surface-secondary border border-apple-gray-200 dark:border-dark-border rounded-xl text-apple-gray-900 dark:text-dark-text-primary placeholder-apple-gray-500 dark:placeholder-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-apple-blue-500 dark:focus:ring-dark-blue-500 focus:border-transparent transition-colors duration-300"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="apple-button-primary w-full sm:w-auto px-8 py-3"
          >
            Search
          </button>
        </div>
      </motion.form>

      {searchedProducts(results)}
    </div>
  );
};

export default Search;