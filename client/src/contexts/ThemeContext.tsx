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
  const [shouldLoadLocalTheme, setShouldLoadLocalTheme] = useState(true);

  const isDark = theme.name === 'dark';
  
  // Check if we're on a profile page (own profile or public profile)
  const isOwnProfile = location === '/profile';
  const isPublicProfile = location.startsWith('/') && location !== '/' && !location.startsWith('/faq') && !location.startsWith('/support') && !location.startsWith('/info') && !location.startsWith('/privacy') && !location.startsWith('/terms') && !location.startsWith('/eula') && !location.startsWith('/examples') && !location.startsWith('/starter-packs') && !location.startsWith('/moderation') && !location.startsWith('/login') && !location.startsWith('/platform') && !location.startsWith('/newsletter') && !location.startsWith('/forms') && !location.startsWith('/platform-guidelines');
  const isProfilePage = isOwnProfile || isPublicProfile;

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
    
    console.log('🎨 ThemeContext: Applied primary color:', activeTheme.primaryColor);
    
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
    
    // Apply background styling to body
    // Check if theme is disabled
    const isThemeDisabled = activeTheme.enableThemePatterns === false || activeTheme.name === 'none';
    
    if (isProfilePage && !isThemeDisabled) {
      // 1. Apply background image if provided
      if (activeTheme.backgroundImage) {
        console.log('🎨 ThemeContext: Applying background image:', activeTheme.backgroundImage);
        body.style.setProperty('background-image', `url(${activeTheme.backgroundImage})`, 'important');
        body.style.setProperty('background-size', 'cover', 'important');
        body.style.setProperty('background-position', 'center', 'important');
        body.style.setProperty('background-repeat', 'no-repeat', 'important');
        body.style.setProperty('background-attachment', 'fixed', 'important');
        body.style.setProperty('background-color', 'transparent', 'important');
      } 
      // 2. Apply theme patterns if enabled and no background image
      else if (activeTheme.enableThemePatterns && activeTheme.patternStyle === 'themed') {
        // Halloween-themed patterns
        if (activeTheme.name === 'halloween') {
          // Spooky web-like pattern
          const patternColor = activeTheme.accentColor || '#ef4444';
          body.style.setProperty('background-color', activeTheme.backgroundColor, 'important');
          body.style.setProperty('background-image', `
            radial-gradient(circle at 20% 50%, ${patternColor}11 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, ${patternColor}11 0%, transparent 50%),
            repeating-linear-gradient(0deg, transparent, transparent 5px, ${patternColor}08 5px, ${patternColor}08 10px),
            repeating-linear-gradient(90deg, transparent, transparent 5px, ${patternColor}08 5px, ${patternColor}08 10px)
          `, 'important');
          body.style.setProperty('background-size', '200px 200px, 200px 200px, 50px 50px, 50px 50px', 'important');
          body.style.setProperty('background-position', '0 0, 0 0, 0 0, 0 0', 'important');
        }
      }
      // 3. Apply solid background color if no image or pattern
      else {
        body.style.setProperty('background-color', activeTheme.backgroundColor, 'important');
        body.style.removeProperty('background-image');
        body.style.removeProperty('background-size');
        body.style.removeProperty('background-position');
        body.style.removeProperty('background-repeat');
        body.style.removeProperty('background-attachment');
      }
    } else {
      // Clear all background styles when theme is disabled or not on profile pages
      console.log('🎨 ThemeContext: Clearing background (theme disabled or not profile page)');
      body.style.removeProperty('background-image');
      body.style.removeProperty('background-size');
      body.style.removeProperty('background-position');
      body.style.removeProperty('background-repeat');
      body.style.removeProperty('background-attachment');
      body.style.removeProperty('background-color');
    }
    
    // Apply font family
    if (activeTheme.fontFamily) {
      body.style.fontFamily = activeTheme.fontFamily;
    }
    
  }, [theme, isDark, isProfilePage, location]);

  const setTheme = (newTheme: Theme) => {
    console.log('🎨 setTheme called with:', newTheme);
    setThemeState(newTheme);
    // Only save to localStorage on own profile
    if (isOwnProfile) {
      localStorage.setItem('basker_theme', JSON.stringify(newTheme));
    }
  };

  const toggleTheme = () => {
    const newTheme = {
      ...theme,
      name: isDark ? 'light' : 'dark',
    };
    setTheme(newTheme);
  };

  // Load theme from localStorage, but only for own profile page
  useEffect(() => {
    if (!isProfilePage) {
      // Reset to default theme when not on profile page
      setThemeState(defaultTheme);
      setShouldLoadLocalTheme(true);
      return;
    }
    
    // On own profile, load from localStorage
    // On public profiles, wait for setTheme() call from the page component
    if (isOwnProfile && shouldLoadLocalTheme) {
      const savedTheme = localStorage.getItem('basker_theme');
      console.log('🔍 Loading own profile theme from localStorage:', savedTheme);
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
    } else if (isPublicProfile) {
      // For public profiles, reset to default and let the page component set the theme
      console.log('🔍 Public profile detected, waiting for theme from AT Protocol');
      setShouldLoadLocalTheme(false);
    }
  }, [isProfilePage, isOwnProfile, isPublicProfile, location, shouldLoadLocalTheme]);

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
