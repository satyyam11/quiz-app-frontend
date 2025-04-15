import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">B</div>
          <span className="logo-text">BrainBit</span>
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/quizzes" className="nav-link">Quizzes</Link>
              </li>
              <li className="nav-item">
                <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link login-btn">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link register-btn">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;