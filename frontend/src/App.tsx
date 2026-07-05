import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './mockFirebase';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import StudyPlanner from './pages/StudyPlanner';
import ToDoList from './pages/ToDoList';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Protected Route Guard
interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = auth.getCurrentUser();
  
  if (!user) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  // Wrap route with Sidebar/Header Layout
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Private / Guarded Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/planner" 
          element={
            <ProtectedRoute>
              <StudyPlanner />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/todo" 
          element={
            <ProtectedRoute>
              <ToDoList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
