# 🚀 Quick Start Guide

Get your MERN E-commerce with Price Alert System running in minutes!

## ⚡ Fast Setup (5 minutes)

### 1. Clone & Install
```bash
git clone https://github.com/ashraf-kabir/mern-ecommerce.git
cd mern-ecommerce
npm install
cd frontend && npm install && cd ..
```

### 2. Environment Setup
Copy `.env.example` to `.env` and update:
```env
MONGODB_URI=mongodb://localhost:27017/mern-ecommerce
JWT_SECRET=your_secret_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Config
Create `frontend/config.js`:
```javascript
export const API = 'http://localhost:5000/api';
```

### 4. Seed Database
```bash
npm run seed
```

### 5. Start Application
```bash
npm run dev
```

## 🎯 Ready to Use!

Visit: **http://localhost:5173**

### 🔐 Login Credentials

| Role | Email | Password | Access |
|------|-------|----------|---------|
| **Admin** | admin@ecommerce.com | admin123 | Full Control |
| **Seller** | seller@ecommerce.com | seller123 | Product Management |
| **Customer** | customer@ecommerce.com | customer123 | Shopping & Alerts |

## ✨ What You Get

- ✅ **20 Products** from Fake Store API
- ✅ **5 User Accounts** (Admin, Sellers, Customers)
- ✅ **4 Product Categories**
- ✅ **Price & Stock Alerts**
- ✅ **Email Notifications**
- ✅ **Forgot Password**
- ✅ **Shopping Cart**
- ✅ **Order Management**

## 🔧 Quick Commands

```bash
# Start development
npm run dev

# Seed database
npm run seed

# Seed only users
npm run seed:users

# Start backend only
npm run server

# Start frontend only
npm run frontend
```

## 🎮 Try These Features

### As Customer:
1. Browse products with filters
2. Set price alerts for expensive items
3. Set stock alerts for out-of-stock items
4. Add items to cart and checkout

### As Seller:
1. View seller dashboard
2. Update product prices (triggers alerts!)
3. Manage product stock
4. View alert statistics

### As Admin:
1. Access admin panel
2. Manage all products and users
3. View system statistics
4. Sync new products from Fake Store API

## 🆘 Need Help?

- **Email not working?** Check Gmail app password setup
- **Database issues?** Ensure MongoDB is running
- **Port conflicts?** Check if ports 5000/5173 are free
- **Seeding fails?** Verify MongoDB connection string

## 📚 Full Documentation

See `README.md` for complete documentation and advanced features.

---

**Happy coding! 🎉**
