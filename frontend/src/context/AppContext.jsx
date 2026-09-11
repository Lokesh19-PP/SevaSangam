/**
 * App Context — SevaSangam
 *
 * Minimal shared application-level state.
 * Only truly app-wide UI concerns live here — no Redux, no heavy state.
 *
 * Current state:
 *  - sidebarOpen  — sidebar collapse/expand state for dashboard layouts
 *  - theme        — "light" | "dark" (persisted to localStorage)
 *  - notifications — unread notification badge count (lightweight, UI-only)
 */
import { createContext, useState, useCallback, useMemo, useEffect } from 'react';

const THEME_KEY = 'sevasangam_theme';

/**
 * Read persisted theme, defaulting to "light".
 */
const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Silently ignore
  }
  return 'light';
};

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(getInitialTheme);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Apply theme class to <html> for Tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Silently ignore
    }
  }, [theme]);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
    []
  );

  const value = useMemo(
    () => ({
      sidebarOpen,
      toggleSidebar,
      theme,
      toggleTheme,
      unreadNotifications,
      setUnreadNotifications,
    }),
    [sidebarOpen, toggleSidebar, theme, toggleTheme, unreadNotifications]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
