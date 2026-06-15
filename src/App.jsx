import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import StudentManager from './components/StudentManager';
import UserManager from './components/UserManager';
import Feedback from './components/Feedback';  // Add this import
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/';
    return null;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/students" element={
          <PrivateRoute>
            <StudentManager />
          </PrivateRoute>
        } />
        <Route path="/users" element={
          <PrivateRoute>
            <UserManager />
          </PrivateRoute>
        } />
        <Route path="/feedback" element={
          <PrivateRoute>
            <Feedback />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;