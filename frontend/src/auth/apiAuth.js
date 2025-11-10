import { API } from '../config';

// Forgot password
export const forgotPassword = (email) => {
  return fetch(`${API}/forgot-password`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(email),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Reset password
export const resetPassword = (token, passwordData) => {
  return fetch(`${API}/reset-password/${token}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passwordData),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

// Change password (for logged in users)
export const changePassword = (userId, token, passwordData) => {
  return fetch(`${API}/change-password/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};
