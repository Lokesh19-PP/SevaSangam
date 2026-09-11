/**
 * useAuth Hook — SevaSangam
 * Provides authentication state and methods to components.
 *
 * Usage:
 *   const { user, role, isAuthenticated, login, register, logout, loading, error } = useAuth();
 */
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
