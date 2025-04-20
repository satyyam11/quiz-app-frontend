import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setError('Passwords do not match');
    } else {
      setLoading(true);
      try {
        const newUser = {
          username,
          email,
          password
        };
        
        const res = await axios.post('https://quizapp-8pi9.onrender.com/api/auth/register', newUser);
        
        // After successful registration, login the user
        const loginRes = await axios.post('https://quizapp-8pi9.onrender.com/api/auth/login', {
          username,
          password
        });
        
        // Store the token in localStorage
        localStorage.setItem('token', loginRes.data.token);
        
        // Store user ID for future requests
        localStorage.setItem('userId', res.data.id);
        
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
        console.error(err.response?.data || err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Register</h1>
      <p className="auth-subtitle">Create your account</p>
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
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
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            id="password2"
            value={password2}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="auth-redirect">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;