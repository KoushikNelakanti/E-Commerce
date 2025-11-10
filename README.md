# MERN E-commerce with Price & Stock Alert System

A full-stack e-commerce application built with the MERN stack, featuring an advanced price and stock alert system that notifies users when products drop in price or come back in stock.

## 🚀 Tech Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js & Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment**: Braintree
- **Notifications**: Nodemailer
- **Scheduling**: Node-cron

## ✨ Key Features

### 🛒 Core E-commerce Features
- Product catalog with categories
- Shopping cart and checkout
- Order management
- Payment processing with Braintree
- User authentication and profiles
- Admin dashboard

### 🔔 Advanced Alert System
- **Price Drop Alerts**: Get notified when product prices fall below your target
- **Stock Alerts**: Receive notifications when out-of-stock items become available
- **Email Notifications**: HTML email alerts with product details
- **Real-time Monitoring**: Automated background checking every 5 minutes
- **Alert Management**: Create, update, and delete alerts easily

### 👨‍💼 Multi-User System
- **Customers**: Browse, purchase, and set alerts
- **Sellers**: Manage products and view alert statistics
- **Admins**: Full system control and management

## 🏗️ System Architecture

### Database Schema
1. **users**: User profiles with alert preferences
2. **products**: Product details with price/stock history
3. **categories**: Product categorization
4. **orders**: Order management
5. **pricealerts**: Price drop monitoring
6. **stockalerts**: Stock availability tracking

### User Roles & Permissions

#### 👤 Customer (role: 0)
- Browse and search products
- Add items to cart and checkout
- Create price and stock alerts
- Manage alert preferences
- View order history

#### 🏪 Seller (role: 1)
- Add and manage products
- Update product prices and stock
- View alert statistics for their products
- Bulk update products
- Access seller dashboard

#### 👨‍💻 Admin (role: 2)
- Full system access
- Manage all users and products
- Create and manage categories
- View all orders and analytics
- System configuration

## 📦 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/koushik-nelakanti/ecommerce.git
cd ecommerce
```

### 2. Install Dependencies
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mern-ecommerce
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/mern-ecommerce

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Braintree Payment Configuration
BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREE_PUBLIC_KEY=your_braintree_public_key
BRAINTREE_PRIVATE_KEY=your_braintree_private_key

# Email Configuration for Alert Notifications
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Frontend Configuration
Create `frontend/config.js`:
```javascript
export const API = 'http://localhost:5000/api';
```

### 5. Seed the Database
```bash
npm run seed
```
This will automatically:
- Create admin, seller, and customer accounts
- Set up product categories
- Import products from Fake Store API
- Configure the complete system

### 6. Start the Application
```bash
npm run dev
```
This starts both backend (port 5000) and frontend (port 5173) servers.

## 🔐 User Authentication & Access

### Default Login Credentials
After running the seeder, use these accounts:

**👨‍💻 Admin Account:**
- Email: `admin@ecommerce.com`
- Password: `admin123`
- Access: Full system control

**🏪 Seller Accounts:**
- Email: `seller@ecommerce.com` / Password: `seller123`
- Email: `bob@merchant.com` / Password: `bob123`
- Access: Product management & alerts

**👤 Customer Accounts:**
- Email: `customer@ecommerce.com` / Password: `customer123`
- Email: `alice@example.com` / Password: `alice123`
- Access: Shopping & price alerts

## 🎯 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/signin` - User login
- `GET /api/signout` - User logout
- `POST /api/forgot-password` - Request password reset
- `PUT /api/reset-password/:token` - Reset password with token
- `PUT /api/change-password/:userId` - Change password (logged in users)

### Products
- `GET /api/products` - Get all products (with pagination & filters)
- `GET /api/product/:productId` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `POST /api/product/create/:userId` - Create product (Admin/Seller)
- `PUT /api/product/:productId/:userId` - Update product
- `DELETE /api/product/:productId/:userId` - Delete product
- `POST /api/products/sync-fakestore/:userId` - Sync from Fake Store API
- `PUT /api/products/update-prices/:userId` - Update prices from API (Admin)
- `GET /api/products/stats` - Get product statistics

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/category/create/:userId` - Create category (Admin)
- `PUT /api/category/:categoryId/:userId` - Update category
- `DELETE /api/category/:categoryId/:userId` - Delete category

### Orders
- `GET /api/orders/by/user/:userId` - Get user orders
- `GET /api/orders/list/:userId` - Get all orders (Admin)
- `PUT /api/order/:orderId/status/:userId` - Update order status

### Price Alerts
- `POST /api/alert/price/:userId` - Create price alert
- `GET /api/alerts/price/:userId` - Get user's price alerts
- `PUT /api/alert/price/:alertId/:userId` - Update price alert
- `DELETE /api/alert/price/:alertId/:userId` - Delete price alert

### Stock Alerts
- `POST /api/alert/stock/:userId` - Create stock alert
- `GET /api/alerts/stock/:userId` - Get user's stock alerts
- `PUT /api/alert/stock/:alertId/:userId` - Update stock alert
- `DELETE /api/alert/stock/:alertId/:userId` - Delete stock alert

### Seller Dashboard
- `GET /api/seller/dashboard/:userId` - Seller statistics
- `GET /api/seller/products/:userId` - Seller's products
- `PUT /api/seller/product/:productId/price/:userId` - Update product price
- `PUT /api/seller/product/:productId/stock/:userId` - Update product stock
- `POST /api/seller/products/bulk-update/:userId` - Bulk update products

## 🔔 Alert System Usage

### Creating Price Alerts
```javascript
// POST /api/alert/price/:userId
{
  "productId": "product_id_here",
  "targetPrice": 99.99
}
```

### Creating Stock Alerts
```javascript
// POST /api/alert/stock/:userId
{
  "productId": "product_id_here",
  "stockThreshold": 0  // Alert when quantity > 0
}
```

### Email Notifications
Users receive HTML email notifications when:
- Product price drops below their target price
- Out-of-stock products become available
- Password reset requests are made
- Notifications include product details and direct links

## 🛍️ Fake Store API Integration

### Product Data Source
The application integrates with [Fake Store API](https://fakestoreapi.com/) to provide:
- **20 Sample Products** across 4 categories
- **Real Product Data** with images, descriptions, and prices
- **Automatic Synchronization** during database seeding
- **Price Tracking** with historical data

### Categories Available
- **Electronics** - Phones, laptops, and gadgets
- **Jewelery** - Rings, necklaces, and accessories  
- **Men's Clothing** - Shirts, jackets, and casual wear
- **Women's Clothing** - Dresses, tops, and fashion items

### Sync Process
```bash
# Automatic sync during seeding
npm run seed

# Manual sync via API (Sellers/Admins only)
POST /api/products/sync-fakestore/:userId
```

## 🛠️ Development Features

### Automated Monitoring
- **Price Checking**: Every 5 minutes
- **Notification Processing**: Every 2 minutes
- **Alert Cleanup**: Configurable maintenance tasks

### Email Templates
- Professional HTML email templates
- Product images and details
- Direct links to products
- Unsubscribe options

### Error Handling
- Comprehensive error logging
- Graceful failure handling
- Retry mechanisms for notifications

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
FRONTEND_URL=https://your-domain.com
```

### Build for Production
```bash
npm run build
```

## 📱 Frontend URLs
- **Customer Portal**: http://localhost:5173/
- **Admin Dashboard**: http://localhost:5173/admin/dashboard
- **Seller Dashboard**: http://localhost:5173/seller/dashboard

## 🔧 Troubleshooting

### Common Issues

1. **Email notifications not working**:
   - Verify Gmail app password setup
   - Check EMAIL_USER and EMAIL_PASSWORD in .env
   - Enable 2-factor authentication on Gmail

2. **Alerts not triggering**:
   - Check server logs for scheduler activity
   - Verify MongoDB connection
   - Ensure products have seller references

3. **Payment issues**:
   - Verify Braintree credentials
   - Check sandbox vs production environment

### Database Migration
For existing installations, update products with seller references:
```javascript
db.products.updateMany(
  { seller: { $exists: false } },
  { $set: { seller: ObjectId("admin_user_id_here") } }
)
```

## 📊 Monitoring & Analytics

### Alert Statistics
- Total alerts created
- Active vs triggered alerts
- Notification delivery rates
- User engagement metrics

### Performance Monitoring
- Database query optimization
- Email delivery tracking
- Scheduler performance
- API response times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original MERN e-commerce foundation
- Alert system enhancements
- Community contributions

## 📞 Support

For technical support:
- Check the troubleshooting section
- Review server logs
- Open an issue on GitHub

---

**Note**: This enhanced version includes a complete price and stock alert system with email notifications, seller management, and automated monitoring capabilities.
