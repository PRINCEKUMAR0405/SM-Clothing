import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const stored = localStorage.getItem('sm_user');
  const storedToken = localStorage.getItem('sm_token');
  const [user, setUser] = useState(stored ? JSON.parse(stored) : null);
  const [token, setToken] = useState(storedToken || null);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('sm_user', JSON.stringify(userData));
    localStorage.setItem('sm_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sm_user');
    localStorage.removeItem('sm_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
