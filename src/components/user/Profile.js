import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './User.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      const res = await axios.put(
        'http://localhost:8080/api/users/profile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setUser(res.data);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response.data.message || 'Error updating profile');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div className="error">Unable to load profile</div>;
  }

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="profile-content">
        <div className="profile-info">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="profile-details">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="profile-form">
          <h3>Edit Profile</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
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
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={formData.currentPassword}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;