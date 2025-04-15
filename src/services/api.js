import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getCurrentUser: () => api.get('/user/me')
};

// Quiz services
export const quizService = {
  startQuiz: (userId) => api.post(`/quiz/take/${userId}`),
  submitAnswer: (userId, questionId, answer) => 
    api.post(`/quiz/submit/${userId}`, { questionId, answer }),
  endQuiz: (userId) => api.post(`/quiz/end/${userId}`)
};

// User services
export const userService = {
  getUserById: (userId) => api.get(`/user/${userId}`),
  getAllUsers: () => api.get('/user/all')
};

// Dashboard services
export const dashboardService = {
  getUserPerformance: (userId) => api.get(`/dashboard/${userId}`)
};

export default api;