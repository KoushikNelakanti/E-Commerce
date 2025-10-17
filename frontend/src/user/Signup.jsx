import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import Copyright from '../core/Copyright.jsx';
import Layout from '../core/Layout.jsx';
import { signup } from '../auth/index.js';
import { useAppTheme } from '../hooks/useTheme';

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

export default function Signup() {
  const theme = useAppTheme();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false,
    loading: false,
  });

  const { name, email, password, success, error, loading } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: '', [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: '', loading: true });
    signup({ name, email, password }).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
          loading: false,
        });
      } else {
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          error: '',
          success: true,
          loading: false,
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

  const showSuccess = () =>
    success && (
      <Alert 
        severity='success' 
        sx={{ 
          width: '100%', 
          mb: 2,
          borderRadius: '12px',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(48, 209, 88, 0.1)' : 'rgba(48, 209, 88, 0.05)',
        }}
      >
        New account created successfully! Please{' '}
        <StyledLink to='/signin'>Sign In</StyledLink>.
      </Alert>
    );

  return (
    <Layout
      title='Create Account'
      description='Sign up for a new account'
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
          {showSuccess()}
          {showError()}

          <StyledAvatar>
            <PersonAddIcon />
          </StyledAvatar>

          <Typography 
            component='h1' 
            variant='h5'
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Create Account
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
            Join us today and start shopping
          </Typography>

          <FormContainer onSubmit={clickSubmit} noValidate>
            <TextField
              margin='normal'
              required
              fullWidth
              id='name'
              label='Full Name'
              name='name'
              autoComplete='name'
              autoFocus
              value={name}
              onChange={handleChange('name')}
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
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              value={email}
              onChange={handleChange('email')}
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
              autoComplete='new-password'
              value={password}
              onChange={handleChange('password')}
              inputProps={{ minLength: 6 }}
              helperText='Password must be at least 6 characters'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />

            <SubmitButton
              type='submit'
              fullWidth
              variant='contained'
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </SubmitButton>

            <Grid container justifyContent='flex-end' sx={{ mt: 2 }}>
              <Grid item>
                <Typography variant='body2'>
                  Already have an account? <StyledLink to='/signin'>Sign in</StyledLink>
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