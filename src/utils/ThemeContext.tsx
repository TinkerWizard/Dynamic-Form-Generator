"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useCallback } from "react";

// Theme configuration types
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: ThemeMode;
  isDarkMode: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

// Constants
const THEME_STORAGE_KEY = 'app-theme-preference';
const DARK_CLASS = 'dark';
const LIGHT_CLASS = 'light';

// Default theme context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = THEME_STORAGE_KEY,
}) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Check for stored preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
        return stored;
      }
    }
    return defaultTheme;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return theme === 'dark';
    }
    return false;
  });

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Update theme in localStorage and DOM
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);

    const isDark = newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(isDark);
  }, [storageKey]);

  // Toggle between light and dark modes
  const toggleTheme = useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark');
  }, [isDarkMode, setTheme]);

  // Update document classes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(DARK_CLASS, LIGHT_CLASS);
    root.classList.add(isDarkMode ? DARK_CLASS : LIGHT_CLASS);
  }, [isDarkMode]);

  const value = {
    theme,
    isDarkMode,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};