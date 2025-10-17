import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Layout from '../core/Layout.jsx';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Copyright from '../core/Copyright.jsx';
import { signin, authenticate, isAuthenticated } from '../auth/index.js';
import { useAppTheme } from '../hooks/useTheme';

// Create styled components using MUI v5 styled API
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
}));

const FormContainer = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  padding: theme.spacing(1.5),
  borderRadius: '9999px',
  fontWeight: 600,
  textTransform: 'none',
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export default function Signin() {
  const theme = useAppTheme();
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
    redirectToReferrer: false,
    rememberMe: false,
  });

  const { email, password, loading, error, redirectToReferrer, rememberMe } =
    values;
  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    const value =
      name === 'rememberMe' ? event.target.checked : event.target.value;
    setValues({ ...values, error: '', [name]: value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: '', loading: true });

    signin({ email, password, rememberMe }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            redirectToReferrer: true,
          });
        });
      }
    });
  };

  const showError = () =>
    error && (
      <Alert 
        severity='error' 
        sx={{ 
          width: '100%', 
          mb: 2,
          borderRadius: '12px',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 69, 58, 0.1)' : 'rgba(255, 69, 58, 0.05)',
        }}
      >
        {error}
      </Alert>
    );

  const showLoading = () =>
    loading && (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <CircularProgress />
      </Box>
    );

  const redirectUser = () => {
    if (redirectToReferrer) {
      if (user && user.role === 1) {
        return <Navigate to='/admin/dashboard' />;
      } else {
        return <Navigate to='/user/dashboard' />;
      }
    }
    if (isAuthenticated()) {
      return <Navigate to='/' />;
    }
  };

  return (
    <Layout
      title='Sign In'
      description='Sign in to your account'
      className='container col-md-8 offset-md-2'
    >
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            borderRadius: '16px',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 10px 25px -3px rgba(0, 0, 0, 0.4)' 
              : '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
            bgcolor: theme.palette.background.paper,
          }}
        >
          {showError()}
          {showLoading()}
          {redirectUser()}

          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>

          <Typography 
            component='h1' 
            variant='h5'
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Welcome Back
          </Typography>
          
          <Typography 
            variant='body2' 
            sx={{ 
              mt: 1, 
              mb: 3,
              color: theme.palette.text.secondary,
              textAlign: 'center',
            }}
          >
            Sign in to continue to your account
          </Typography>

          <FormContainer onSubmit={clickSubmit} noValidate>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              onChange={handleChange('email')}
              type='email'
              value={email}
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />

            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              onChange={handleChange('password')}
              value={password}
              autoComplete='current-password'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  value='remember'
                  color='primary'
                  checked={rememberMe}
                  onChange={handleChange('rememberMe')}
                />
              }
              label='Remember me'
              sx={{
                color: theme.palette.text.secondary,
              }}
            />

            <SubmitButton
              type='submit'
              fullWidth
              variant='contained'
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </SubmitButton>

            <Grid container justifyContent='space-between' sx={{ mt: 2 }}>
              <Grid item>
                <Typography variant='body2'>
                  <StyledLink to='/forgot-password'>
                    Forgot password?
                  </StyledLink>
                </Typography>
              </Grid>

              <Grid item>
                <Typography variant='body2'>
                  {"Don't have an account? "}
                  <StyledLink to='/signup'>
                    {'Sign Up'}
                  </StyledLink>
                </Typography>
              </Grid>
            </Grid>
          </FormContainer>
        </Box>

        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </Layout>
  );
}