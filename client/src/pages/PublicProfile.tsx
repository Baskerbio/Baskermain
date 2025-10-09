import { useRoute } from 'wouter';
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { atprotocol } from '../lib/atprotocol';
import { getLinkStyling } from '../lib/link-utils';
import { PublicProfileHeader } from '../components/PublicProfileHeader';
import { SocialIconsRow } from '../components/SocialIconsRow';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { UserProfile } from '@shared/schema';
import { ExternalLink, ArrowLeft, Settings, LogOut, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SettingsModal } from '../components/SettingsModal';
import { WorkHistoryWidget } from '../components/WorkHistoryWidget';
import ProductShowcaseWidget from '../components/widgets/ProductShowcaseWidget';
import { SocialBadgeWidget } from '../components/widgets/SocialBadgeWidget';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { useToast } from '@/hooks/use-toast';
import { usePublicWidgets } from '../hooks/use-atprotocol';

export default function PublicProfile() {
  const [, params] = useRoute('/:handle');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const { user } = useAuth(); // Only get user for conditional rendering
  const { toast } = useToast();
  const { setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      // For public profiles, we don't need to handle logout
      // This should only be called if user is authenticated
      toast({
        title: 'Logged out',
        description: 'Successfully logged out of Basker',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (!params?.handle) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Extract handle from URL (e.g., "username.bsky.social")
        // Remove @ symbol if present (some URLs might have @username.bsky.social)
        let handle = params.handle;
        if (handle.startsWith('@')) {
          handle = handle.substring(1);
        }
        
        console.log('Resolving handle:', handle);
        
        // Get profile information using public method
        const profileData = await atprotocol.getPublicProfile(handle);
        const did = profileData.did;
        
        // Create UserProfile object
        const userProfile: UserProfile = {
          did: did,
          handle: handle,
          displayName: profileData.displayName || '',
          description: profileData.description || '',
          avatar: profileData.avatar || '',
          banner: profileData.banner || '',
          followersCount: profileData.followersCount || 0,
          followsCount: profileData.followsCount || 0,
          postsCount: profileData.postsCount || 0,
          createdAt: profileData.indexedAt || new Date().toISOString(),
        };
        
        setProfile(userProfile);
        
        // Load and apply theme settings
        try {
          console.log('📥 Loading settings for DID:', did);
          const settingsData = await atprotocol.getPublicSettings(did);
          console.log('📥 Loaded public settings data:', settingsData);
          const loadedSettings = settingsData?.settings || null;
          console.log('📥 Loaded settings object:', loadedSettings);
          console.log('📥 Social links:', loadedSettings?.socialLinks);
          console.log('📥 Social icons config:', loadedSettings?.socialIconsConfig);
          setSettings(loadedSettings);
          
          if (settingsData && settingsData.settings && settingsData.settings.theme) {
            console.log('🎨 Applying public profile theme:', settingsData.settings.theme);
            console.log('🎨 Theme has background image:', settingsData.settings.theme.backgroundImage);
            console.log('🎨 Theme background color:', settingsData.settings.theme.backgroundColor);
            setTheme(settingsData.settings.theme);
            
            // Force apply background image to body
            if (settingsData.settings.theme.backgroundImage) {
              console.log('🎨 Forcing background image application');
              document.body.style.backgroundImage = `url(${settingsData.settings.theme.backgroundImage})`;
              document.body.style.backgroundSize = 'cover';
              document.body.style.backgroundPosition = 'center';
              document.body.style.backgroundRepeat = 'no-repeat';
              document.body.style.backgroundAttachment = 'fixed';
            }
          }
        } catch (settingsErr: any) {
          console.error('Failed to load settings:', settingsErr);
          setSettings(null);
          // Settings loading failure shouldn't break the profile page
        }
      } catch (err: any) {
        console.error('Failed to load profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [params?.handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Alert>
            <AlertDescription>
              Profile not found
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50" data-testid="header">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <span className="text-muted-foreground">|</span>
            <h1 className="text-xl font-bold text-primary" data-testid="text-brand">basker</h1>
            {profile && (
              <>
                <span className="text-muted-foreground">|</span>
                <span className="text-sm text-muted-foreground" data-testid="text-user-handle">
                  @{profile.handle}
                </span>
              </>
            )}
          </div>
          
          {user && (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                  data-testid="button-edit-mode"
                >
                  <Edit className="w-4 h-4" />
                  Edit My Profile
                </Button>
              </Link>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowSettings(true)}
                data-testid="button-settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <PublicProfileHeader 
            profile={profile}
          />
          
          {/* Social Icons - above sections placement */}
          {settings?.socialIconsConfig?.placement === 'above-sections' && settings?.socialLinks && settings.socialLinks.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <SocialIconsRow 
                  socialLinks={settings.socialLinks} 
                  config={settings.socialIconsConfig}
                  isEditMode={false}
                />
              </div>
            </div>
          )}
          
          {/* Public Content */}
          <div className="space-y-6">
            {/* Links */}
            <PublicLinksList did={profile.did} />
            
            {/* Public Notes */}
            <PublicNotes did={profile.did} />
            
            {/* Widgets */}
            <PublicWidgets did={profile.did} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border mt-8" data-testid="footer">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <span className="text-sm">Powered by</span>
            <span className="text-primary font-semibold">basker</span>
            <span className="text-sm">×</span>
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-sm">Bluesky</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Create your own link-in-bio page with basker
          </p>
        </footer>
      </main>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

// Public versions of components that only show public content
function PublicLinksList({ did }: { did: string }) {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLinks = async () => {
      try {
        console.log('🚀 PublicLinksList: Loading links for DID:', did);
        
        const data = await atprotocol.getPublicLinks(did);
        console.log('🚀 PublicLinksList: Got data:', data);
        setLinks(data?.links || []);
        
        console.log('🚀 PublicLinksList: Set links:', data?.links);
        console.log('🚀 PublicLinksList: Links length:', data?.links?.length);
        console.log('🚀 PublicLinksList: First link:', data?.links?.[0]);
      } catch (err) {
        console.error('🚀 PublicLinksList: Failed to load links:', err);
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };

    if (did) {
      loadLinks();
    }
  }, [did]);

  console.log('🚀 PublicLinksList render: loading=', loading, 'links.length=', links.length);
  
  if (loading) return <Skeleton className="h-32 w-full" />;
  if (links.length === 0) {
    console.log('🚀 PublicLinksList: No links to display, returning null');
    return null;
  }
  
  console.log('🚀 PublicLinksList: Rendering', links.length, 'links');

  const getIconComponent = (iconClass: string) => {
    // Simple icon mapping - in a real app, you'd want a more robust solution
    const iconMap: Record<string, React.ReactNode> = {
      'fab fa-github': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
      'fab fa-twitter': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
      'fab fa-youtube': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
      'fas fa-globe': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>,
      'fas fa-envelope': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
    };

    return iconMap[iconClass] || <ExternalLink className="w-5 h-5" />;
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mb-8 fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Links</h3>
      <div className="space-y-4">
        {links
          .sort((a, b) => a.order - b.order)
          .map((link) => (
            <Card
              key={link.id}
              className={`card-hover group relative cursor-pointer ${getLinkStyling(link).shapeClasses}`}
              style={{
                backgroundColor: getLinkStyling(link).backgroundColor,
                color: getLinkStyling(link).color,
                fontFamily: getLinkStyling(link).fontFamily,
              }}
              onClick={() => openLink(link.url)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                      {getIconComponent(link.icon || 'fas fa-link')}
                    </div>
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {link.title}
                    </h4>
                    {link.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {link.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {new URL(link.url).hostname}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

function PublicNotes({ did }: { did: string }) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        console.log('Loading notes for DID:', did);
        
        const data = await atprotocol.getPublicNotes(did);
        setNotes(data?.notes || []);
        
        console.log('Loaded public notes:', data?.notes);
      } catch (err) {
        console.error('Failed to load notes:', err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    if (did) {
      loadNotes();
    }
  }, [did]);

  if (loading) return <Skeleton className="h-24 w-full" />;
  if (notes.length === 0) return null;

  return (
    <div className="mb-8 fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Notes</h3>
      <div className="space-y-3">
        {notes.map((note) => (
          <Card key={note.id} className="card-hover group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    Public
                  </span>
                </div>
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-2">
                {note.content}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PublicWidgets({ did }: { did: string }) {
  const { data: widgets = [], isLoading: loading, error } = usePublicWidgets(did);

  if (loading) return <Skeleton className="h-24 w-full" />;
  if (error) {
    console.log('🔍 Error loading widgets:', error);
    return null;
  }
  if (widgets.length === 0) {
    console.log('🔍 No widgets found for user');
    return null;
  }

  return (
    <div className="mb-8 fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Widgets</h3>
      <div className="space-y-6">
        {widgets.map((widget) => {
          console.log('🔍 Rendering widget:', widget);
          switch (widget.type) {
            case 'work_history':
              return <WorkHistoryWidget key={widget.id} isPublic={true} targetDid={did} />;
            case 'product_showcase':
              return <ProductShowcaseWidget key={widget.id} config={widget.config} isEditMode={false} />;
            case 'social_badge':
              return <SocialBadgeWidget key={widget.id} config={widget.config} />;
            case 'weather':
              return <WeatherWidget key={widget.id} config={widget.config} />;
            default:
              console.log('🔍 Unknown widget type:', widget.type);
              return (
                <Card key={widget.id}>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Unknown widget type: {widget.type}</h4>
                    <p className="text-sm text-muted-foreground">
                      Widget configuration
                    </p>
                  </CardContent>
                </Card>
              );
          }
        })}
      </div>
    </div>
  );
}
