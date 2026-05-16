import { createContext, useContext, useState, useEffect } from 'react';
import { loginAPI, registerAPI, getMeAPI } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user was previously logged in via token
    const token = localStorage.getItem('healthwallet_token');
    if (token) {
      getMeAPI()
        .then(data => {
          setUser(data.user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('healthwallet_token');
          localStorage.removeItem('healthwallet_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginAPI(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('healthwallet_user', JSON.stringify(data.user));
      localStorage.setItem('healthwallet_token', data.token);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await registerAPI(name, email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('healthwallet_user', JSON.stringify(data.user));
      localStorage.setItem('healthwallet_token', data.token);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('healthwallet_user');
    localStorage.removeItem('healthwallet_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
