import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from './apiAuth';
import { authenticate } from '../auth';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    resetPassword(token, { password })
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
          setSuccess(false);
        } else {
          setMessage('Password reset successful! You are now logged in.');
          setSuccess(true);
          
          // Authenticate user automatically
          if (data.token && data.user) {
            authenticate(data, () => {
              setTimeout(() => {
                navigate('/user/dashboard');
              }, 2000);
            });
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setMessage('Failed to reset password. Please try again.');
        setLoading(false);
        setSuccess(false);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h4>🔑 Reset Password</h4>
            </div>
            <div className="card-body">
              {!success ? (
                <>
                  <p className="text-muted text-center mb-4">
                    Enter your new password below.
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        minLength="6"
                      />
                      <small className="form-text text-muted">
                        Password must be at least 6 characters long
                      </small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        minLength="6"
                      />
                    </div>

                    {message && (
                      <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`}>
                        {message}
                      </div>
                    )}

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Resetting...
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="text-center mt-3">
                    <p>
                      Remember your password? <a href="/signin">Sign In</a>
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="alert alert-success">
                    <h5>✅ Password Reset Successful!</h5>
                    <p>{message}</p>
                    <p>Redirecting to your dashboard...</p>
                  </div>
                  
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
