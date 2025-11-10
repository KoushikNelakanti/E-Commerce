import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Home from './core/Home';
import PrivateRoute from './auth/PrivateRoute';
import Dashboard from './user/UserDashboard';
import AdminRoute from './auth/AdminRoute';
import SellerRoute from './auth/SellerRoute';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Shop from './core/Shop';
import Product from './core/Product';
import Cart from './core/Cart';
import Orders from './admin/Orders';
import Profile from './user/Profile';
import ManageProducts from './admin/ManageProducts';
import UpdateProduct from './admin/UpdateProduct';
import CategoryList from './admin/CategoryList';
import UsersList from './admin/UsersList';
import NotFound from './core/NotFound';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import AlertManagement from './alerts/AlertManagement';
import SellerDashboard from './seller/SellerDashboard';
import SellerAddProduct from './seller/AddProduct';
import EnhancedAdminDashboard from './admin/EnhancedAdminDashboard';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />

        {/* Private Routes */}
        <Route
          path='/user/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path='/profile/:userId'
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path='/user/alerts'
          element={
            <PrivateRoute>
              <AlertManagement />
            </PrivateRoute>
          }
        />
        <Route
          path='/seller/dashboard'
          element={
            <SellerRoute>
              <SellerDashboard />
            </SellerRoute>
          }
        />
        <Route
          path='/seller/add-product'
          element={
            <SellerRoute>
              <SellerAddProduct />
            </SellerRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path='/admin/dashboard'
          element={
            <AdminRoute>
              <EnhancedAdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path='/create/category'
          element={
            <AdminRoute>
              <AddCategory />
            </AdminRoute>
          }
        />
        <Route
          path='/create/product'
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/orders'
          element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/products'
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/product/update/:productId'
          element={
            <AdminRoute>
              <UpdateProduct />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/categories'
          element={
            <AdminRoute>
              <CategoryList />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/users'
          element={
            <AdminRoute>
              <UsersList />
            </AdminRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
