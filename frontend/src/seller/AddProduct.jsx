import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../auth';
import { getCategories } from '../core/apiCore';
import { createProduct } from './apiSeller';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Box,
  Grid,
  Card,
  CardContent,
  Input
} from '@mui/material';
import { CloudUpload, Add } from '@mui/icons-material';

const AddProduct = () => {
  const { user, token } = isAuthenticated();
  
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    shipping: false,
    quantity: '',
    photo: '',
    loading: false,
    error: '',
    success: false,
    createdProduct: '',
    redirectToProfile: false,
    formData: ''
  });

  const {
    name,
    description,
    price,
    categories,
    category,
    shipping,
    quantity,
    loading,
    error,
    success,
    createdProduct,
    formData
  } = values;

  // Load categories and prepare form data
  const init = () => {
    getCategories().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          categories: data,
          formData: new FormData()
        });
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = name => event => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    const checked = name === 'shipping' ? event.target.checked : false;
    
    if (name === 'shipping') {
      formData.set(name, checked);
      setValues({ ...values, [name]: checked });
    } else {
      formData.set(name, value);
      setValues({ ...values, [name]: value });
    }
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: '', loading: true });

    createProduct(user._id, token, formData).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          name: '',
          description: '',
          photo: '',
          price: '',
          quantity: '',
          loading: false,
          success: true,
          createdProduct: data.name
        });
      }
    });
  };

  const newPostForm = () => (
    <form onSubmit={clickSubmit}>
      <Grid container spacing={3}>
        {/* Photo Upload */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Image
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Upload Photo
                <Input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange('photo')}
                  sx={{ display: 'none' }}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Accepted formats: JPG, PNG, GIF (Max 1MB)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Name */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Product Name"
            value={name}
            onChange={handleChange('name')}
            required
            helperText="Enter a descriptive product name"
          />
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={description}
            onChange={handleChange('description')}
            required
            helperText="Detailed product description"
          />
        </Grid>

        {/* Price and Quantity */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Price (₹)"
            value={price}
            onChange={handleChange('price')}
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            value={quantity}
            onChange={handleChange('quantity')}
            required
            inputProps={{ min: 0 }}
          />
        </Grid>

        {/* Category */}
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={handleChange('category')}
              label="Category"
            >
              {categories &&
                categories.map((c, i) => (
                  <MenuItem key={i} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Shipping */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={shipping}
                onChange={handleChange('shipping')}
                color="primary"
              />
            }
            label="Shipping Available"
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<Add />}
            disabled={loading}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {loading ? 'Creating Product...' : 'Create Product'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );

  const showError = () => (
    error && (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    )
  );

  const showSuccess = () => (
    success && (
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="h6">Success!</Typography>
        <Typography>
          "{createdProduct}" has been created successfully!
        </Typography>
      </Alert>
    )
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Add New Product
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Create a new product listing for your store
        </Typography>

        {showSuccess()}
        {showError()}
        
        {newPostForm()}
      </Paper>
    </Container>
  );
};

export default AddProduct;
