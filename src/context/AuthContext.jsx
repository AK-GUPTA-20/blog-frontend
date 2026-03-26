import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function sanitizeToken(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw || raw === 'null' || raw === 'undefined') return null;
  return raw;
}

function sanitizeUser(value) {
  return value && typeof value === 'object' ? value : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return sanitizeUser(JSON.parse(localStorage.getItem('velora_user'))); } catch { return null; }
  });
  const [token, setToken] = useState(() => sanitizeToken(localStorage.getItem('velora_token')));

  const login = (userData, tokenData) => {
    const safeUser = sanitizeUser(userData);
    const safeToken = sanitizeToken(tokenData);

    setUser(safeUser);
    setToken(safeToken);

    if (safeUser) {
      localStorage.setItem('velora_user', JSON.stringify(safeUser));
    } else {
      localStorage.removeItem('velora_user');
    }

    if (safeToken) {
      localStorage.setItem('velora_token', safeToken);
    } else {
      localStorage.removeItem('velora_token');
    }
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
