/**
 * useApp Hook — SevaSangam
 * Provides shared app-level state (sidebar, theme, notifications) to components.
 *
 * Usage:
 *   const { theme, toggleTheme, sidebarOpen, toggleSidebar, unreadNotifications } = useApp();
 */
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default useApp;
