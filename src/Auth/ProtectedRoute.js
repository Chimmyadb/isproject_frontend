import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the useAuth hook

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Get the authentication status

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children; // If authenticated, render the protected content
};

export default ProtectedRoute;
