import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { motion } from 'framer-motion';

const Home = () => {
  useEffect(() => {
    // Add a class to the body for background effects
    document.body.classList.add('home-page');
    
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  return (
    <div className="home-container">
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Welcome to BrainBit
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Test your knowledge with our interactive quizzes
        </motion.p>
        <motion.div 
          className="hero-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Link to="/register" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </motion.div>
      </motion.div>

      <motion.div 
        className="features-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="feature-cards">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/quiz/take" className="feature-card">
              <h3>Take Quizzes</h3>
              <p>Challenge yourself with a variety of quizzes across different topics</p>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/dashboard" className="feature-card">
              <h3>Track Progress</h3>
              <p>Monitor your performance and see how you improve over time</p>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/leaderboard" className="feature-card">
              <h3>Compete</h3>
              <p>Join leaderboards and compete with other quiz enthusiasts</p>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;