/**
 * App Context — SevaSangam
 * 
 * Global application state.
 * Keeps global state minimal — only truly app-wide concerns go here.
 */
import { createContext, useState, useMemo } from 'react';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const value = useMemo(
    () => ({
      sidebarOpen,
      toggleSidebar,
      theme,
      toggleTheme,
    }),
    [sidebarOpen, theme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
