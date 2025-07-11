import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password || !role) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Login successful');

        // Store data in localStorage
        localStorage.setItem('user', JSON.stringify(result));
        localStorage.setItem('name', result.name);
        localStorage.setItem('email', result.email);
        localStorage.setItem('role', result.role);

        // Redirect based on role
        if (result.role === 'student') {
          navigate('/jobseeker');
        } else if (result.role === 'recruiter') {
          navigate('/dashboard');
        } else {
          setError('Please select a valid role');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong');
    }
  };

  return (
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
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', minWidth: '350px' }}
      >
        <h3 className="text-center mb-4">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Select Role</label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">-- Choose Role --</option>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-light w-100">Login</button>
        </form>

        <div className="d-flex justify-content-between mt-3">
          <Link to="/forgot" className="text-decoration-none text-light">Forgot Password?</Link>
          <Link to="/register" className="text-decoration-none text-light">New User</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
