import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockResetIcon from '@mui/icons-material/LockReset';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import Copyright from '../core/Copyright.jsx';
import Layout from '../core/Layout.jsx';
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

export default function ForgotPassword() {
  const theme = useAppTheme();
  const [values, setValues] = useState({
    email: '',
    error: '',
    success: false,
    loading: false,
  });

  const { email, success, error, loading } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: '', [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: '', loading: true });
    
    // Simulate API call
    setTimeout(() => {
      setValues({
        ...values,
        email: '',
        success: true,
        loading: false,
      });
    }, 1000);
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
        Password reset instructions have been sent to your email address.
      </Alert>
    );

  return (
    <Layout
      title='Forgot Password'
      description='Reset your password'
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
            <LockResetIcon />
          </StyledAvatar>

          <Typography 
            component='h1' 
            variant='h5'
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Reset Password
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
            Enter your email address and we'll send you a link to reset your password.
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
              autoFocus
              value={email}
              onChange={handleChange('email')}
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
              {loading ? 'Sending...' : 'Send Reset Link'}
            </SubmitButton>

            <Grid container justifyContent='center' sx={{ mt: 2 }}>
              <Grid item>
                <Typography variant='body2'>
                  Remember your password? <StyledLink to='/signin'>Sign in</StyledLink>
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