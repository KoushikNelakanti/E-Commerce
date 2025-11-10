import { API } from '../config';

// Create a new product
export const createProduct = (userId, token, product) => {
  return fetch(`${API}/product/create/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: product
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

// Get seller dashboard statistics
export const getSellerDashboard = (userId, token) => {
  return fetch(`${API}/seller/dashboard/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Get seller's products
export const getSellerProducts = (userId, token, page = 1, limit = 10) => {
  return fetch(`${API}/seller/products/${userId}?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Update product price
export const updateProductPrice = (productId, userId, token, priceData) => {
  return fetch(`${API}/seller/product/${productId}/price/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(priceData),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Update product stock
export const updateProductStock = (productId, userId, token, stockData) => {
  return fetch(`${API}/seller/product/${productId}/stock/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(stockData),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Bulk update products
export const bulkUpdateProducts = (userId, token, updates) => {
  return fetch(`${API}/seller/products/bulk-update/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ updates }),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Get product alerts summary
export const getProductAlertsSummary = (productId, userId, token) => {
  return fetch(`${API}/seller/product/${productId}/alerts/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Sync products from Fake Store API
export const syncFakeStoreProducts = (userId, token) => {
  return fetch(`${API}/products/sync-fakestore/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Update prices from Fake Store API (Admin only)
export const updatePricesFromAPI = (userId, token) => {
  return fetch(`${API}/products/update-prices/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Get product statistics
export const getProductStats = () => {
  return fetch(`${API}/products/stats`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
