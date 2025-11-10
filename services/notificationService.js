const nodemailer = require('nodemailer');
const PriceAlert = require('../models/priceAlert');
const StockAlert = require('../models/stockAlert');

class NotificationService {
  constructor() {
    // Configure email transporter (using Gmail as example)
    this.emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send price drop notification
  async sendPriceDropNotification(alert) {
    try {
      const user = alert.user;
      const product = alert.product;

      if (user.alertPreferences?.emailNotifications !== false) {
        const emailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `Price Drop Alert: ${product.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #28a745;">🎉 Price Drop Alert!</h2>
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3>${product.name}</h3>
                <p><strong>Target Price:</strong> ₹${alert.targetPrice.toLocaleString('en-IN')}</p>
                <p><strong>Current Price:</strong> <span style="color: #28a745; font-size: 18px; font-weight: bold;">₹${product.price.toLocaleString('en-IN')}</span></p>
                <p><strong>You Save:</strong> ₹${(alert.targetPrice - product.price).toLocaleString('en-IN')}</p>
                <p style="margin-top: 20px;">
                  <a href="${process.env.FRONTEND_URL}/product/${product._id}" 
                     style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    View Product
                  </a>
                </p>
              </div>
              <p style="color: #666; font-size: 12px;">
                You received this notification because you set up a price alert for this product. 
                You can manage your alerts in your account settings.
              </p>
            </div>
          `,
        };

        await this.emailTransporter.sendMail(emailOptions);
      }

      // Mark notification as sent
      alert.notificationSent = true;
      await alert.save();

      return true;
    } catch (error) {
      console.error('Error sending price drop notification:', error);
      return false;
    }
  }

  // Send back in stock notification
  async sendBackInStockNotification(alert) {
    try {
      const user = alert.user;
      const product = alert.product;

      if (user.alertPreferences?.emailNotifications !== false) {
        const emailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `Back in Stock: ${product.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #17a2b8;">📦 Back in Stock!</h2>
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3>${product.name}</h3>
                <p><strong>Price:</strong> ₹${product.price.toLocaleString('en-IN')}</p>
                <p><strong>Available Quantity:</strong> ${product.quantity}</p>
                <p style="color: #28a745; font-weight: bold;">✅ This item is now back in stock!</p>
                <p style="margin-top: 20px;">
                  <a href="${process.env.FRONTEND_URL}/product/${product._id}" 
                     style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Buy Now
                  </a>
                </p>
              </div>
              <p style="color: #666; font-size: 12px;">
                You received this notification because you set up a stock alert for this product. 
                You can manage your alerts in your account settings.
              </p>
            </div>
          `,
        };

        await this.emailTransporter.sendMail(emailOptions);
      }

      // Mark notification as sent
      alert.notificationSent = true;
      await alert.save();

      return true;
    } catch (error) {
      console.error('Error sending back in stock notification:', error);
      return false;
    }
  }

  // Process all pending notifications
  async processPendingNotifications() {
    try {
      console.log('Processing pending notifications...');

      // Get triggered price alerts that haven't been notified
      const pendingPriceAlerts = await PriceAlert.find({
        isTriggered: true,
        notificationSent: false,
      })
        .populate('user', 'email alertPreferences')
        .populate('product', 'name price');

      // Get triggered stock alerts that haven't been notified
      const pendingStockAlerts = await StockAlert.find({
        isTriggered: true,
        notificationSent: false,
      })
        .populate('user', 'email alertPreferences')
        .populate('product', 'name price quantity');

      let successCount = 0;
      let errorCount = 0;

      // Process price alerts
      for (const alert of pendingPriceAlerts) {
        const success = await this.sendPriceDropNotification(alert);
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      // Process stock alerts
      for (const alert of pendingStockAlerts) {
        const success = await this.sendBackInStockNotification(alert);
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      console.log(`Notification processing complete: ${successCount} sent, ${errorCount} failed`);
      return { successCount, errorCount };
    } catch (error) {
      console.error('Error processing pending notifications:', error);
      return { successCount: 0, errorCount: 1 };
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(userEmail, resetUrl, userName) {
    try {
      const emailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Password Reset Request - E-commerce Store',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">🔐 Password Reset Request</h1>
              <p style="color: #666; font-size: 16px;">We received a request to reset your password</p>
            </div>
            
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin: 20px 0;">
              <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
                Hello <strong>${userName}</strong>,
              </p>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
                You requested a password reset for your e-commerce account. Click the button below to reset your password. 
                This link will expire in <strong>10 minutes</strong> for security reasons.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 25px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #007bff; word-break: break-all; font-size: 14px;">
                ${resetUrl}
              </p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; margin-bottom: 10px;">
                <strong>Security Notice:</strong>
              </p>
              <ul style="color: #666; font-size: 12px; margin: 0; padding-left: 20px;">
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>This link will expire in 10 minutes</li>
                <li>For security, never share this link with anyone</li>
                <li>Contact support if you have any concerns</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                This email was sent from E-commerce Store<br>
                If you have questions, contact our support team
              </p>
            </div>
          </div>
        `,
      };

      await this.emailTransporter.sendMail(emailOptions);
      console.log(`Password reset email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }

  // Send test notification
  async sendTestNotification(userEmail) {
    try {
      const emailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Test Notification - E-commerce Alert System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff;">🔔 Test Notification</h2>
            <p>This is a test notification from your e-commerce alert system.</p>
            <p>If you received this email, your notification system is working correctly!</p>
            <p style="color: #666; font-size: 12px;">
              This is a test message. No action is required.
            </p>
          </div>
        `,
      };

      await this.emailTransporter.sendMail(emailOptions);
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }

  // Get notification statistics
  async getNotificationStats() {
    try {
      const priceAlertStats = await PriceAlert.aggregate([
        {
          $group: {
            _id: null,
            totalTriggered: { $sum: { $cond: ['$isTriggered', 1, 0] } },
            totalNotified: { $sum: { $cond: ['$notificationSent', 1, 0] } },
            pending: {
              $sum: {
                $cond: [
                  { $and: ['$isTriggered', { $not: '$notificationSent' }] },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);

      const stockAlertStats = await StockAlert.aggregate([
        {
          $group: {
            _id: null,
            totalTriggered: { $sum: { $cond: ['$isTriggered', 1, 0] } },
            totalNotified: { $sum: { $cond: ['$notificationSent', 1, 0] } },
            pending: {
              $sum: {
                $cond: [
                  { $and: ['$isTriggered', { $not: '$notificationSent' }] },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);

      return {
        priceAlerts: priceAlertStats[0] || { totalTriggered: 0, totalNotified: 0, pending: 0 },
        stockAlerts: stockAlertStats[0] || { totalTriggered: 0, totalNotified: 0, pending: 0 },
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return null;
    }
  }
}

module.exports = new NotificationService();
