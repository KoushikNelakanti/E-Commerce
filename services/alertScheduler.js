const cron = require('node-cron');
const Product = require('../models/product');
const PriceAlert = require('../models/priceAlert');
const StockAlert = require('../models/stockAlert');
const notificationService = require('./notificationService');

class AlertScheduler {
  constructor() {
    this.isRunning = false;
    this.jobs = [];
  }

  // Check for price changes and trigger alerts
  async checkPriceAlerts() {
    try {
      console.log('Checking price alerts...');

      // Get all active price alerts
      const activeAlerts = await PriceAlert.find({
        isActive: true,
        isTriggered: false,
      }).populate('product', 'price');

      let triggeredCount = 0;

      for (const alert of activeAlerts) {
        const currentPrice = alert.product.price;
        
        // Check if current price meets the alert condition
        if (currentPrice <= alert.targetPrice) {
          alert.isTriggered = true;
          alert.triggeredAt = new Date();
          alert.currentPrice = currentPrice;
          await alert.save();
          
          triggeredCount++;
          console.log(`Price alert triggered for product ${alert.product._id}: $${currentPrice} <= $${alert.targetPrice}`);
        } else {
          // Update current price for tracking
          alert.currentPrice = currentPrice;
          await alert.save();
        }
      }

      console.log(`Price alerts check complete: ${triggeredCount} alerts triggered`);
      return triggeredCount;
    } catch (error) {
      console.error('Error checking price alerts:', error);
      return 0;
    }
  }

  // Check for stock changes and trigger alerts
  async checkStockAlerts() {
    try {
      console.log('Checking stock alerts...');

      // Get all active stock alerts
      const activeAlerts = await StockAlert.find({
        isActive: true,
        isTriggered: false,
      }).populate('product', 'quantity');

      let triggeredCount = 0;

      for (const alert of activeAlerts) {
        const currentStock = alert.product.quantity;
        
        // Check if item is back in stock (quantity > threshold)
        if (currentStock > alert.stockThreshold) {
          alert.isTriggered = true;
          alert.triggeredAt = new Date();
          await alert.save();
          
          triggeredCount++;
          console.log(`Stock alert triggered for product ${alert.product._id}: quantity ${currentStock} > ${alert.stockThreshold}`);
        }
      }

      console.log(`Stock alerts check complete: ${triggeredCount} alerts triggered`);
      return triggeredCount;
    } catch (error) {
      console.error('Error checking stock alerts:', error);
      return 0;
    }
  }

  // Main alert checking function
  async checkAllAlerts() {
    if (this.isRunning) {
      console.log('Alert check already running, skipping...');
      return;
    }

    this.isRunning = true;
    try {
      console.log('Starting alert check cycle...');
      
      const priceAlertsTriggered = await this.checkPriceAlerts();
      const stockAlertsTriggered = await this.checkStockAlerts();
      
      // Process notifications if any alerts were triggered
      if (priceAlertsTriggered > 0 || stockAlertsTriggered > 0) {
        console.log('Processing triggered notifications...');
        await notificationService.processPendingNotifications();
      }

      console.log('Alert check cycle completed');
    } catch (error) {
      console.error('Error in alert check cycle:', error);
    } finally {
      this.isRunning = false;
    }
  }

  // Start the scheduler
  start() {
    console.log('Starting Alert Scheduler...');

    // Check alerts every 5 minutes
    const alertCheckJob = cron.schedule('*/5 * * * *', () => {
      this.checkAllAlerts();
    }, {
      scheduled: false
    });

    // Process notifications every 2 minutes (for any missed triggers)
    const notificationJob = cron.schedule('*/2 * * * *', () => {
      notificationService.processPendingNotifications();
    }, {
      scheduled: false
    });

    // Start the jobs
    alertCheckJob.start();
    notificationJob.start();

    this.jobs.push(alertCheckJob, notificationJob);

    console.log('Alert Scheduler started');
    console.log('- Alert checks: every 5 minutes');
    console.log('- Notification processing: every 2 minutes');

    // Run initial check
    setTimeout(() => {
      this.checkAllAlerts();
    }, 5000); // Wait 5 seconds after startup
  }

  // Stop the scheduler
  stop() {
    console.log('Stopping Alert Scheduler...');
    
    this.jobs.forEach(job => {
      job.stop();
    });
    
    this.jobs = [];
    console.log('Alert Scheduler stopped');
  }

  // Manual trigger for testing
  async manualCheck() {
    console.log('Manual alert check triggered...');
    await this.checkAllAlerts();
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeJobs: this.jobs.length,
      lastCheck: new Date().toISOString(),
    };
  }

  // Clean up old triggered alerts (optional maintenance)
  async cleanupOldAlerts(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const priceAlertsDeleted = await PriceAlert.deleteMany({
        isTriggered: true,
        notificationSent: true,
        triggeredAt: { $lt: cutoffDate },
      });

      const stockAlertsDeleted = await StockAlert.deleteMany({
        isTriggered: true,
        notificationSent: true,
        triggeredAt: { $lt: cutoffDate },
      });

      console.log(`Cleanup completed: ${priceAlertsDeleted.deletedCount} price alerts, ${stockAlertsDeleted.deletedCount} stock alerts removed`);
      
      return {
        priceAlertsDeleted: priceAlertsDeleted.deletedCount,
        stockAlertsDeleted: stockAlertsDeleted.deletedCount,
      };
    } catch (error) {
      console.error('Error during alert cleanup:', error);
      return { error: error.message };
    }
  }
}

module.exports = new AlertScheduler();
