import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/quizzes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setQuizzes(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="quiz-list-container">
      <h1>Available Quizzes</h1>
      <div className="quiz-list">
        {quizzes.length > 0 ? (
          quizzes.map(quiz => (
            <div key={quiz.id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <div className="quiz-meta">
                <span>{quiz.questionCount} questions</span>
                <span>{quiz.timeLimit} minutes</span>
              </div>
              <Link to={`/quizzes/${quiz.id}`} className="btn btn-primary">View Details</Link>
            </div>
          ))
        ) : (
          <p>No quizzes available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default QuizList;