import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    const token = localStorage.getItem('athena_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetch('/api/auth/me');
      if (data.user) {
        setUser(data.user);
        setRole(data.user.role || 'sub');
        setUsername(data.user.username);
        setAvatarUrl(data.user.avatar_url);
      } else {
        localStorage.removeItem('athena_token');
      }
    } catch (err) {
      console.error('Session check failed:', err);
      localStorage.removeItem('athena_token');
      setUser(null);
      setRole(null);
      setUsername(null);
      setAvatarUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      localStorage.setItem('athena_token', data.token);
      setUser(data.user);
      setRole(data.user.role || 'sub');
      setUsername(data.user.username);
      setAvatarUrl(data.user.avatar_url);
    }
    return data;
  };

  const signup = async (email, password, username) => {
    const data = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });

    if (data.token) {
      localStorage.setItem('athena_token', data.token);
      setUser(data.user);
      setRole(data.user.role || 'sub');
      setUsername(data.user.username);
      setAvatarUrl(data.user.avatar_url);
    }
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('athena_token');
    setUser(null);
    setRole(null);
    setUsername(null);
    setAvatarUrl(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, username, setUsername, avatarUrl, setAvatarUrl, loading, login, signup, logout, checkActiveSession }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
