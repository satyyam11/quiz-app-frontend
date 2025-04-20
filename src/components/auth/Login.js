import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Make sure we're sending the exact format expected by the backend
      const loginData = {
        username,
        password
      };
      
      console.log('Attempting login with:', loginData);
      
      const res = await axios.post('https://quizapp-8pi9.onrender.com/api/auth/login', loginData);
      
      console.log('Login response:', res.data);
      
      // Store the token in localStorage
      localStorage.setItem('token', res.data.token);
      
      // Try to get user info
      try {
        const userRes = await axios.get('https://quizapp-8pi9.onrender.com/user/me', {
          headers: {
            'Authorization': `Bearer ${res.data.token}`
          }
        });
        
        localStorage.setItem('userId', userRes.data.id);
      } catch (userErr) {
        console.error('Error fetching user data:', userErr);
        // If we can't get the user ID, we'll use a default approach
        // This is a fallback and might need adjustment based on your backend
      }
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Invalid credentials. Please check your username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Login</h1>
      <p className="auth-subtitle">Sign in to your account</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="auth-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="auth-redirect">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;