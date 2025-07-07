import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import NewsDetailPage from './pages/NewsDetailPage';

// Auth Components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

// News Components
import NewsForm from './components/news/NewsForm';

// Video Components
import VideoUpload from './components/video/VideoUpload';
import VideoList from './components/video/VideoList';

// Admin Components
import AdminPanel from './components/admin/AdminPanel';

import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              
              {/* Protected Routes */}
              <Route 
                path="/submit-news" 
                element={
                  <ProtectedRoute>
                    <NewsForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/upload-video" 
                element={
                  <ProtectedRoute>
                    <VideoUpload />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-videos" 
                element={
                  <ProtectedRoute>
                    <VideoList />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Only Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

