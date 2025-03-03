'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

const setCookie = () => {

}
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    users: [],
    currentUser: null,
    isAuthenticated: false,
    isLoading: true,
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
        currentUser : cUser
      });
    //   setCookie('users', storedUser);
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials) => {
    try {
      const mockUser = {
        password: credentials.password,
        userName: credentials.userName,
      };

      const checkAuth = authState.users.find((user) => user.userName === mockUser.userName && user.password)

      console.log("check..", checkAuth)
      
     if(checkAuth){
        localStorage.setItem("user", JSON.stringify((checkAuth)))

        setAuthState({
            ...authState, isLoading : false, isAuthenticated : true, currentUser : mockUser
        })
        router.replace('/');
     }
     else {

     }

    
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (credentials) => {
    try {
      const mockUser = {
        password: credentials.password,
        userName: credentials.userName,
      };
      const usersData = authState.users || []
      const userStr = [...usersData, mockUser]
    
      localStorage.setItem('users', JSON.stringify(userStr));
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setAuthState({
        user: userStr,
        isAuthenticated: true,
        isLoading: false,
        currentUser : mockUser
      });

      router.replace('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('users');
    setAuthState({
      user: [],
      isAuthenticated: false,
      isLoading: false,
      currentUser : null
    });
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, register }}>
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