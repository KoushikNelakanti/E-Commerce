import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import { itemTotal } from './cartHelpers';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Store,
  User,
  UserPlus,
  LogOut,
  Menu as MenuIcon,
  Home,
  Search,
} from 'lucide-react';
import DarkModeToggle from '../components/DarkModeToggle';

const AppleNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const currentPath = window.location.pathname;

  const handleSignout = () => {
    signout(() => {
      navigate('/');
    });
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => currentPath === path;

  // Navigation items data
  const navItems = [
    { path: '/', label: 'Home', icon: Home, show: true },
    { path: '/shop', label: 'Shop', icon: Store, show: true },
    {
      path: '/cart',
      label: 'Cart',
      icon: ShoppingBag,
      badge: itemTotal(),
      show: true,
    },
    {
      path: '/user/dashboard',
      label: 'Dashboard',
      icon: User,
      show: isAuthenticated() && isAuthenticated().user.role === 0,
    },
    {
      path: '/admin/dashboard',
      label: 'Admin',
      icon: User,
      show: isAuthenticated() && isAuthenticated().user.role === 1,
    },
    {
      path: '/signin',
      label: 'Sign In',
      icon: User,
      show: !isAuthenticated(),
    },
    {
      path: '/signup',
      label: 'Sign Up',
      icon: UserPlus,
      show: !isAuthenticated(),
    },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl border-b border-apple-gray-200 dark:border-dark-border transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-apple-gray-900 dark:text-dark-text-primary transition-colors duration-300" />
            <span className="text-xl font-semibold text-apple-gray-900 dark:text-dark-text-primary transition-colors duration-300">ShopEase</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => 
              item.show && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-apple-gray-100 dark:bg-dark-surface-secondary text-apple-gray-900 dark:text-dark-text-primary'
                      : 'text-apple-gray-600 dark:text-dark-text-secondary hover:text-apple-gray-900 dark:hover:text-dark-text-primary hover:bg-apple-gray-50 dark:hover:bg-dark-surface-secondary'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-1 bg-apple-blue-500 dark:bg-dark-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            )}
            {isAuthenticated() && (
              <button
                onClick={handleSignout}
                className="flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium text-apple-gray-600 dark:text-dark-text-secondary hover:text-apple-gray-900 dark:hover:text-dark-text-primary hover:bg-apple-gray-50 dark:hover:bg-dark-surface-secondary transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            )}
            
            {/* Dark Mode Toggle */}
            <DarkModeToggle className="ml-2" />
          </div>

          {/* Mobile menu button and dark mode toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-apple-gray-600 dark:text-dark-text-secondary hover:text-apple-gray-900 dark:hover:text-dark-text-primary hover:bg-apple-gray-50 dark:hover:bg-dark-surface-secondary transition-colors"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-apple-gray-200 dark:border-dark-border"
          >
            <div className="space-y-2">
              {navItems.map((item) => 
                item.show && (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-apple-gray-100 dark:bg-dark-surface-secondary text-apple-gray-900 dark:text-dark-text-primary'
                        : 'text-apple-gray-600 dark:text-dark-text-secondary hover:text-apple-gray-900 dark:hover:text-dark-text-primary hover:bg-apple-gray-50 dark:hover:bg-dark-surface-secondary'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="ml-auto bg-apple-blue-500 dark:bg-dark-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              )}
              {isAuthenticated() && (
                <button
                  onClick={handleSignout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-apple-gray-600 dark:text-dark-text-secondary hover:text-apple-gray-900 dark:hover:text-dark-text-primary hover:bg-apple-gray-50 dark:hover:bg-dark-surface-secondary transition-all duration-200 w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default AppleNavbar;