import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css';

const QuizDetail = () => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/quizzes/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setQuiz(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!quiz) {
    return <div className="error">Quiz not found</div>;
  }

  return (
    <div className="quiz-detail-container">
      <h1>{quiz.title}</h1>
      <div className="quiz-info">
        <p className="quiz-description">{quiz.description}</p>
        <div className="quiz-meta">
          <div className="meta-item">
            <i className="fas fa-question-circle"></i>
            <span>{quiz.questionCount} questions</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-clock"></i>
            <span>{quiz.timeLimit} minutes</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-trophy"></i>
            <span>{quiz.difficulty}</span>
          </div>
        </div>
      </div>
      <div className="quiz-actions">
        <Link to={`/take-quiz/${quiz.id}`} className="btn btn-primary">Start Quiz</Link>
        <Link to="/quizzes" className="btn btn-secondary">Back to Quizzes</Link>
      </div>
    </div>
  );
};

export default QuizDetail;