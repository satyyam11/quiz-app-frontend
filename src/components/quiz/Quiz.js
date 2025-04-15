import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css';

const Quiz = () => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizEnded, setQuizEnded] = useState(false);
  const [performance, setPerformance] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    startQuiz();
  }, []);
  
  const startQuiz = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in localStorage');
        setError('User ID not found. Please login again.');
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      
      console.log('Starting quiz for user:', userId);
      console.log('Using token:', token);
      
      // Try with fetch API instead of axios as an alternative approach
      try {
        const response = await fetch(`http://localhost:8080/quiz/take/${userId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Quiz question response:', data);
        
        setQuestion(data);
        setLoading(false);
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        
        // Fallback to axios if fetch fails
        console.log('Trying with axios as fallback...');
        const axiosResponse = await axios.post(`http://localhost:8080/quiz/take/${userId}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Axios response:', axiosResponse.data);
        setQuestion(axiosResponse.data);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error starting quiz:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error message:', err.message);
      }
      setError('Failed to start quiz. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };
  
  const submitAnswer = async () => {
    if (!selectedAnswer) {
      alert('Please select an answer');
      return;
    }
    
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      console.log('Submitting answer:', {
        questionId: question.id,
        answer: selectedAnswer
      });
      
      const submitResponse = await axios.post(`http://localhost:8080/quiz/submit/${userId}`, {
        questionId: question.id,
        answer: selectedAnswer
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Submit answer response:', submitResponse.data);
      
      // Get next question
      const nextQuestionResponse = await axios.post(`http://localhost:8080/quiz/take/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Next question response:', nextQuestionResponse.data);
      
      if (nextQuestionResponse.data && nextQuestionResponse.data.id) {
        setQuestion(nextQuestionResponse.data);
        setSelectedAnswer('');
        setLoading(false);
      } else {
        console.log('No more questions, ending quiz');
        endQuiz();
      }
    } catch (err) {
      console.error('Error submitting answer:', err.response?.data || err);
      setError('Failed to submit answer: ' + (err.response?.data?.message || err.message || 'Unknown error'));
      setLoading(false);
    }
  };
  
  const endQuiz = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      console.log('Ending quiz for user:', userId);
      
      const response = await axios.post(`http://localhost:8080/quiz/end/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('End quiz response:', response.data);
      
      setPerformance(response.data);
      setQuizEnded(true);
      setLoading(false);
    } catch (err) {
      console.error('Error ending quiz:', err.response?.data || err);
      setError('Failed to end quiz: ' + (err.response?.data?.message || err.message || 'Unknown error'));
      setLoading(false);
    }
  };
  
  const goToDashboard = () => {
    navigate('/dashboard');
  };
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  if (quizEnded) {
    return (
      <div className="quiz-container">
        <h1>Quiz Completed!</h1>
        <div className="quiz-results">
          <h2>Your Results</h2>
          <div className="result-stats">
            <div className="result-item">
              <span>Questions:</span>
              <span>{performance?.numberOfQuestions || 0}</span>
            </div>
            <div className="result-item">
              <span>Correct Answers:</span>
              <span>{performance?.correctAnswers || 0}</span>
            </div>
            <div className="result-item">
              <span>Score:</span>
              <span>{performance?.score || 0}%</span>
            </div>
            <div className="result-item">
              <span>Time Taken:</span>
              <span>{performance?.timeTaken || 0} seconds</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={goToDashboard}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="quiz-container">
      <h1>Quiz</h1>
      {question ? (
        <div className="question-container">
          <h2>{question.text}</h2>
          <div className="options-container">
            {question.options && question.options.map((option, index) => (
              <div 
                key={index}
                className={`option ${selectedAnswer === option ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
          <button 
            className="btn btn-primary submit-btn" 
            onClick={submitAnswer}
            disabled={!selectedAnswer}
          >
            Submit Answer
          </button>
        </div>
      ) : (
        <div>
          <p>No questions available. Please try again later.</p>
          <button className="btn btn-primary" onClick={goToDashboard}>
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;