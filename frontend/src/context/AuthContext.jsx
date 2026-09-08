/**
 * Auth Context — SevaSangam
 * 
 * Provides authentication state across the application.
 * Manages user session, role, and login/logout operations.
 */
import { createContext, useState, useCallback, useMemo } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    // Will be replaced with actual auth provider (Firebase/Auth0) later
    setLoading(true);
    try {
      // Placeholder — simulate login
      const mockUser = {
        id: 'usr_001',
        name: credentials.email?.split('@')[0] || 'User',
        email: credentials.email,
        role: credentials.role || 'customer',
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('sevasangam_token', 'mock_token');
      return mockUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('sevasangam_token');
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      role: user?.role || null,
    }),
    [user, isAuthenticated, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
