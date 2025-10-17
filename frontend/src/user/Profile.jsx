import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';
import UserSidebar from '../components/UserSidebar';
import { useAppTheme } from '../hooks/useTheme';

const Profile = () => {
  const theme = useAppTheme();
  const { userId } = useParams();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: false,
    success: false,
  });

  const { _id, token } = isAuthenticated();
  const { name, email, password, success, error } = values;

  const init = (userId) => {
    read(userId, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });
  };

  useEffect(() => {
    if (userId) {
      init(userId);
    } else if (_id) {
      init(_id);
    }
  }, [userId, _id, token]);

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    const updateId = userId || _id;
    update(updateId, token, { name, email, password }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        updateUser(data, () => {
          setValues({
            ...values,
            name: data.name,
            email: data.email,
            success: true,
          });
        });
      }
    });
  };

  const redirectUser = (success) => {
    if (success) {
      return <Navigate to='/user/dashboard' />;
    }
  };

  const showError = () => (
    <Alert 
      severity="error" 
      sx={{ 
        mb: 2,
        borderRadius: '12px',
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 69, 58, 0.1)' : 'rgba(255, 69, 58, 0.05)',
      }}
    >
      {error}
    </Alert>
  );

  const showSuccess = () => (
    <Alert 
      severity="success" 
      sx={{ 
        mb: 2,
        borderRadius: '12px',
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(48, 209, 88, 0.1)' : 'rgba(48, 209, 88, 0.05)',
      }}
    >
      Profile updated successfully!
    </Alert>
  );

  const profileUpdate = (name, email, password) => (
    <Card 
      sx={{ 
        borderRadius: '16px',
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 10px 25px -3px rgba(0, 0, 0, 0.4)' 
          : '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
        bgcolor: theme.palette.background.paper,
      }}
    >
      <CardContent>
        <Typography 
          variant='h5' 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 3,
          }}
        >
          Update Profile
        </Typography>
        
        {error && showError()}
        {success && showSuccess()}
        
        <Box component='form' onSubmit={clickSubmit}>
          <TextField
            fullWidth
            margin='normal'
            label='Name'
            variant='outlined'
            onChange={handleChange('name')}
            value={name}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
              mb: 2,
            }}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Email'
            type='email'
            variant='outlined'
            onChange={handleChange('email')}
            value={email}
            disabled
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
              mb: 2,
            }}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Password'
            type='password'
            variant='outlined'
            onChange={handleChange('password')}
            value={password}
            helperText='Leave blank to keep current password'
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
              mb: 3,
            }}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            sx={{ 
              mt: 1,
              padding: '12px 24px',
              borderRadius: '9999px',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Update Profile
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Layout
      title='Profile'
      description='Update your profile'
      className='container-fluid'
    >
      <Grid container spacing={3}>
        {/* LEFT SIDEBAR */}
        <UserSidebar userId={_id} />

        {/* MAIN CONTENT */}
        <Grid size={{ xs: 12, md: 9 }}>
          {profileUpdate(name, email, password)}
          {redirectUser(success)}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Profile;