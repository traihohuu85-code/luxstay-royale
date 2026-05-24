import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import http from '../api/http';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem('luxstay_user');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    return JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem('luxstay_user');
    localStorage.removeItem('luxstay_token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem('luxstay_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    http.get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem('luxstay_user', JSON.stringify(res.data.user));
      })
      .catch(() => logout());
  }, []);

  const saveSession = (accessToken, currentUser) => {
    setToken(accessToken);
    setUser(currentUser);
    localStorage.setItem('luxstay_token', accessToken);
    localStorage.setItem('luxstay_user', JSON.stringify(currentUser));
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const res = await http.post('/auth/login', payload);
      saveSession(res.data.accessToken, res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await http.post('/auth/register', payload);
      saveSession(res.data.accessToken, res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('luxstay_token');
    localStorage.removeItem('luxstay_user');
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
