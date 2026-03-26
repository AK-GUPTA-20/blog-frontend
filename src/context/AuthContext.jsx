import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('velora_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('velora_token') || null);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('velora_user', JSON.stringify(userData));
    localStorage.setItem('velora_token', tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('velora_user');
    localStorage.removeItem('velora_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
