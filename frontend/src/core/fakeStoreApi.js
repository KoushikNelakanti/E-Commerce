import queryString from 'query-string';

// Fake Store API base URL
const FAKE_STORE_API = 'https://fakestoreapi.com';

// Get all products
export const getProducts = (sortBy = 'createdAt') => {
  return fetch(`${FAKE_STORE_API}/products`)
    .then((response) => {
      return response.json();
    })
    .then((products) => {
      // Sort products based on sortBy parameter
      if (sortBy === 'sold') {
        // For "Best Sellers", we'll sort by rating (descending)
        return products.sort((a, b) => b.rating.rate - a.rating.rate);
      } else {
        // For "New Arrivals", we'll sort by ID (descending, assuming higher IDs are newer)
        return products.sort((a, b) => b.id - a.id);
      }
    })
    .then((products) => {
      // Return only first 6 products to match original behavior
      return products.slice(0, 6);
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};

// Get all categories
export const getCategories = () => {
  return fetch(`${FAKE_STORE_API}/products/categories`)
    .then((response) => {
      return response.json();
    })
    .then((categories) => {
      // Transform categories to match existing data structure
      return categories.map((category, index) => ({
        _id: index + 1,
        name: category,
      }));
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};

// Get filtered products (for shop page)
export const getFilteredProducts = (skip, limit, filters = {}) => {
  return fetch(`${FAKE_STORE_API}/products`)
    .then((response) => response.json())
    .then((products) => {
      // Apply category filter
      if (filters.category && filters.category.length > 0) {
        products = products.filter((product) =>
          filters.category.includes(product.category)
        );
      }

      // Apply price filter
      if (filters.price && filters.price.length === 2) {
        const [min, max] = filters.price;
        products = products.filter(
          (product) => product.price >= min && product.price <= max
        );
      }

      // Calculate total size before pagination
      const size = products.length;

      // Apply pagination
      products = products.slice(skip, skip + limit);

      return {
        data: products,
        size: size,
      };
    })
    .catch((err) => {
      console.log(err);
      return {
        data: [],
        size: 0,
      };
    });
};

// Search products
export const list = (params) => {
  const query = queryString.stringify(params);
  console.log('query', query);
  
  return fetch(`${FAKE_STORE_API}/products`)
    .then((response) => response.json())
    .then((products) => {
      // Apply search filter if search term exists
      if (params.search) {
        products = products.filter(
          (product) =>
            product.title.toLowerCase().includes(params.search.toLowerCase()) ||
            product.description.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      // Apply category filter if category exists
      if (params.category) {
        products = products.filter(
          (product) => product.category === params.category
        );
      }
      
      return products;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};

// Get a single product by ID
export const read = (productId) => {
  return fetch(`${FAKE_STORE_API}/products/${productId}`)
    .then((response) => {
      return response.json();
    })
    .then((product) => {
      // Transform product structure to match existing format
      return {
        ...product,
        _id: product.id,
        name: product.title,
        createdAt: new Date().toISOString(), // Adding a default date
      };
    })
    .catch((err) => {
      console.log(err);
      return {};
    });
};

// Get related products
export const listRelated = (productId) => {
  return fetch(`${FAKE_STORE_API}/products/category/${productId}?limit=3`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      // If related products API fails, get random products instead
      return fetch(`${FAKE_STORE_API}/products?limit=3`)
        .then((response) => response.json())
        .catch((err2) => {
          console.log(err, err2);
          return [];
        });
    });
};

// These functions are kept for compatibility but won't work with Fake Store API
export const getBraintreeClientToken = (userId, token) => {
  // Not applicable to Fake Store API
  return Promise.reject(new Error('Not implemented for Fake Store API'));
};

export const processPayment = (userId, token, paymentData) => {
  // Not applicable to Fake Store API
  return Promise.reject(new Error('Not implemented for Fake Store API'));
};

export const createOrder = (userId, token, createOrderData) => {
  // Not applicable to Fake Store API
  return Promise.reject(new Error('Not implemented for Fake Store API'));
};