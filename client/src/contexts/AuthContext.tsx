import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { atprotocol } from '../lib/atprotocol';
import { UserProfile } from '@shared/schema';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await atprotocol.restoreSession();
        if (session) {
          const profile = await atprotocol.getProfile();
          setUser({
            did: profile.did,
            handle: profile.handle,
            displayName: profile.displayName,
            description: profile.description,
            avatar: profile.avatar,
            banner: profile.banner,
            associated: profile.associated,
            labels: profile.labels,
            followersCount: profile.followersCount || 0,
            followsCount: profile.followsCount || 0,
            postsCount: profile.postsCount || 0,
            createdAt: profile.indexedAt || new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      setIsLoading(true);
      const session = await atprotocol.login(identifier, password);
      const profile = await atprotocol.getProfile();

      setUser({
        did: profile.did,
        handle: profile.handle,
        displayName: profile.displayName,
        description: profile.description,
        avatar: profile.avatar,
        banner: profile.banner,
        associated: profile.associated,
        labels: profile.labels,
        followersCount: profile.followersCount || 0,
        followsCount: profile.followsCount || 0,
        postsCount: profile.postsCount || 0,
        createdAt: profile.indexedAt || new Date().toISOString(),
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await atprotocol.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profile: UserProfile) => {
    setIsLoading(true);
    try {
      // In a real implementation, you would save to AT Protocol
      setUser(profile);
      localStorage.setItem('basker_user', JSON.stringify(profile));
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During development with Fast Refresh, sometimes the context is temporarily undefined
    // Return a default context to prevent crashes
    console.warn('useAuth called outside of AuthProvider, returning default context');
    return {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: async () => {},
      logout: async () => {},
      updateProfile: async () => {},
    };
  }
  return context;
}