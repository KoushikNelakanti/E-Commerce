import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../auth';
import { getProductStats, updatePricesFromAPI } from '../seller/apiSeller';
import { getUsers } from './apiAdmin';
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
  Divider,
  Avatar
} from '@mui/material';
import {
  Dashboard,
  People,
  Inventory,
  TrendingUp,
  Refresh,
  AdminPanelSettings,
  Store,
  Person
} from '@mui/icons-material';

const EnhancedAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const { user, token } = isAuthenticated();

  useEffect(() => {
    if (user && token && user.role === 2) {
      loadDashboardData();
    }
  }, []); // Empty dependency array - only run once on mount

  const loadDashboardData = () => {
    setLoading(true);
    
    Promise.all([
      getProductStats(),
      getUsers(user._id, token)
    ])
    .then(([statsData, usersData]) => {
      if (statsData && !statsData.error) setStats(statsData.stats);
      if (usersData && !usersData.error) setUsers(usersData);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  };

  const handleUpdatePrices = () => {
    setUpdating(true);
    setMessage('');
    
    updatePricesFromAPI(user._id, token)
      .then((data) => {
        if (data.error) {
          setMessage(`Error: ${data.error}`);
        } else {
          setMessage(`Successfully updated prices for ${data.updatedCount} products!`);
          loadDashboardData(); // Reload stats
        }
        setUpdating(false);
      })
      .catch(() => {
        setMessage('Failed to update prices');
        setUpdating(false);
      });
  };

  if (!user || user.role !== 2) {
    return (
      <Layout title="Access Denied" description="Admin access required">
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">
            <Typography variant="h6">Access Denied</Typography>
            <Typography>You need administrator privileges to access this dashboard.</Typography>
          </Alert>
        </Container>
      </Layout>
    );
  }

  const usersByRole = users.reduce((acc, user) => {
    const role = user.role === 2 ? 'admins' : user.role === 1 ? 'sellers' : 'customers';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const getRoleIcon = (role) => {
    switch(role) {
      case 2: return <AdminPanelSettings color="error" />;
      case 1: return <Store color="primary" />;
      default: return <Person color="action" />;
    }
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 2: return 'Admin';
      case 1: return 'Seller';
      default: return 'Customer';
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 2: return 'error';
      case 1: return 'primary';
      default: return 'default';
    }
  };

  return (
    <Layout title="Admin Dashboard" description="System administration and management">
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
              Admin Dashboard
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
                sx={{ minWidth: 150 }}
              >
                Refresh Data
              </Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={updating ? <CircularProgress size={20} /> : <Refresh />}
                onClick={handleUpdatePrices}
                disabled={updating}
                sx={{ minWidth: 200 }}
              >
                {updating ? 'Updating...' : 'Update Prices from API'}
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
            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                    <People sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {users.length}
                    </Typography>
                    <Typography variant="body2">
                      Total Users
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                    <Inventory sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {stats?.totalProducts || 0}
                    </Typography>
                    <Typography variant="body2">
                      Total Products
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                  <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                    <Store sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {usersByRole.sellers || 0}
                    </Typography>
                    <Typography variant="body2">
                      Active Sellers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                  <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                    <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {usersByRole.customers || 0}
                    </Typography>
                    <Typography variant="body2">
                      Customers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Users Table */}
            <Paper sx={{ width: '100%', mb: 4 }}>
              <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <People sx={{ mr: 1 }} />
                  System Users
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.slice(0, 10).map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                              {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getRoleIcon(user.role)}
                            label={getRoleLabel(user.role)}
                            color={getRoleColor(user.role)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Active"
                            color="success"
                            size="small"
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Product Statistics */}
            {stats && (
              <Paper sx={{ width: '100%', mb: 4 }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <Inventory sx={{ mr: 1 }} />
                    Product Analytics
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
                        <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                          {stats.totalProducts}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Products
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                        <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                          {stats.fakeStoreProducts || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sample Products
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
                        <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                          {stats.localProducts || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Local Products
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 2 }}>
                        <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                          {stats.categories || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Categories
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Price Range Analysis
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Minimum Price
                        </Typography>
                        <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
                          ₹{stats.priceRange?.minPrice?.toLocaleString('en-IN') || '0'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Average Price
                        </Typography>
                        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                          ₹{stats.priceRange?.avgPrice?.toLocaleString('en-IN') || '0'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Maximum Price
                        </Typography>
                        <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>
                          ₹{stats.priceRange?.maxPrice?.toLocaleString('en-IN') || '0'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            )}
          </>
        )}
      </Container>
    </Layout>
  );
};

export default EnhancedAdminDashboard;
