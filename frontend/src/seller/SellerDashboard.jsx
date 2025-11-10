import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab
} from '@mui/material';
import {
  Dashboard,
  Add,
  Edit,
  Inventory,
  TrendingUp,
  Refresh,
  Store,
  AttachMoney,
  ShoppingCart,
  Visibility,
  Save,
  Cancel
} from '@mui/icons-material';
import { 
  getSellerDashboard, 
  getSellerProducts, 
  updateProductPrice, 
  updateProductStock,
  syncFakeStoreProducts 
} from './apiSeller';
import { API } from '../config';

const SellerDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [message, setMessage] = useState('');

  const { user, token } = isAuthenticated();

  useEffect(() => {
    if (user && token && user.role >= 1) {
      loadDashboardData();
    }
  }, []); // Empty dependency array - only run once on mount

  const loadDashboardData = () => {
    setLoading(true);
    
    Promise.all([
      getSellerDashboard(user._id, token),
      getSellerProducts(user._id, token)
    ])
    .then(([statsData, productsData]) => {
      if (!statsData.error) setDashboardStats(statsData);
      if (!productsData.error) setProducts(productsData.products || []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  };

  const handleRefresh = () => {
    setMessage('');
    loadDashboardData();
  };

  const handleSyncProducts = () => {
    setSyncing(true);
    setMessage('');
    
    syncFakeStoreProducts(user._id, token)
      .then((data) => {
        if (data.error) {
          setMessage(`Error: ${data.error}`);
        } else {
          setMessage(`Successfully synced ${data.syncedCount} products from Fake Store API!`);
          loadDashboardData(); // Reload data
        }
        setSyncing(false);
      })
      .catch(() => {
        setMessage('Failed to sync products');
        setSyncing(false);
      });
  };

  const handleUpdatePrice = (productId) => {
    if (!newPrice || parseFloat(newPrice) <= 0) {
      setMessage('Please enter a valid price');
      return;
    }

    updateProductPrice(productId, user._id, token, { price: parseFloat(newPrice) })
      .then((data) => {
        if (data.error) {
          setMessage(`Error: ${data.error}`);
        } else {
          setProducts(products.map(p => 
            p._id === productId ? { ...p, price: parseFloat(newPrice) } : p
          ));
          setEditingProduct(null);
          setNewPrice('');
          const changeText = data.priceChange > 0 ? 'Increased' : 'Decreased';
          setMessage(`✅ Price updated successfully! ${changeText} by ₹${Math.abs(data.priceChange).toLocaleString('en-IN')}. ${data.priceChange < 0 ? 'Price alert emails will be sent to users!' : ''}`);
        }
      })
      .catch((error) => {
        console.error('Price update error:', error);
        setMessage('Error updating price. Please try again.');
      });
  };

  const handleUpdateStock = (productId) => {
    if (!newStock || parseInt(newStock) < 0) {
      setMessage('Please enter a valid stock quantity');
      return;
    }

    const oldProduct = products.find(p => p._id === productId);
    const wasOutOfStock = oldProduct?.quantity === 0;
    const willBeInStock = parseInt(newStock) > 0;

    updateProductStock(productId, user._id, token, { quantity: parseInt(newStock) })
      .then((data) => {
        if (data.error) {
          setMessage(`Error: ${data.error}`);
        } else {
          setProducts(products.map(p => 
            p._id === productId ? { ...p, quantity: parseInt(newStock) } : p
          ));
          setEditingProduct(null);
          setNewStock('');
          const changeText = data.stockChange > 0 ? 'Added' : 'Reduced';
          const backInStockText = wasOutOfStock && willBeInStock ? ' Back in stock emails will be sent to users!' : '';
          setMessage(`✅ Stock updated successfully! ${changeText} by ${Math.abs(data.stockChange)} units.${backInStockText}`);
        }
      });
  };

  if (!user || user.role < 1) {
    return (
      <Layout title="Access Denied" description="Seller access required">
        <div className="container mt-4">
          <div className="alert alert-warning">
            <h4>Access Denied</h4>
            <p>You need seller privileges to access this dashboard.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Seller Dashboard" description="Manage your products and inventory">
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
              Seller Dashboard
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={loading}
                sx={{ minWidth: 140 }}
              >
                Refresh Data
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                component={Link}
                to="/seller/add-product"
                sx={{ minWidth: 160 }}
              >
                Add New Product
              </Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={syncing ? <CircularProgress size={20} /> : <Refresh />}
                onClick={handleSyncProducts}
                disabled={syncing}
                sx={{ minWidth: 180 }}
              >
                {syncing ? 'Syncing...' : 'Sync Products'}
              </Button>
            </Box>
          </Box>

            {message && (
            <Alert 
              severity={message.includes('Error') ? 'error' : 'success'} 
              sx={{ mb: 2 }}
              onClose={() => setMessage('')}
            >
              {message}
            </Alert>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Dashboard Stats */}
            {dashboardStats && (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                      <Store sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {dashboardStats.totalProducts}
                      </Typography>
                      <Typography variant="body2">
                        Total Products
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                      <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {dashboardStats.productsWithAlerts || 0}
                      </Typography>
                      <Typography variant="body2">
                        Products with Alerts
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                      <Inventory sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {dashboardStats.lowStockProducts || 0}
                      </Typography>
                      <Typography variant="body2">
                        Low Stock Products
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                    <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                      <ShoppingCart sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {dashboardStats.outOfStockProducts || 0}
                      </Typography>
                      <Typography variant="body2">
                        Out of Stock
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Products Table */}
            <Paper sx={{ width: '100%', mb: 4 }}>
              <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <Inventory sx={{ mr: 1 }} />
                  My Products
                </Typography>
              </Box>
              {products.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No products found. Click "Sync Products" to import sample products or "Add New Product" to create your own.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  width: 50,
                                  height: 50,
                                  bgcolor: 'grey.200',
                                  borderRadius: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: 2
                                }}
                              >
                                📦
                              </Box>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {product.description?.substring(0, 50)}...
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {product.category?.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {editingProduct === `${product._id}-price` ? (
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={newPrice}
                                  onChange={(e) => setNewPrice(e.target.value)}
                                  sx={{ width: 100 }}
                                  inputProps={{ min: 0, step: 0.01 }}
                                />
                                <IconButton 
                                  size="small" 
                                  color="success"
                                  onClick={() => handleUpdatePrice(product._id)}
                                >
                                  <Save />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => {
                                    setEditingProduct(null);
                                    setNewPrice('');
                                  }}
                                >
                                  <Cancel />
                                </IconButton>
                              </Box>
                            ) : (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 'medium', 
                                  color: 'primary.main',
                                  cursor: 'pointer',
                                  '&:hover': { textDecoration: 'underline' }
                                }}
                                onClick={() => {
                                  setEditingProduct(`${product._id}-price`);
                                  setNewPrice(product.price);
                                }}
                              >
                                ₹{product.price.toLocaleString('en-IN')}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingProduct === `${product._id}-stock` ? (
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={newStock}
                                  onChange={(e) => setNewStock(e.target.value)}
                                  sx={{ width: 80 }}
                                  inputProps={{ min: 0 }}
                                />
                                <IconButton 
                                  size="small" 
                                  color="success"
                                  onClick={() => handleUpdateStock(product._id)}
                                >
                                  <Save />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => {
                                    setEditingProduct(null);
                                    setNewStock('');
                                  }}
                                >
                                  <Cancel />
                                </IconButton>
                              </Box>
                            ) : (
                              <Typography 
                                variant="body2"
                                sx={{ 
                                  cursor: 'pointer',
                                  '&:hover': { textDecoration: 'underline' }
                                }}
                                onClick={() => {
                                  setEditingProduct(`${product._id}-stock`);
                                  setNewStock(product.quantity);
                                }}
                              >
                                {product.quantity}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                product.quantity === 0 ? 'Out of Stock' :
                                product.quantity <= 5 ? 'Low Stock' : 'In Stock'
                              }
                              color={
                                product.quantity === 0 ? 'error' :
                                product.quantity <= 5 ? 'warning' : 'success'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => {
                                  setEditingProduct(`${product._id}-price`);
                                  setNewPrice(product.price);
                                }}
                                title="Edit Price"
                              >
                                <AttachMoney />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="secondary"
                                onClick={() => {
                                  setEditingProduct(`${product._id}-stock`);
                                  setNewStock(product.quantity);
                                }}
                                title="Edit Stock"
                              >
                                <Inventory />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </>
        )}
        
        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add product"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          component={Link}
          to="/seller/add-product"
        >
          <Add />
        </Fab>
      </Container>
    </Layout>
  );
};

export default SellerDashboard;
