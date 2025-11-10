import { API } from '../config';

// Create price alert
export const createPriceAlert = (userId, token, alertData) => {
  return fetch(`${API}/alert/price/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(alertData),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Create stock alert
export const createStockAlert = (userId, token, alertData) => {
  return fetch(`${API}/alert/stock/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(alertData),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Get user's price alerts
export const getUserPriceAlerts = (userId, token, isActive = true) => {
  return fetch(`${API}/alerts/price/${userId}?isActive=${isActive}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Get user's stock alerts
export const getUserStockAlerts = (userId, token, isActive = true) => {
  return fetch(`${API}/alerts/stock/${userId}?isActive=${isActive}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Update price alert
export const updatePriceAlert = (alertId, userId, token, updateData) => {
  return fetch(`${API}/alert/price/${alertId}/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Update stock alert
export const updateStockAlert = (alertId, userId, token, updateData) => {
  return fetch(`${API}/alert/stock/${alertId}/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Delete price alert
export const deletePriceAlert = (alertId, userId, token) => {
  return fetch(`${API}/alert/price/${alertId}/${userId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Delete stock alert
export const deleteStockAlert = (alertId, userId, token) => {
  return fetch(`${API}/alert/stock/${alertId}/${userId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Get alert statistics
export const getAlertStats = (userId, token) => {
  return fetch(`${API}/alerts/stats/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
