import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles'; 
import theme from './theme'; 
import Dashboard from './pages/Dashboard';
import Profile from './components/Profile';
import Students from './components/Students';
import Attendance from './pages/Attendance';
import Login from './pages/Login';
import Subject from './pages/Subject';
import ClassLevel from './pages/ClassLevel';
import Teacher from './pages/Teacher';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './Auth/AuthContext';

const App = () => {
  return (
    <ThemeProvider theme={theme}> {/* Wrap the app in ThemeProvider */}
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} /> 
              <Route path="/student" element={<Students />} />
              <Route path="/teacher" element={<Teacher />} />
              <Route path="/subject" element={<Subject />} />
              <Route path="/classlevel" element={<ClassLevel />} />
              <Route path="/attendance" element={<Attendance />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;