import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { Settings as ProfileSettings } from '@shared/schema';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Edit, Settings as SettingsIcon, LogOut, Copy, Menu, X, Share2, QrCode, ChevronDown, Upload, BarChart3, CreditCard, Link as LinkIcon, FileText, Grid3X3, Code } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { QRCodeShare } from '@/components/QRCodeShare';
import { ProfileHeader } from '../components/ProfileHeader';
import { Notes } from '../components/Notes';
import { LinksList } from '../components/LinksList';
import { Widgets } from '../components/Widgets';
import { SettingsModal } from '../components/SettingsModal';
import { DragDropProvider } from '../components/DragDropProvider';
import { SocialIconsRow } from '../components/SocialIconsRow';
import { SocialIconsEditor } from '../components/SocialIconsEditor';
import { useAuth } from '../contexts/AuthContext';
import { useEditMode } from '../components/EditModeProvider';
import { useLinks, useSaveLinks, useSettings, useSaveSettings } from '../hooks/use-atprotocol';
import { useToast } from '@/hooks/use-toast';
import { DropResult } from '@hello-pangea/dnd';
import { atprotocol } from '../lib/atprotocol';
import { SEOHead } from '../components/SEOHead';

const PROFILE_CONTAINER_DEFAULT = {
  enabled: false,
  backgroundColor: '',
  backgroundImage: '',
  backgroundSize: 'cover' as const,
  backgroundPosition: 'center' as const,
  backgroundRepeat: 'no-repeat' as const,
  backgroundOverlayColor: '#000000',
  backgroundOverlayOpacity: 0.35,
  borderRadius: 32,
  borderColor: '',
  borderWidth: 0,
  borderStyle: 'solid' as const,
  padding: 32,
  shadow: true,
  maxWidth: 'default' as const,
  backdropBlur: 0,
};

const hexToRgba = (color: string, alpha: number) => {
  if (!color) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  if (color.startsWith('rgba')) {
    return color;
  }

  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }

  let hex = color.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((char) => char + char).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function Profile() {
  const { user, logout } = useAuth();
  const { isEditMode, toggleEditMode } = useEditMode();
  const { data: links = [] } = useLinks();
  const { mutate: saveLinks } = useSaveLinks();
  const { data: settings } = useSettings();
  const { mutate: saveSettings } = useSaveSettings();
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [settingsScrollTo, setSettingsScrollTo] = useState<string | undefined>(undefined);
  const [showQRCode, setShowQRCode] = useState(false);

  // Cleanup expired stories on component mount
  useEffect(() => {
    const cleanupStories = async () => {
      try {
        await atprotocol.cleanupExpiredStories();
      } catch (error) {
        console.error('Failed to cleanup expired stories:', error);
      }
    };
    
    cleanupStories();
    
    // Set up periodic cleanup every 5 minutes
    const interval = setInterval(cleanupStories, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const profileContainer = {
    ...PROFILE_CONTAINER_DEFAULT,
    ...(settings?.profileContainer || {}),
  };

  const containerEnabled = Boolean(profileContainer.enabled);

  const widthClasses: Record<'narrow' | 'default' | 'wide', string> = {
    narrow: 'max-w-xl',
    default: 'max-w-2xl',
    wide: 'max-w-3xl',
  };

  const mainWidthClass = containerEnabled
    ? widthClasses[(profileContainer.maxWidth || 'default') as 'narrow' | 'default' | 'wide']
    : 'max-w-2xl';

  const containerStyle: CSSProperties = {
    padding: `${profileContainer.padding ?? 32}px`,
    borderRadius: `${profileContainer.borderRadius ?? 32}px`,
    backgroundColor: profileContainer.backgroundColor || undefined,
    border:
      (profileContainer.borderWidth ?? 0) > 0
        ? `${profileContainer.borderWidth}px ${profileContainer.borderStyle || 'solid'} ${profileContainer.borderColor || 'rgba(255,255,255,0.18)'}`
        : 'none',
    boxShadow: profileContainer.shadow ? '0 25px 45px rgba(15, 23, 42, 0.18)' : undefined,
    backgroundImage: profileContainer.backgroundImage ? `url(${profileContainer.backgroundImage})` : undefined,
    backgroundSize: profileContainer.backgroundSize || 'cover',
    backgroundPosition: profileContainer.backgroundPosition || 'center',
    backgroundRepeat: profileContainer.backgroundRepeat || 'no-repeat',
    backdropFilter: profileContainer.backdropBlur ? `blur(${profileContainer.backdropBlur}px)` : undefined,
    WebkitBackdropFilter: profileContainer.backdropBlur ? `blur(${profileContainer.backdropBlur}px)` : undefined,
  };

  if (!profileContainer.backgroundImage && !profileContainer.backgroundColor) {
    containerStyle.backgroundColor = 'rgba(17, 24, 39, 0.65)';
  }

  if ((profileContainer.borderWidth ?? 0) === 0) {
    containerStyle.border = 'none';
  }

  const overlayColor = hexToRgba(
    profileContainer.backgroundOverlayColor || '#000000',
    profileContainer.backgroundOverlayOpacity ?? 0.35,
  );

  const showOverlay =
    (profileContainer.backgroundOverlayOpacity ?? 0.35) > 0 &&
    (profileContainer.backgroundImage || profileContainer.backgroundColor);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out',
        description: 'Successfully logged out of Basker',
      });
      setShowMobileMenu(false); // Close mobile menu
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  const handleCopyProfileURL = async () => {
    if (!user?.handle) return;
    
    try {
      const profileURL = `${window.location.origin}/${user.handle}`;
      await navigator.clipboard.writeText(profileURL);
      toast({
        title: 'Profile URL copied!',
        description: 'Share your profile with others',
      });
      setShowMobileMenu(false); // Close mobile menu
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy profile URL',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (!user?.handle) return;
    
    const profileURL = `${window.location.origin}/${user.handle}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.displayName || user.handle} - Basker Profile`,
          text: `Check out my Basker profile: ${profileURL}`,
          url: profileURL,
        });
      } catch (error) {
        // User cancelled or error occurred
        if ((error as any).name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else {
      // Fallback to copying URL
      await handleCopyProfileURL();
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Handle section reordering (from SettingsModal)
    if (result.destination.droppableId === 'section-order') {
      // This is handled by the SettingsModal's handleSectionOrderChange
      // We don't need to do anything here since the SettingsModal handles it
      return;
    }

    // Handle links reordering (from LinksList)
    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
      updatedAt: new Date().toISOString(),
    }));

    saveLinks(updatedItems, {
      onSuccess: () => {
        toast({
          title: 'Links reordered',
          description: 'Your links have been reordered successfully',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to reorder links',
          variant: 'destructive',
        });
      },
    });
  };

  const profileContent = (
    <>
      <ProfileHeader
        onOpenSettings={() => {
          setSettingsScrollTo('social-icons-section');
          setShowSettings(true);
        }}
      />

      {/* Social Icons - above sections placement */}
      {settings?.socialIconsConfig?.placement === 'above-sections' && (
        <div className="mb-8">
          {/* Show editor in edit mode */}
          {isEditMode ? (
            <SocialIconsEditor
              socialLinks={settings?.socialLinks || []}
              config={settings?.socialIconsConfig}
              onSave={(links, config) => {
                // Create settings object if it doesn't exist
                const baseSettings = settings || {
                  theme: {
                    name: 'dark',
                    primaryColor: '#8b5cf6',
                    accentColor: '#22c55e',
                    backgroundColor: '#0f0f14',
                    textColor: '#fafafa',
                    fontFamily: 'Inter',
                    layout: 'default',
                  },
                  showStories: true,
                  showNotes: true,
                  isPublic: true,
                  enableAnalytics: true,
                  sectionOrder: ['widgets', 'notes', 'links'],
                };

                const updatedSettings = {
                  ...baseSettings,
                  socialLinks: links,
                  socialIconsConfig: {
                    placement: 'above-sections',
                    style: 'default',
                    size: 'medium',
                    ...(baseSettings.socialIconsConfig || {}),
                    ...config,
                    enabled: links.length > 0,
                  },
                };
                console.log('💾 Profile.tsx saving settings (above-sections):', {
                  socialLinks: updatedSettings.socialLinks?.length,
                  socialIconsConfig: updatedSettings.socialIconsConfig,
                });
                    saveSettings(updatedSettings as ProfileSettings);
              }}
              onOpenSettings={() => {
                setSettingsScrollTo('social-icons-section');
                setShowSettings(true);
              }}
            />
          ) : (
            /* Show preview for non-edit mode */
            settings?.socialLinks &&
            settings.socialLinks.length > 0 && (
              <div className="flex items-center justify-center">
                <SocialIconsRow
                  socialLinks={settings.socialLinks}
                  config={settings.socialIconsConfig}
                  isEditMode={false}
                />
              </div>
            )
          )}
        </div>
      )}

      {(() => {
        const sectionOrder = settings?.sectionOrder || ['widgets', 'notes', 'links'];
        console.log('🔍 Current section order:', sectionOrder);
        console.log('🔍 Settings:', settings);
        return sectionOrder.map((section, index) => {
          const moveUp = () => {
                if (!settings) return;
            if (index === 0) return;
            const newOrder = [...sectionOrder];
            [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
            console.log('🔍 Moving section up, new order:', newOrder);
                saveSettings({ ...settings, sectionOrder: newOrder } as ProfileSettings, {
              onSuccess: () => {
                toast({
                  title: 'Section reordered',
                  description: 'Your sections have been reordered successfully',
                });
              },
              onError: () => {
                toast({
                  title: 'Error',
                  description: 'Failed to reorder sections',
                  variant: 'destructive',
                });
              },
            });
          };

          const moveDown = () => {
                if (!settings) return;
            if (index === sectionOrder.length - 1) return;
            const newOrder = [...sectionOrder];
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
            console.log('🔍 Moving section down, new order:', newOrder);
                saveSettings({ ...settings, sectionOrder: newOrder } as ProfileSettings, {
              onSuccess: () => {
                toast({
                  title: 'Section reordered',
                  description: 'Your sections have been reordered successfully',
                });
              },
              onError: () => {
                toast({
                  title: 'Error',
                  description: 'Failed to reorder sections',
                  variant: 'destructive',
                });
              },
            });
          };

          let sectionComponent;
          switch (section) {
            case 'widgets':
              sectionComponent = <Widgets key="widgets" isEditMode={isEditMode} effectiveSettings={settings} />;
              break;
            case 'notes':
              sectionComponent = <Notes key="notes" isEditMode={isEditMode} />;
              break;
            case 'links':
              sectionComponent = <LinksList key="links" isEditMode={isEditMode} />;
              break;
            default:
              sectionComponent = null;
          }

          return (
            <div key={section} className="relative" data-section={section}>
              {sectionComponent}
              {isEditMode && (
                <div className="absolute -left-12 top-4 flex flex-col gap-1">
                  <Button
                    onClick={moveUp}
                    disabled={index === 0}
                    variant="glass"
                    size="sm"
                    className="w-8 h-8 p-0 hover:scale-105 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ↑
                  </Button>
                  <Button
                    onClick={moveDown}
                    disabled={index === sectionOrder.length - 1}
                    variant="glass"
                    size="sm"
                    className="w-8 h-8 p-0 hover:scale-105 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ↓
                  </Button>
                </div>
              )}
            </div>
          );
        });
      })()}

      {/* Footer */}
      <footer className="text-center py-8 border-t border-border" data-testid="footer">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
          <span className="text-sm">Powered by</span>
          <img
            src="/baskerchristmas.jpg"
            alt="Basker"
            className="w-4 h-4 rounded-full"
          />
          <span className="text-sm">basker</span>
          <span className="text-sm text-muted-foreground">© 2025</span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">v2.1.0.0</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Create your own link-in-bio page with basker
        </p>
      </footer>
    </>
  );

  return (
    <DragDropProvider onDragEnd={onDragEnd}>
      <SEOHead 
        title={`${user?.displayName || user?.handle || 'Profile'} - Basker Profile`}
        description={`View ${user?.displayName || user?.handle || 'this profile'}'s Basker link-in-bio page with custom links, widgets, and more.`}
        keywords={`${user?.handle}, Basker, link-in-bio, social links, profile`}
      />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50" data-testid="header">
          <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                <img 
                  src="/baskerchristmas.jpg"
                  alt="Basker"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                />
                <h1 className="text-lg sm:text-xl font-bold text-primary" data-testid="text-brand">Basker</h1>
              </Link>
              <span className="text-muted-foreground hidden lg:block">|</span>
              <span className="text-xs sm:text-sm text-muted-foreground hidden lg:block" data-testid="text-user-handle">
                @{user?.handle}
              </span>
            </div>
            
            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
              {/* Desktop dropdown for share options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex items-center gap-2 text-sm px-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    data-testid="button-share"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopyProfileURL}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Profile URL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowQRCode(true)}>
                    <QrCode className="w-4 h-4 mr-2" />
                    Show QR Code
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleEditMode}
                className="flex items-center gap-2 text-sm px-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                data-testid="button-edit-mode"
              >
                <Edit className="w-4 h-4" />
                {isEditMode ? 'Done' : 'Edit'}
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 text-sm px-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                data-testid="button-settings"
              >
                <SettingsIcon className="w-4 h-4" />
                Settings
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm px-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden px-2"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile menu */}
          {showMobileMenu && (
            <div className="sm:hidden border-t border-border bg-card">
              <div className="max-w-4xl mx-auto px-4 py-3 space-y-3">
                {/* User info */}
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-sm font-medium">
                      {user?.handle?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">@{user?.handle}</div>
                    <div className="text-xs text-muted-foreground">Basker Profile</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-between gap-2 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Share2 className="w-4 h-4" />
                          Share Options
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem onClick={handleCopyProfileURL}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Profile URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setShowQRCode(true);
                        setShowMobileMenu(false);
                      }}>
                        <QrCode className="w-4 h-4 mr-2" />
                        QR Code
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleEditMode();
                      setShowMobileMenu(false);
                    }}
                    className="w-full justify-start gap-3"
                    data-testid="button-edit-mode-mobile"
                  >
                    <Edit className="w-4 h-4" />
                    {isEditMode ? 'Exit Edit Mode' : 'Edit Profile'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowSettings(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full justify-start gap-3"
                    data-testid="button-settings-mobile"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Settings
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start gap-3"
                    data-testid="button-logout-mobile"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Dashboard Navigation */}
        <nav className="sticky top-[57px] sm:top-[65px] z-40 bg-card border-b border-border shadow-sm">
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 sm:py-2 nav-scrollbar">
              {/* Page Navigation */}
              <Link href="/import">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap h-9 sm:h-9 px-3 sm:px-3 hover:bg-accent flex-shrink-0"
                >
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Import</span>
                  <span className="sm:hidden">Import</span>
                </Button>
              </Link>
              
              <Link href="/analytics">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap h-9 sm:h-9 px-3 sm:px-3 hover:bg-accent flex-shrink-0"
                >
                  <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Analytics</span>
                  <span className="sm:hidden">Stats</span>
                </Button>
              </Link>
              
              <Link href="/solaris">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap h-9 sm:h-9 px-3 sm:px-3 hover:bg-accent flex-shrink-0"
                >
                  <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Solaris</span>
                  <span className="sm:hidden">Solaris</span>
                </Button>
              </Link>

              <Link href="/submit-widget">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap h-9 sm:h-9 px-3 sm:px-3 hover:bg-accent flex-shrink-0"
                >
                  <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Submit a Widget</span>
                  <span className="sm:hidden">Submit Widget</span>
                </Button>
              </Link>

              <div className="h-4 sm:h-6 w-px bg-border mx-1 flex-shrink-0" />

              {/* Settings Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap h-9 sm:h-9 px-3 sm:px-3 hover:bg-accent flex-shrink-0"
              >
                <SettingsIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Settings</span>
              </Button>

              <div className="h-4 sm:h-6 w-px bg-border mx-1 flex-shrink-0" />

              {/* Section Navigation */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const linksSection = document.querySelector('[data-section="links"]');
                  linksSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap h-9 sm:h-9 px-3 sm:px-3 hover:bg-accent flex-shrink-0"
              >
                <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Links</span>
                <span className="sm:hidden">Links</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const notesSection = document.querySelector('[data-section="notes"]');
                  notesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap h-9 sm:h-9 px-3 sm:px-3 hover:bg-accent flex-shrink-0"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Notes</span>
                <span className="sm:hidden">Notes</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const widgetsSection = document.querySelector('[data-section="widgets"]');
                  widgetsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap h-9 sm:h-9 px-3 sm:px-3 hover:bg-accent flex-shrink-0"
              >
                <Grid3X3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Widgets</span>
                <span className="sm:hidden">Widgets</span>
              </Button>
            </div>
          </div>
        </nav>

        <main className={`${mainWidthClass} mx-auto px-4 py-8`}>
          {containerEnabled ? (
            <div
              className="relative overflow-hidden transition-shadow duration-300"
              style={containerStyle}
            >
              {showOverlay && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundColor: overlayColor }}
                />
              )}
              <div className="relative z-10">
                {profileContent}
              </div>
            </div>
          ) : (
            profileContent
          )}
        </main>

            <SettingsModal 
              isOpen={showSettings} 
              onClose={() => {
                setShowSettings(false);
                setSettingsScrollTo(undefined);
              }} 
              onDragEnd={onDragEnd}
              scrollToSection={settingsScrollTo}
            />

            {/* QR Code Share Modal */}
            {user?.handle && (
              <QRCodeShare
                profileUrl={`${window.location.origin}/${user.handle}`}
                isOpen={showQRCode}
                onClose={() => setShowQRCode(false)}
              />
            )}
      </div>
    </DragDropProvider>
  );
}
