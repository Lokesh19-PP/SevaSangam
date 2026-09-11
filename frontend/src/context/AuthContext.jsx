/**
 * Auth Context — SevaSangam
 *
 * Provides authentication state across the application.
 * Manages user session, role, and login/logout/register operations.
 *
 * Architecture (golden rule):
 *   Component → useAuth hook → AuthContext → authApi.js → apiClient → mockApi
 *
 * Session persistence: token + user JSON are stored in localStorage so that
 * a page refresh does not log the user out during development.
 */
import { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import authApi from '../services/api/authApi';

const TOKEN_KEY = 'sevasangam_token';
const USER_KEY = 'sevasangam_user';

/**
 * Read persisted session from localStorage (returns null if nothing stored).
 */
const loadPersistedSession = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (token && raw) {
      return { token, user: JSON.parse(raw) };
    }
  } catch {
    // Corrupted storage — clear and start fresh
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  return null;
};

/**
 * Persist session to localStorage.
 */
const persistSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Clear persisted session.
 */
const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // true while restoring session
  const [error, setError] = useState(null);

  // ---------------------------------------------------------------------------
  // Restore session on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const session = loadPersistedSession();
    if (session) {
      setUser(session.user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Login — calls Priti's authApi which routes through apiClient → mockApi
  // ---------------------------------------------------------------------------
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      let { user: loggedInUser, token } = response.data || response;

      if (loggedInUser && credentials?.role) {
        loggedInUser = { ...loggedInUser, role: credentials.role };
      }

      persistSession(token, loggedInUser);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return loggedInUser;
    } catch (err) {
      const message = err?.message || 'Login failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Register — creates a new account, then logs in automatically
  // ---------------------------------------------------------------------------
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(userData);
      const { user: newUser, token } = response.data || response;

      persistSession(token, newUser);
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (err) {
      const message = err?.message || 'Registration failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Logout — clears everything, calls backend so server can revoke tokens
  // ---------------------------------------------------------------------------
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if the server call fails we clear locally
    }
    clearSession();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Context value (memoised to avoid needless re-renders)
  // ---------------------------------------------------------------------------
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      error,
      role: user?.role || null,
      login,
      register,
      logout,
    }),
    [user, isAuthenticated, loading, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
