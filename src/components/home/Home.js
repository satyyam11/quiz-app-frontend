import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to BrainBit</h1>
        <p>Test your knowledge with our interactive quizzes</p>
        
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </div>
      
      <div className="features-section">
        {/* Features content */}
      </div>
    </div>
  );
};

export default Home;