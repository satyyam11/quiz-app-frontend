import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Removed useNavigate since it's not used
import axios from 'axios';
import './Dashboard.css';
import { FaUser } from 'react-icons/fa'; // Removed FaSignOutAlt since it's not used

const Dashboard = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('User');
  // Removed the navigate variable since it's not being used
  
  const fetchDashboardData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
      
      if (storedUsername) {
        setUsername(storedUsername);
      }
      
      if (!userId || !token) {
        setError('Authentication information missing. Please login again.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching dashboard data for user:', userId);
      
      const response = await axios.get(`https://quizapp-8pi9.onrender.com/dashboard/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Dashboard data:', response.data);
      
      // Process the data
      const processedData = {
        ...response.data,
        numberOfQuestions: response.data.totalQuestions || response.data.numberOfQuestions || response.data.correctAnswers || 0,
        correctAnswers: response.data.correctAnswers || 0,
        score: response.data.score ? Math.round(response.data.score * 100) / 100 : 0
      };
      
      console.log('Processed dashboard data:', processedData);
      setPerformance(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up an interval to refresh data every 10 seconds
    const intervalId = setInterval(fetchDashboardData, 10000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);
  
  // Removed the handleLogout function since it's not used
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const hasQuizData = performance && (performance.numberOfQuestions > 0 || performance.correctAnswers > 0);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-profile">
          <div className="user-avatar">
            <FaUser />
          </div>
          <h2>Welcome, {username}!</h2>
        </div>
      </div>
      
      <h1>Dashboard</h1>
      
      {hasQuizData ? (
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{performance.numberOfQuestions || '0'}</div>
            <div className="stat-label">Questions Attempted</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{performance.correctAnswers || '0'}</div>
            <div className="stat-label">Correct Answers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{performance.score?.toFixed(2) || '0'}%</div>
            <div className="stat-label">Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{performance.timeTaken || '0'}s</div>
            <div className="stat-label">Time Taken</div>
          </div>
        </div>
      ) : (
        <div className="empty-dashboard">
          <div className="empty-icon">🧠</div>
          <h2>Oops! Nothing here yet</h2>
          <p>You haven't taken any quizzes yet. Start your learning journey by taking your first quiz!</p>
        </div>
      )}
      
      <div className="dashboard-actions">
        <Link to="/quiz/take" className="btn btn-primary">Take a Quiz</Link>
      </div>
    </div>
  );
};

export default Dashboard;