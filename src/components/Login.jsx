import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call your FastAPI gateway (adjust URL if needed)
      const response = await fetch('http://localhost:8000/authservice/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (data.code === 200 && data.jwt) {
        // Save authentication data
        localStorage.setItem('token', data.jwt);
        localStorage.setItem('role', data.role);
        localStorage.setItem('email', username);               // ✅ store email
        localStorage.setItem('fullname', data.fullname || username.split('@')[0]); // fallback

        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Student Information System</h2>
        <h3>Login</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email / Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </div>
        
        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <p>Admin: admin@gmail.com / admin123</p>
          <p>Teacher: teacher@gmail.com / teacher123</p>
          <p>Student: john@student.com / student123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;