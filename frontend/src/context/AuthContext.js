import React, { createContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on page load
  useEffect(() => {
    const userFromStorage = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;
    
    setUser(userFromStorage);
    setLoading(false);
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await userAPI.login({
        email,
        password
      });
      
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await userAPI.register({
        name,
        email,
        password
      });
      
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};