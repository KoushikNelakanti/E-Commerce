# E-commerce Price & Stock Alert System

## Overview

This document describes the implementation of the Price & Stock Alert System for the MERN e-commerce application. The system allows users to set alerts for price drops and stock availability, and automatically notifies them when conditions are met.

## 4.1 Modules of the Project

### 4.1.1 User Management Module ✅
**Enhanced Features:**
- Added alert preferences (email, SMS, push notifications)
- Added phone number field for SMS notifications
- Maintains user alert history and preferences

**New Fields in User Model:**
```javascript
alertPreferences: {
  emailNotifications: Boolean (default: true),
  smsNotifications: Boolean (default: false),
  pushNotifications: Boolean (default: true)
},
phoneNumber: String
```

### 4.1.2 Product Management Module ✅
**Enhanced Features:**
- Added seller reference to track product ownership
- Price history tracking for trend analysis
- Stock history tracking for availability patterns
- Original price tracking for discount calculations

**New Fields in Product Model:**
```javascript
seller: ObjectId (ref: 'User', required: true),
originalPrice: Number,
priceHistory: [{ price: Number, date: Date }],
stockHistory: [{ quantity: Number, date: Date }]
```

### 4.1.3 Price & Stock Alert Module ✅
**Features:**
- Price drop alerts when product price falls below target
- Back-in-stock notifications when out-of-stock items become available
- Automatic alert triggering and notification sending
- Alert management (create, update, delete, view)

**Models:**
- **PriceAlert**: Tracks user price targets for products
- **StockAlert**: Tracks user stock availability requests

### 4.1.4 Seller Module ✅
**Features:**
- Seller dashboard with product statistics
- Product price and stock management
- Alert summary for seller's products
- Bulk product updates
- Integration with alert system for automatic notifications

## API Endpoints

### Alert Management

#### Price Alerts
- `POST /api/alert/price/:userId` - Create price alert
- `GET /api/alerts/price/:userId` - Get user's price alerts
- `PUT /api/alert/price/:alertId/:userId` - Update price alert
- `DELETE /api/alert/price/:alertId/:userId` - Delete price alert

#### Stock Alerts
- `POST /api/alert/stock/:userId` - Create stock alert
- `GET /api/alerts/stock/:userId` - Get user's stock alerts
- `PUT /api/alert/stock/:alertId/:userId` - Update stock alert
- `DELETE /api/alert/stock/:alertId/:userId` - Delete stock alert

#### Alert Statistics
- `GET /api/alerts/stats/:userId` - Get user's alert statistics

### Seller Management

#### Dashboard & Products
- `GET /api/seller/dashboard/:userId` - Get seller dashboard stats
- `GET /api/seller/products/:userId` - Get seller's products
- `PUT /api/seller/product/:productId/price/:userId` - Update product price
- `PUT /api/seller/product/:productId/stock/:userId` - Update product stock
- `POST /api/seller/products/bulk-update/:userId` - Bulk update products

#### Alert Management for Sellers
- `GET /api/seller/product/:productId/alerts/:userId` - Get alert summary for product

## Usage Examples

### Creating a Price Alert
```javascript
// POST /api/alert/price/:userId
{
  "productId": "product_id_here",
  "targetPrice": 99.99
}
```

### Creating a Stock Alert
```javascript
// POST /api/alert/stock/:userId
{
  "productId": "product_id_here",
  "stockThreshold": 0  // Alert when quantity > 0
}
```

### Updating Product Price (Seller)
```javascript
// PUT /api/seller/product/:productId/price/:userId
{
  "price": 89.99
}
```

### Bulk Product Update (Seller)
```javascript
// POST /api/seller/products/bulk-update/:userId
{
  "updates": [
    {
      "productId": "product1_id",
      "price": 79.99,
      "quantity": 50
    },
    {
      "productId": "product2_id",
      "price": 129.99
    }
  ]
}
```

## Environment Variables Required

Add these to your `.env` file:

```env
# Email Configuration for Notifications
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL for email links
FRONTEND_URL=http://localhost:5173
```

## Installation & Setup

1. **Install new dependencies:**
```bash
npm install nodemailer node-cron
```

2. **Configure email settings:**
   - Enable 2-factor authentication on Gmail
   - Generate an app password
   - Add EMAIL_USER and EMAIL_PASSWORD to .env

3. **Update existing products:**
   Since we added a required `seller` field to products, you'll need to update existing products:
```javascript
// Run this in MongoDB or create a migration script
db.products.updateMany(
  { seller: { $exists: false } },
  { $set: { seller: ObjectId("admin_user_id_here") } }
)
```

## System Architecture

### Alert Processing Flow
1. **Alert Creation**: Users create price/stock alerts through API
2. **Monitoring**: Scheduler checks alerts every 5 minutes
3. **Triggering**: When conditions are met, alerts are marked as triggered
4. **Notification**: Email notifications are sent to users
5. **Cleanup**: Old processed alerts are cleaned up periodically

### Notification System
- **Email Service**: Uses nodemailer with Gmail SMTP
- **Template System**: HTML email templates with product information
- **Delivery Tracking**: Tracks notification delivery status
- **Retry Logic**: Built-in error handling and retry mechanisms

### Scheduler System
- **Cron Jobs**: Uses node-cron for scheduled tasks
- **Alert Checking**: Every 5 minutes
- **Notification Processing**: Every 2 minutes
- **Cleanup Tasks**: Configurable maintenance tasks

## Monitoring & Maintenance

### Alert Statistics
Monitor system performance through:
- Total alerts created
- Active vs triggered alerts
- Notification delivery rates
- System performance metrics

### Maintenance Tasks
- Clean up old triggered alerts
- Monitor notification delivery rates
- Check scheduler health
- Database performance optimization

## Security Considerations

1. **Authentication**: All endpoints require user authentication
2. **Authorization**: Users can only manage their own alerts
3. **Rate Limiting**: Consider implementing rate limits for alert creation
4. **Email Security**: Use app passwords, not account passwords
5. **Data Privacy**: Respect user notification preferences

## Future Enhancements

1. **SMS Notifications**: Integration with Twilio or similar service
2. **Push Notifications**: Web push notifications for real-time alerts
3. **Advanced Filters**: More sophisticated alert conditions
4. **Analytics Dashboard**: Detailed analytics for sellers and admins
5. **Mobile App**: Native mobile app with push notifications

## Troubleshooting

### Common Issues

1. **Emails not sending:**
   - Check EMAIL_USER and EMAIL_PASSWORD in .env
   - Verify Gmail app password is correct
   - Check Gmail security settings

2. **Alerts not triggering:**
   - Verify scheduler is running
   - Check database connections
   - Review server logs for errors

3. **Performance issues:**
   - Monitor database query performance
   - Consider indexing optimization
   - Review scheduler frequency

### Logs and Debugging
- Server logs show scheduler activity
- Database queries can be monitored
- Email delivery status is tracked
- Error handling provides detailed error messages

## Support

For technical support or questions about the alert system implementation, refer to:
- Server logs for runtime issues
- Database logs for data-related problems
- Email service logs for notification issues
- API documentation for endpoint usage
