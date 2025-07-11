import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!email) {
      return setError("Email is required");
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || 'Password reset link sent to your email.');
      } else {
        setError(result.message || 'Something went wrong.');
      }

    } catch (err) {
      console.error('Error:', err);
      setError('Server error occurred.');
    }
  };

  return (
    <>
      <style>{`
        .custom-hover-blue:hover {
          color: #0d6efd !important;
          text-decoration: underline;
          cursor: pointer;
        }

        .btn.custom-hover-blue:hover {
          background-color: #0d6efd;
          color: white !important;
          transition: all 0.3s ease;
        }
      `}</style>

      <div
        className="d-flex justify-content-center align-items-center text-white"
        style={{
          height: '100vh',
          width: '100vw',
          backgroundImage: `url("/home.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          className="rounded p-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            minWidth: '350px',
          }}
        >
          <h3 className="text-center mb-4">Forgot Password</h3>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Enter your email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-light w-100 custom-hover-blue">
              Send Reset Link
            </button>

            <div className="text-center mt-3">
              <Link to="/" className="text-light custom-hover-blue">Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
