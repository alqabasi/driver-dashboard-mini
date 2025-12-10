import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { LoginRequest } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addToast } = useToast();

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await api.auth.login(data);
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setIsAuthenticated(true);
        addToast('Welcome back!', 'success');
      }
    } catch (error: any) {
      console.error('Login failed', error);
      const msg = error.response?.status === 403 
        ? 'Account is inactive. Please contact support.' 
        : error.response?.status === 401 
        ? 'Invalid credentials.' 
        : 'Login failed. Please try again.';
      addToast(msg, 'error');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    addToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
