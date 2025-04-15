import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css';

const TakeQuiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/quizzes/${id}/questions`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setQuiz(res.data.quiz);
        setQuestions(res.data.questions);
        setTimeLeft(res.data.quiz.timeLimit * 60);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId
    });
  };

  const goToNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  const submitQuiz = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/quizzes/${id}/submit`,
        { answers },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      navigate(`/results/${res.data.resultId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!quiz || questions.length === 0) {
    return <div className="error">Quiz not found or no questions available</div>;
  }

  const question = questions[currentQuestion];

  return (
    <div className="take-quiz-container">
      <div className="quiz-header">
        <h1>{quiz.title}</h1>
        <div className="quiz-timer">Time Left: {formatTime(timeLeft)}</div>
      </div>
      
      <div className="quiz-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>
      
      <div className="quiz-question">
        <h2>{question.text}</h2>
        <div className="quiz-options">
          {question.options.map((option) => (
            <div 
              key={option.id} 
              className={`quiz-option ${answers[question.id] === option.id ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(question.id, option.id)}
            >
              {option.text}
            </div>
          ))}
        </div>
      </div>
      
      <div className="quiz-navigation">
        {currentQuestion > 0 && (
          <button className="btn btn-secondary" onClick={goToPreviousQuestion}>
            Previous
          </button>
        )}
        
        {currentQuestion < questions.length - 1 ? (
          <button className="btn btn-primary" onClick={goToNextQuestion}>
            Next
          </button>
        ) : (
          <button className="btn btn-success" onClick={submitQuiz}>
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;