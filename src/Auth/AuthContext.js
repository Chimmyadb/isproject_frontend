import React, { createContext, useState, useContext } from 'react';

// Create a Context for Authentication
const AuthContext = createContext();

// Create a custom hook to access the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create a provider component to wrap your app and provide auth state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('token', 'your-jwt-token'); // Store the token in localStorage
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token'); // Remove the token from localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
