import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/users/me'),
};

// News API
export const newsAPI = {
  getApprovedNews: (page = 0, size = 10) => 
    api.get(`/news?page=${page}&size=${size}`),
  getNewsById: (id) => api.get(`/news/${id}`),
  createNews: (newsData) => api.post('/news', newsData),
  updateNews: (id, newsData) => api.put(`/news/${id}`, newsData),
  deleteNews: (id) => api.delete(`/news/${id}`),
};

// Admin API
export const adminAPI = {
  getPendingNews: () => api.get('/admin/news/pending'),
  approveNews: (id) => api.put(`/admin/news/${id}/approve`),
  rejectNews: (id) => api.put(`/admin/news/${id}/reject`),
  getAllUsers: () => api.get('/users'),
};

// Video API
export const videoAPI = {
  uploadVideo: (formData) => 
    api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getUserVideos: () => api.get('/videos'),
  deleteVideo: (id) => api.delete(`/videos/${id}`),
  getVideoStream: (id) => `${API_BASE_URL}/videos/${id}`,
};

export default api;

