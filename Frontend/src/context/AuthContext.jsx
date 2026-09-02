import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. SAFELY parse localStorage to prevent JSON.parse crashes
    let storedUser = null;
    const storedToken = localStorage.getItem('token');
    
    try {
      const userStr = localStorage.getItem('user');
      // Check if it exists AND is not the literal string "undefined"
      if (userStr && userStr !== 'undefined') {
        storedUser = JSON.parse(userStr);
      } else {
        // If it's broken, clean it up
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error("Corrupted localStorage data found. Clearing...", error);
      localStorage.removeItem('user');
    }
    
    if (storedUser && storedToken && storedToken !== 'undefined') {
      setUser(storedUser);
      setToken(storedToken);
    } else {
      // Clean slate if things are messy
      localStorage.removeItem('token');
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    
    // Ensure we extract correctly based on how Node.js sends it
    // If your backend sends { _id, name, email, role, token }, then `data` IS the user.
    const userData = data.user ? data.user : { ...data };
    
    // Remove token from userData object if it's in there, just to keep it clean
    if (userData.token) delete userData.token;
    
    const userToken = data.token;

    setUser(userData);
    setToken(userToken);
    
    // Safely store to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    
    return userData;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    
    const userData = data.user ? data.user : { ...data };
    if (userData.token) delete userData.token;
    
    const userToken = data.token;

    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};