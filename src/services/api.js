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
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({resolve, reject});
          })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
        }
        isRefreshing = true;
        try {
          const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
          const { access_token, refresh_token: newRefreshToken } = response.data;
          localStorage.setItem('token', access_token);
          if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken);
          }
          api.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
          processQueue(null, access_token);
          isRefreshing = false;
          originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          isRefreshing = false;
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(err);
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('token', access_token);
    if (refresh_token) {
      localStorage.setItem('refresh_token', refresh_token);
    }
    return response;
  },
  loginWithGoogleId: async ({ id_token }) => {
    try {
      const response = await api.post('/auth/google', { id_token });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('token', access_token);
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Google login failed',
      };
    }
  },
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

