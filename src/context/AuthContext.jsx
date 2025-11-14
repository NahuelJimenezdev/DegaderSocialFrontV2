import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api';
import { initSocket, disconnectSocket } from '../shared/lib/socket';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          // Initialize Socket.IO connection
          initSocket(token);

          // Verify token by fetching user profile
          const response = await authService.getProfile();
          // Backend devuelve: { success, message, data: user }
          setUser(response.data || response.user);
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        // Clear invalid token
        authService.logout();
        disconnectSocket();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(email, password);
      // Backend devuelve: { success, message, data: { token, user } }
      const token = response.data?.token || authService.getToken();

      // Initialize Socket.IO connection
      if (token) {
        initSocket(token);
      }

      setUser(response.data?.user || response.user);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(userData);
      // Backend devuelve: { success, message, data: { token, user } }
      const token = response.data?.token || authService.getToken();

      // Initialize Socket.IO connection
      if (token) {
        initSocket(token);
      }

      setUser(response.data?.user || response.user);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    disconnectSocket();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
