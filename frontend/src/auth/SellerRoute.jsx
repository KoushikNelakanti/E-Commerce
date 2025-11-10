import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './index';

const SellerRoute = ({ children }) => {
  const auth = isAuthenticated();
  return auth && auth.user.role >= 1 ? (
    children
  ) : (
    <Navigate to='/signin' replace />
  );
};

export default SellerRoute;
