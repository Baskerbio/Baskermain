import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme } from '@shared/schema';
import { useLocation } from 'wouter';

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
  const [location] = useLocation();

  const isDark = theme.name === 'dark';
  
  // Check if we're on a profile page (own profile or public profile)
  const isProfilePage = location === '/profile' || (location.startsWith('/') && location !== '/' && !location.startsWith('/about') && !location.startsWith('/faq') && !location.startsWith('/pricing') && !location.startsWith('/support') && !location.startsWith('/info') && !location.startsWith('/privacy') && !location.startsWith('/terms') && !location.startsWith('/eula') && !location.startsWith('/examples') && !location.startsWith('/starter-packs') && !location.startsWith('/moderation') && !location.startsWith('/login'));

  useEffect(() => {
    // Only apply custom themes on profile pages
    // For other pages, use default theme
    const activeTheme = isProfilePage ? theme : defaultTheme;
    
    // Apply theme to document
    const root = document.documentElement;
    const body = document.body;
    
    const themeIsDark = activeTheme.name === 'dark';
    
    if (themeIsDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Apply core colors
    root.style.setProperty('--primary', activeTheme.primaryColor);
    root.style.setProperty('--accent', activeTheme.accentColor);
    root.style.setProperty('--background', activeTheme.backgroundColor);
    root.style.setProperty('--foreground', activeTheme.textColor);
    
    // Apply card colors
    if (activeTheme.cardBackground) {
      root.style.setProperty('--card', activeTheme.cardBackground);
    }
    if (activeTheme.cardText) {
      root.style.setProperty('--card-foreground', activeTheme.cardText);
    }
    
    // Apply text variations
    if (activeTheme.headingColor) {
      root.style.setProperty('--heading', activeTheme.headingColor);
    }
    if (activeTheme.mutedTextColor) {
      root.style.setProperty('--muted-foreground', activeTheme.mutedTextColor);
    }
    if (activeTheme.linkColor) {
      root.style.setProperty('--link-color', activeTheme.linkColor);
    }
    if (activeTheme.linkHoverColor) {
      root.style.setProperty('--link-hover-color', activeTheme.linkHoverColor);
    }
    
    // Apply UI element colors
    if (activeTheme.borderColor) {
      root.style.setProperty('--border', activeTheme.borderColor);
    }
    if (activeTheme.buttonBackground) {
      root.style.setProperty('--button-bg', activeTheme.buttonBackground);
    }
    if (activeTheme.buttonText) {
      root.style.setProperty('--button-text', activeTheme.buttonText);
    }
    if (activeTheme.buttonHoverBackground) {
      root.style.setProperty('--button-hover-bg', activeTheme.buttonHoverBackground);
    }
    
    // Apply input colors
    if (activeTheme.inputBackground) {
      root.style.setProperty('--input', activeTheme.inputBackground);
    }
    if (activeTheme.inputText) {
      root.style.setProperty('--input-text', activeTheme.inputText);
    }
    if (activeTheme.inputBorder) {
      root.style.setProperty('--input-border', activeTheme.inputBorder);
    }
    
    // Apply background image ONLY on profile pages
    if (isProfilePage && activeTheme.backgroundImage) {
      body.style.backgroundImage = `url(${activeTheme.backgroundImage})`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundRepeat = 'no-repeat';
      body.style.backgroundAttachment = 'fixed';
    } else {
      body.style.backgroundImage = 'none';
    }
    
    // Apply font family
    if (activeTheme.fontFamily) {
      body.style.fontFamily = activeTheme.fontFamily;
    }
    
  }, [theme, isDark, isProfilePage, location]);

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

  // Load theme from localStorage on mount, but only apply on profile pages
  useEffect(() => {
    if (!isProfilePage) {
      // Reset to default theme when not on profile page
      setThemeState(defaultTheme);
      return;
    }
    
    const savedTheme = localStorage.getItem('basker_theme');
    console.log('🔍 Loading saved theme from localStorage:', savedTheme);
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        console.log('🔍 Parsed theme:', parsedTheme);
        setThemeState(parsedTheme);
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
        setThemeState(defaultTheme);
      }
    } else {
      console.log('🔍 No saved theme found, using default theme:', defaultTheme);
      setThemeState(defaultTheme);
    }
  }, [isProfilePage]);

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
