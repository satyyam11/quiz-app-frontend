import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css';

const QuizResults = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/results/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setResult(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!result) {
    return <div className="error">Result not found</div>;
  }

  const calculatePercentage = () => {
    return Math.round((result.score / result.totalQuestions) * 100);
  };

  const getResultMessage = () => {
    const percentage = calculatePercentage();
    if (percentage >= 90) return "Excellent! You're a quiz master!";
    if (percentage >= 70) return "Great job! You know your stuff!";
    if (percentage >= 50) return "Good effort! Keep learning!";
    return "Keep practicing! You'll improve next time!";
  };

  return (
    <div className="quiz-results-container">
      <h1>Quiz Results</h1>
      
      <div className="result-summary">
        <h2>{result.quizTitle}</h2>
        <div className="result-score">
          <div className="score-circle">
            <div className="score-number">{calculatePercentage()}%</div>
          </div>
          <p className="score-text">
            You scored {result.score} out of {result.totalQuestions}
          </p>
        </div>
        <p className="result-message">{getResultMessage()}</p>
      </div>
      
      <div className="result-details">
        <h3>Performance Details</h3>
        <div className="detail-item">
          <span>Time Taken:</span>
          <span>{result.timeTaken} minutes</span>
        </div>
        <div className="detail-item">
          <span>Correct Answers:</span>
          <span>{result.score}</span>
        </div>
        <div className="detail-item">
          <span>Incorrect Answers:</span>
          <span>{result.totalQuestions - result.score}</span>
        </div>
      </div>
      
      <div className="result-actions">
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        <Link to="/quizzes" className="btn btn-secondary">Take Another Quiz</Link>
      </div>
    </div>
  );
};

export default QuizResults;