# MERN E-commerce with Fake Store API Integration

This is a MERN (MongoDB, Express, React, Node.js) e-commerce application that has been enhanced to work with the Fake Store API as an alternative to the local backend.

## Features

- Full e-commerce functionality (product listing, product details, shopping cart, search, filtering)
- Integration with Fake Store API (https://fakestoreapi.com)
- Toggle between local backend and Fake Store API
- Responsive design using Material-UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ..
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   node server.js
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at `http://localhost:5174` (or another port if 5174 is in use).

## Fake Store API Integration

This application can use the Fake Store API instead of the local backend for demonstration purposes.

### Configuration

To toggle between the local backend and Fake Store API, modify the `USE_FAKE_STORE_API` flag in `frontend/src/config.js`:

```javascript
// To use Fake Store API
export const USE_FAKE_STORE_API = true;

// To use local backend
export const USE_FAKE_STORE_API = false;
```

### How It Works

When `USE_FAKE_STORE_API` is set to `true`:
- Product data is fetched from https://fakestoreapi.com
- All product-related operations use the Fake Store API
- Payment and order functionalities are simulated (not fully implemented)

When `USE_FAKE_STORE_API` is set to `false`:
- Product data is fetched from the local backend
- All functionalities work as originally implemented

## Project Structure

```
.
├── controllers/          # Backend controllers
├── frontend/             # React frontend
│   ├── src/
│   │   ├── admin/        # Admin components
│   │   ├── auth/         # Authentication components
│   │   ├── components/   # Shared components
│   │   ├── context/      # React context
│   │   ├── core/         # Core components and API services
│   │   ├── user/         # User components
│   │   ├── App.jsx       # Main App component
│   │   ├── Routes.jsx    # Routing configuration
│   │   └── config.js     # Configuration file
├── helpers/              # Helper functions
├── models/               # MongoDB models
├── routes/               # Backend routes
├── validator/            # Validation functions
├── package.json          # Backend package.json
├── server.js             # Backend entry point
└── README.md             # This file
```

## API Services

### Local Backend API (`apiCore.js`)

The original API service that connects to the local backend.

### Fake Store API (`fakeStoreApi.js`)

A new API service that connects to https://fakestoreapi.com with the following endpoints:

- `getProducts(sortBy)`: Get products sorted by specified criteria
- `getCategories()`: Get all product categories
- `getFilteredProducts(skip, limit, filters)`: Get filtered products with pagination
- `list(params)`: Search products
- `read(productId)`: Get a single product by ID
- `listRelated(productId)`: Get related products

## Components Updated for Fake Store API

The following components have been updated to work with both the local backend and Fake Store API:

- `Home.jsx`: Product listings (new arrivals, best sellers)
- `Shop.jsx`: Product browsing with filtering
- `Product.jsx`: Product details page
- `Card.jsx`: Product card component
- `ShowImage.jsx`: Product image display
- `Search.jsx`: Product search functionality
- `CategoriesFilter.jsx`: Category filtering

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.