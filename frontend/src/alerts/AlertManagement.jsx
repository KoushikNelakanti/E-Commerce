import React, { useState, useEffect } from 'react';
import { 
  getUserPriceAlerts, 
  getUserStockAlerts, 
  deletePriceAlert, 
  deleteStockAlert,
  updatePriceAlert,
  getAlertStats 
} from './apiAlerts';
import { isAuthenticated } from '../auth';
import { API } from '../config';

const AlertManagement = () => {
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('price');
  const [editingAlert, setEditingAlert] = useState(null);
  const [newTargetPrice, setNewTargetPrice] = useState('');

  const { user, token } = isAuthenticated();

  useEffect(() => {
    if (user && token) {
      loadAlerts();
      loadStats();
    }
  }, [user, token]);

  const loadAlerts = () => {
    setLoading(true);
    
    Promise.all([
      getUserPriceAlerts(user._id, token),
      getUserStockAlerts(user._id, token)
    ])
    .then(([priceData, stockData]) => {
      if (!priceData.error) setPriceAlerts(priceData);
      if (!stockData.error) setStockAlerts(stockData);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  };

  const loadStats = () => {
    getAlertStats(user._id, token)
      .then((data) => {
        if (!data.error) {
          setStats(data);
        }
      });
  };

  const handleDeletePriceAlert = (alertId) => {
    if (window.confirm('Are you sure you want to delete this price alert?')) {
      deletePriceAlert(alertId, user._id, token)
        .then((data) => {
          if (!data.error) {
            setPriceAlerts(priceAlerts.filter(alert => alert._id !== alertId));
            loadStats();
          }
        });
    }
  };

  const handleDeleteStockAlert = (alertId) => {
    if (window.confirm('Are you sure you want to delete this stock alert?')) {
      deleteStockAlert(alertId, user._id, token)
        .then((data) => {
          if (!data.error) {
            setStockAlerts(stockAlerts.filter(alert => alert._id !== alertId));
            loadStats();
          }
        });
    }
  };

  const handleUpdatePriceAlert = (alertId) => {
    if (!newTargetPrice || parseFloat(newTargetPrice) <= 0) {
      alert('Please enter a valid target price');
      return;
    }

    updatePriceAlert(alertId, user._id, token, { targetPrice: parseFloat(newTargetPrice) })
      .then((data) => {
        if (!data.error) {
          setPriceAlerts(priceAlerts.map(alert => 
            alert._id === alertId ? { ...alert, targetPrice: parseFloat(newTargetPrice) } : alert
          ));
          setEditingAlert(null);
          setNewTargetPrice('');
        }
      });
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">
          <p>Please <a href="/signin">sign in</a> to manage your alerts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <h2>My Alerts</h2>
          
          {/* Stats Cards */}
          {stats && (
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{stats.priceAlerts.active}</h5>
                    <p className="card-text">Active Price Alerts</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title text-success">{stats.priceAlerts.triggered}</h5>
                    <p className="card-text">Triggered Price Alerts</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title text-info">{stats.stockAlerts.active}</h5>
                    <p className="card-text">Active Stock Alerts</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title text-warning">{stats.stockAlerts.triggered}</h5>
                    <p className="card-text">Triggered Stock Alerts</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'price' ? 'active' : ''}`}
                onClick={() => setActiveTab('price')}
              >
                Price Alerts ({priceAlerts.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'stock' ? 'active' : ''}`}
                onClick={() => setActiveTab('stock')}
              >
                Stock Alerts ({stockAlerts.length})
              </button>
            </li>
          </ul>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="tab-content">
              {/* Price Alerts Tab */}
              {activeTab === 'price' && (
                <div className="tab-pane active">
                  {priceAlerts.length === 0 ? (
                    <div className="alert alert-info">
                      <p>No price alerts set. Browse products and set price alerts to get notified when prices drop!</p>
                    </div>
                  ) : (
                    <div className="row">
                      {priceAlerts.map((alert) => (
                        <div key={alert._id} className="col-md-6 mb-3">
                          <div className={`card ${alert.isTriggered ? 'border-success' : ''}`}>
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <h6 className="card-title">{alert.product.name}</h6>
                                  <p className="card-text">
                                    <small className="text-muted">
                                      Current Price: <strong>${alert.currentPrice}</strong><br/>
                                      Target Price: <strong>${alert.targetPrice}</strong>
                                    </small>
                                  </p>
                                  {alert.isTriggered && (
                                    <span className="badge bg-success">Alert Triggered!</span>
                                  )}
                                </div>
                                {alert.product.photo && alert.product.photo.data ? (
                                  <img 
                                    src={`${API}/product/photo/${alert.product._id}`}
                                    alt={alert.product.name}
                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                    className="rounded"
                                  />
                                ) : alert.product.imageUrl ? (
                                  <img 
                                    src={alert.product.imageUrl}
                                    alt={alert.product.name}
                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                    className="rounded"
                                  />
                                ) : null}
                              </div>
                              
                              <div className="mt-3">
                                {editingAlert === alert._id ? (
                                  <div className="d-flex gap-2">
                                    <input
                                      type="number"
                                      step="0.01"
                                      className="form-control form-control-sm"
                                      value={newTargetPrice}
                                      onChange={(e) => setNewTargetPrice(e.target.value)}
                                      placeholder="New target price"
                                    />
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => handleUpdatePriceAlert(alert._id)}
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="btn btn-secondary btn-sm"
                                      onClick={() => {
                                        setEditingAlert(null);
                                        setNewTargetPrice('');
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => {
                                        setEditingAlert(alert._id);
                                        setNewTargetPrice(alert.targetPrice);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeletePriceAlert(alert._id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Stock Alerts Tab */}
              {activeTab === 'stock' && (
                <div className="tab-pane active">
                  {stockAlerts.length === 0 ? (
                    <div className="alert alert-info">
                      <p>No stock alerts set. Set alerts for out-of-stock products to get notified when they're available!</p>
                    </div>
                  ) : (
                    <div className="row">
                      {stockAlerts.map((alert) => (
                        <div key={alert._id} className="col-md-6 mb-3">
                          <div className={`card ${alert.isTriggered ? 'border-success' : ''}`}>
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <h6 className="card-title">{alert.product.name}</h6>
                                  <p className="card-text">
                                    <small className="text-muted">
                                      Current Stock: <strong>{alert.product.quantity}</strong>
                                    </small>
                                  </p>
                                  {alert.isTriggered && (
                                    <span className="badge bg-success">Back in Stock!</span>
                                  )}
                                </div>
                                {alert.product.photo && alert.product.photo.data ? (
                                  <img 
                                    src={`${API}/product/photo/${alert.product._id}`}
                                    alt={alert.product.name}
                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                    className="rounded"
                                  />
                                ) : alert.product.imageUrl ? (
                                  <img 
                                    src={alert.product.imageUrl}
                                    alt={alert.product.name}
                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                    className="rounded"
                                  />
                                ) : null}
                              </div>
                              
                              <div className="mt-3">
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteStockAlert(alert._id)}
                                >
                                  Delete Alert
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertManagement;
