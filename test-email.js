const NotificationService = require('./services/notificationService');
require('dotenv').config();

// Test email functionality
async function testEmailNotification() {
  console.log('Testing email notification system...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Configured' : 'Not configured');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Configured' : 'Not configured');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('\n❌ Email configuration missing!');
    console.log('Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
    console.log('For Gmail, use an App Password instead of your regular password');
    console.log('Guide: https://support.google.com/accounts/answer/185833');
    return;
  }

  const notificationService = new NotificationService();
  
  // Mock alert data for testing
  const mockAlert = {
    user: {
      email: process.env.EMAIL_USER, // Send test email to yourself
      alertPreferences: {
        emailNotifications: true
      }
    },
    product: {
      _id: 'test123',
      name: 'Test Product - iPhone 15 Pro Max',
      price: 99500
    },
    targetPrice: 95000,
    currentPrice: 99500
  };

  try {
    console.log('\n📧 Sending test price drop notification...');
    const result = await notificationService.sendPriceDropNotification(mockAlert);
    
    if (result !== false) {
      console.log('✅ Test email sent successfully!');
      console.log('Check your email inbox for the price drop alert.');
    } else {
      console.log('❌ Failed to send test email');
    }
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Tip: Make sure you\'re using an App Password for Gmail, not your regular password');
    }
  }
}

testEmailNotification();
