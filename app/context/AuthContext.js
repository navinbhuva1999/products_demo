'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    users: [],
    currentUser: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('users');
    
    if (storedUser) {
       const cUser = localStorage.getItem('user');
      const users = JSON.parse(storedUser);
      setAuthState({
        users,
        isAuthenticated: cUser ? true : false,
        isLoading: false,
        currentUser: cUser ? JSON.parse(cUser) : null,
        error: null
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials) => {
    try {
      
      const user = authState.users.find(
        (u) => u.userName.toLowerCase() === credentials.userName.toLowerCase()
      );

      if (!user) {
        setAuthState(prev => ({
          ...prev,
          error: "User not found"
        }));
        return false;
      }

      localStorage.setItem("user", JSON.stringify(user));
      setAuthState({
        ...authState,
        isLoading: false,
        isAuthenticated: true,
        currentUser: user,
        error: null
      });
      
      router.replace('/');
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: "An error occurred during login. Please try again."
      }));
      return false;
    }
  };

  const register = async (credentials) => {
    try {
      
      const userExists = authState.users.some(
        (u) => u.userName.toLowerCase() === credentials.userName.toLowerCase()
      );

      if (userExists) {
        setAuthState(prev => ({
          ...prev,
          error: "Username already exists. Please choose a different username."
        }));
        return false;
      }

      const newUser = {
        password: credentials.password,
        userName: credentials.userName,
      };

      const updatedUsers = [...(authState.users || []), newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setAuthState({
        users: updatedUsers,
        isAuthenticated: true,
        isLoading: false,
        currentUser: newUser,
        error: null
      });

      router.replace('/');
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: "An error occurred during registration. Please try again."
      }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: false,
      currentUser: null,
      error: null
    }));
    router.replace('/login');
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, register, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 