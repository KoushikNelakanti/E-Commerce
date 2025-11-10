import React, { useState } from 'react';
import { forgotPassword } from './apiAuth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setLoading(true);
    setMessage('');

    forgotPassword({ email })
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
          setSuccess(false);
        } else {
          setMessage('Password reset email sent successfully! Please check your inbox.');
          setSuccess(true);
          setEmail('');
        }
        setLoading(false);
      })
      .catch(() => {
        setMessage('Failed to send reset email. Please try again.');
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
              <h4>🔐 Forgot Password</h4>
            </div>
            <div className="card-body">
              {!success ? (
                <>
                  <p className="text-muted text-center mb-4">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
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
                            Sending...
                          </>
                        ) : (
                          'Send Reset Link'
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="text-center mt-3">
                    <p>
                      Remember your password? <a href="/signin">Sign In</a>
                    </p>
                    <p>
                      Don't have an account? <a href="/signup">Sign Up</a>
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="alert alert-success">
                    <h5>✅ Email Sent!</h5>
                    <p>{message}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h6>What's next?</h6>
                    <ol className="text-start">
                      <li>Check your email inbox</li>
                      <li>Click the reset link in the email</li>
                      <li>Enter your new password</li>
                      <li>Sign in with your new password</li>
                    </ol>
                  </div>

                  <div className="mt-4">
                    <p>
                      Didn't receive the email? Check your spam folder or{' '}
                      <button 
                        className="btn btn-link p-0"
                        onClick={() => {
                          setSuccess(false);
                          setMessage('');
                        }}
                      >
                        try again
                      </button>
                    </p>
                  </div>

                  <div className="text-center mt-3">
                    <a href="/signin" className="btn btn-outline-primary">
                      Back to Sign In
                    </a>
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

export default ForgotPassword;
