import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Avatar,
  Grid,
  Paper,
} from '@mui/material';
import {
  Category as CategoryIcon,
  AddCircle as AddCircleIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import Layout from '../core/Layout';
import AdminSidebar from '../components/AdminSidebar';
import { isAuthenticated } from '../auth';

const AdminDashboard = () => {
  const {
    user: { _id, name, email, role },
  } = isAuthenticated();

  return (
    <Layout title='Admin Dashboard' description={`Welcome, ${name}`}>
      <Grid container spacing={2}>
        {/* Sidebar */}
        <AdminSidebar />

        {/* MAIN CONTENT */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Card elevation={3} sx={{ bgcolor: 'background.paper' }}>
            <CardHeader
              title='Admin Profile'
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
              sx={{ color: 'text.primary' }}
            />
            <Divider sx={{ borderColor: 'divider' }} />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 3,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant='h5' component='div' className="text-gray-900 dark:text-white transition-colors duration-300">
                    {name}
                  </Typography>
                  <Chip
                    label={role === 1 ? 'Administrator' : 'Registered User'}
                    color='primary'
                    size='small'
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              <Paper elevation={0} sx={{ bgcolor: 'background.default' }}>
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary='User ID' secondary={_id} primaryTypographyProps={{ className: "text-gray-900 dark:text-white" }} secondaryTypographyProps={{ className: "text-gray-600 dark:text-gray-300" }} />
                  </ListItem>
                  <Divider component='li' sx={{ borderColor: 'divider' }} />
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary='Email' secondary={email} primaryTypographyProps={{ className: "text-gray-900 dark:text-white" }} secondaryTypographyProps={{ className: "text-gray-600 dark:text-gray-300" }} />
                  </ListItem>
                </List>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AdminDashboard;