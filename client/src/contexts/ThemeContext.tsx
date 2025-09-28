import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme } from '@shared/schema';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const defaultTheme: Theme = {
  name: 'dark',
  primaryColor: '#fbbf24',
  accentColor: '#22c55e',
  backgroundColor: '#0f0f14',
  textColor: '#fafafa',
  fontFamily: 'Inter',
  layout: 'default',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  const isDark = theme.name === 'dark';

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    const body = document.body;
    
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Apply custom colors
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--accent', theme.accentColor);
    root.style.setProperty('--background', theme.backgroundColor);
    root.style.setProperty('--foreground', theme.textColor);
    
    // Apply background image
    if (theme.backgroundImage) {
      body.style.backgroundImage = `url(${theme.backgroundImage})`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundRepeat = 'no-repeat';
      body.style.backgroundAttachment = 'fixed';
    } else {
      body.style.backgroundImage = 'none';
    }
    
    // Apply font family
    if (theme.fontFamily) {
      body.style.fontFamily = theme.fontFamily;
    }
    
  }, [theme, isDark]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('basker_theme', JSON.stringify(newTheme));
  };

  const toggleTheme = () => {
    const newTheme = {
      ...theme,
      name: isDark ? 'light' : 'dark',
    };
    setTheme(newTheme);
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('basker_theme');
    console.log('🔍 Loading saved theme from localStorage:', savedTheme);
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        console.log('🔍 Parsed theme:', parsedTheme);
        setThemeState(parsedTheme);
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    } else {
      console.log('🔍 No saved theme found, using default theme:', defaultTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      isDark,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
