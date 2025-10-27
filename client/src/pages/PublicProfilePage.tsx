import { useRoute } from 'wouter';
import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { atprotocol } from '../lib/atprotocol';
import { getLinkStyling } from '../lib/link-utils';
import PixelTransition from '../components/PixelTransition';
import GlareHover from '../components/GlareHover';
import { ProfileHeader } from '../components/ProfileHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { UserProfile } from '@shared/schema';
import { ArrowLeft, Users, Cloud, Music, Heart, Image, Megaphone, Mail, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { WorkHistoryWidget } from '../components/WorkHistoryWidget';
import { SocialIconsRow } from '../components/SocialIconsRow';
import { GitHubActivityWidget } from '../components/widgets/GitHubActivityWidget';
import { KofiSupportWidget } from '../components/widgets/KofiSupportWidget';
import { ReactionBarWidget } from '../components/widgets/ReactionBarWidget';
import { PollWidget } from '../components/widgets/PollWidget';
import { SpinningWheelWidget } from '../components/widgets/SpinningWheelWidget';
import { BeforeAfterSliderWidget } from '../components/widgets/BeforeAfterSliderWidget';
import { MiniGameWidget } from '../components/widgets/MiniGameWidget';

// Function to update SEO meta tags dynamically
const updateMetaTags = (settings: any, profile: UserProfile) => {
  const titleEl = document.getElementById('seo-title');
  const descEl = document.getElementById('seo-description');
  const keywordsEl = document.getElementById('seo-keywords');
  const ogTitleEl = document.getElementById('og-title');
  const ogDescEl = document.getElementById('og-description');
  const ogImageEl = document.getElementById('og-image');
  const ogSiteNameEl = document.getElementById('og-site-name');
  const twitterTitleEl = document.getElementById('twitter-title');
  const twitterDescEl = document.getElementById('twitter-description');
  const twitterImageEl = document.getElementById('twitter-image');
  const robotsEl = document.getElementById('robots');

  // Update title and description
  const displayName = profile.displayName || profile.handle;
  const bio = profile.description || settings?.customBio || 'Check out my Basker profile';
  const seoTitle = settings?.seoTitle || `${displayName} - Basker Profile`;
  const seoDesc = settings?.seoDescription || bio;
  
  // Combine user keywords with default Basker keywords
  const defaultKeywords = 'Basker, Basker Bio, Baskerbio, free link platform, link-in-bio, decentralized bluesky, AT Protocol, social media link, bio link, basker.bio';
  const seoKeywords = settings?.seoKeywords?.length 
    ? `${settings.seoKeywords.join(', ')}, ${defaultKeywords}`
    : `${displayName}, Basker, Links, Portfolio, ${defaultKeywords}`;
  const seoImage = settings?.seoImage || profile.avatar || profile.banner || '';
  const ogSiteName = settings?.seoSiteName || 'Basker';
  const twitterHandle = settings?.seoTwitterHandle || '';

  // Update page title
  if (titleEl) titleEl.textContent = seoTitle;
  
  // Update meta description
  if (descEl) descEl.setAttribute('content', seoDesc);
  
  // Update keywords
  if (keywordsEl) keywordsEl.setAttribute('content', seoKeywords);
  
  // Update Open Graph tags
  if (ogTitleEl) ogTitleEl.setAttribute('content', seoTitle);
  if (ogDescEl) ogDescEl.setAttribute('content', seoDesc);
  if (ogImageEl) ogImageEl.setAttribute('content', seoImage);
  if (ogSiteNameEl) ogSiteNameEl.setAttribute('content', ogSiteName);
  
  // Update Twitter Card tags
  if (twitterTitleEl) twitterTitleEl.setAttribute('content', seoTitle);
  if (twitterDescEl) twitterDescEl.setAttribute('content', seoDesc);
  if (twitterImageEl) twitterImageEl.setAttribute('content', seoImage);
  
  // Add Twitter handle if provided
  if (twitterHandle) {
    const twitterSiteEl = document.getElementById('twitter-site');
    if (!twitterSiteEl) {
      const meta = document.createElement('meta');
      meta.id = 'twitter-site';
      meta.name = 'twitter:site';
      meta.content = twitterHandle;
      document.head.appendChild(meta);
    } else {
      twitterSiteEl.setAttribute('content', twitterHandle);
    }
  }

  // Update robots meta tag based on allowIndexing setting
  if (robotsEl) {
    const allowIndexing = settings?.allowIndexing !== false; // Default to true
    robotsEl.setAttribute('content', allowIndexing ? 'index, follow' : 'noindex, nofollow');
  }
};

export default function PublicProfilePage() {
  const [, params] = useRoute('/:handle');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const { setTheme } = useTheme();

  // Check if we're on a custom domain
  const customHandle = (window as any).__CUSTOM_DOMAIN_HANDLE__;

  useEffect(() => {
    const handleToUse = customHandle || params?.handle;
    
    if (!handleToUse) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Extract handle from URL (e.g., "username.bsky.social")
        // Remove @ symbol if present (some URLs might have @username.bsky.social)
        let handle = handleToUse;
        if (handle.startsWith('@')) {
          handle = handle.substring(1);
        }
        
        console.log('Resolving handle:', handle);
        
        let profileData;
        let did;
        
        // If the user is viewing their own profile, use the authenticated user's data
        if (currentUser && currentUser.handle === handle) {
          profileData = currentUser;
          did = currentUser.did;
        } else {
          // For other users, try to get public profile data
          profileData = await atprotocol.getPublicProfile(handle);
          did = profileData.did;
        }
        
        // Create UserProfile object
        const userProfile: UserProfile = {
          did: did,
          handle: handle,
          displayName: profileData.displayName || '',
          description: profileData.description || '',
          avatar: profileData.avatar || '',
          banner: profileData.banner || '',
          associated: profileData.associated,
          labels: profileData.labels,
          followersCount: profileData.followersCount || 0,
          followsCount: profileData.followsCount || 0,
          postsCount: profileData.postsCount || 0,
          createdAt: profileData.createdAt || new Date().toISOString(),
        };
        
        setProfile(userProfile);
        
        // Load settings for this user
        try {
          console.log('📥 Loading settings for DID:', did);
          const settingsData = await atprotocol.getPublicSettings(did);
          console.log('📥 Loaded public settings data:', settingsData);
          const loadedSettings = settingsData?.settings || null;
          console.log('📥 Loaded settings object:', loadedSettings);
          console.log('📥 Social links:', loadedSettings?.socialLinks);
          console.log('📥 Social icons config:', loadedSettings?.socialIconsConfig);
          setSettings(loadedSettings);
          
          // Apply theme from loaded settings
          if (loadedSettings && loadedSettings.theme) {
            console.log('🎨 Applying public profile theme:', loadedSettings.theme);
            console.log('🎨 Theme has background image:', loadedSettings.theme.backgroundImage);
            console.log('🎨 Theme background color:', loadedSettings.theme.backgroundColor);
            setTheme(loadedSettings.theme);
          }

          // Update SEO meta tags from loaded settings
          updateMetaTags(loadedSettings, userProfile);
        } catch (settingsErr: any) {
          console.error('Failed to load settings:', settingsErr);
          // Settings loading failure shouldn't break the profile page
          setSettings(null);
        }
      } catch (err: any) {
        console.error('Failed to load profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [params?.handle, customHandle]);

  // Apply background image when settings change
  useEffect(() => {
    console.log('🎨 Background image effect triggered');
    console.log('🎨 Settings:', settings);
    console.log('🎨 Theme:', settings?.theme);
    console.log('🎨 Background image URL:', settings?.theme?.backgroundImage);
    
    if (settings?.theme?.backgroundImage) {
      console.log('🎨 ✅ APPLYING background image:', settings.theme.backgroundImage);
      const body = document.body;
      body.style.setProperty('background-image', `url(${settings.theme.backgroundImage})`, 'important');
      body.style.setProperty('background-size', 'cover', 'important');
      body.style.setProperty('background-position', 'center', 'important');
      body.style.setProperty('background-repeat', 'no-repeat', 'important');
      body.style.setProperty('background-attachment', 'fixed', 'important');
      body.style.setProperty('background-color', 'transparent', 'important');
      
      // Log final computed styles
      console.log('🎨 Body background-image:', window.getComputedStyle(body).backgroundImage);
      console.log('🎨 Body background-color:', window.getComputedStyle(body).backgroundColor);
    } else {
      console.log('🎨 ❌ No background image to apply');
    }
    
    // Cleanup when leaving the page
    return () => {
      if (settings?.theme?.backgroundImage) {
        console.log('🎨 Cleaning up background image');
        const body = document.body;
        body.style.removeProperty('background-image');
        body.style.removeProperty('background-size');
        body.style.removeProperty('background-position');
        body.style.removeProperty('background-repeat');
        body.style.removeProperty('background-attachment');
        body.style.removeProperty('background-color');
      }
    };
  }, [settings?.theme?.backgroundImage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50" data-testid="header">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <span className="text-muted-foreground">|</span>
              <img 
                src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                alt="Basker"
                className="w-6 h-6 rounded-full"
              />
              <h1 className="text-xl font-bold text-primary" data-testid="text-brand">Basker</h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50" data-testid="header">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <span className="text-muted-foreground">|</span>
              <img 
                src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                alt="Basker"
                className="w-6 h-6 rounded-full"
              />
              <h1 className="text-xl font-bold text-primary" data-testid="text-brand">Basker</h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50" data-testid="header">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <span className="text-muted-foreground">|</span>
              <img 
                src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                alt="Basker"
                className="w-6 h-6 rounded-full"
              />
              <h1 className="text-xl font-bold text-primary" data-testid="text-brand">Basker</h1>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>
              Profile not found
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${settings?.theme?.backgroundImage ? 'bg-transparent' : 'bg-background'}`}>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50" data-testid="header">
        <div className="max-w-4xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/" className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                alt="Basker"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
              />
              <h1 className="text-lg sm:text-xl font-bold text-primary" data-testid="text-brand">Basker</h1>
            </Link>
            <span className="text-muted-foreground hidden sm:block">|</span>
            <span className="text-xs sm:text-sm text-muted-foreground" data-testid="text-user-handle">
              @{profile.handle}
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/">
              <Button variant="secondary" size="sm" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Profile Header */}
        <ProfileHeader 
          profile={profile}
          isEditMode={false}
          isOwnProfile={false}
          targetDid={profile.did}
        />
        
        {/* Social Icons Row - above sections placement */}
        {settings?.socialIconsConfig?.placement === 'above-sections' && settings?.socialLinks && (
          <div className="mb-0">
            <div className="flex items-center justify-center">
              <SocialIconsRow 
                socialLinks={settings.socialLinks} 
                config={settings.socialIconsConfig}
                isEditMode={false}
              />
            </div>
          </div>
        )}
        
        {(() => {
          // Use the loaded settings section order, or default if not available
          const sectionOrder = settings?.sectionOrder || ['widgets', 'notes', 'links'];
          console.log('🔍 Public profile section order:', sectionOrder);
          return sectionOrder.map((section) => {
            switch (section) {
              case 'widgets':
                return <PublicWidgets key="widgets" did={profile.did} />;
              case 'notes':
                return <PublicNotes key="notes" did={profile.did} />;
              case 'links':
                return <PublicLinksList key="links" did={profile.did} />;
              default:
                return null;
            }
          });
        })()}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border mt-8" data-testid="footer">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <span className="text-sm">Powered by</span>
            <img 
              src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
              alt="Basker"
              className="w-4 h-4 rounded-full"
            />
            <span className="text-sm">basker</span>
            <span className="text-sm text-muted-foreground">© 2025</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Create your own link-in-bio page with basker
          </p>
        </footer>
      </main>
    </div>
  );
}

// Public versions of components that only show public content
function PublicLinksList({ did }: { did: string }) {
  const [links, setLinks] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [linksData, groupsData] = await Promise.all([
          atprotocol.getPublicLinks(did),
          atprotocol.getPublicGroups(did)
        ]);
        setLinks(linksData?.links || []);
        setGroups(groupsData || []);
      } catch (err) {
        console.error('🔍 PublicProfile failed to load data:', err);
        setLinks([]);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    if (did) { loadData(); }
  }, [did]);

  const getIconComponent = (iconClass: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      // Social Media
      'fab fa-github': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
      'fab fa-twitter': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
      'fab fa-youtube': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
      'fab fa-instagram': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
      'fab fa-linkedin': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
      'fab fa-discord': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>,
      
      // General Icons
      'fas fa-globe': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>,
      'fas fa-envelope': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
      'fas fa-link': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>,
      'fas fa-heart': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
      'fas fa-music': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
      'fas fa-camera': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.4-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg>,
    };

    return iconMap[iconClass] || <ExternalLink className="w-5 h-5" />;
  };

  const renderLinkCard = (link: any, isGrouped: boolean = false) => {
    const linkStyling = getLinkStyling(link);
    const linkContent = (
      <div className="relative">
        <div
          className={`rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow cursor-pointer ${linkStyling.shapeClasses}`}
          style={linkStyling}
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 bg-primary/10 flex items-center justify-center ${linkStyling.iconBorderShape}`}
                style={{ 
                  color: linkStyling.iconColor || undefined,
                  border: linkStyling.iconBorderWidth !== '0px' 
                    ? `${linkStyling.iconBorderWidth} ${linkStyling.iconBorderStyle} ${linkStyling.iconBorderColor}` 
                    : 'none'
                }}
              >
                {getIconComponent(link.icon || 'fas fa-link')}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{link.title}</h4>
                {link.description && (
                  <p className="text-sm text-muted-foreground truncate">{link.description}</p>
                )}
                <p className="text-[10px] sm:text-xs truncate max-w-[180px] sm:max-w-none">
                  {link.url}
                </p>
              </div>
              <div className="flex-shrink-0">
                <i className="fas fa-external-link-alt text-xs text-muted-foreground"></i>
              </div>
            </div>
          </div>
        </div>
        <GlareHover
          width="100%"
          height="100%"
          background="transparent"
          borderRadius="inherit"
          borderColor="transparent"
          glareColor="#ffffff"
          glareOpacity={0.3}
          glareAngle={-45}
          glareSize={200}
          transitionDuration={600}
          className="absolute inset-0"
        />
      </div>
    );

    // If pixel transition is enabled, add it as an overlay
    if (linkStyling.pixelTransition) {
      const revealText = linkStyling.pixelTransitionText || link.title;
      return (
        <div className="relative w-full">
          {linkContent}
          <div className="absolute inset-0 pointer-events-none">
            <PixelTransition
              firstContent={
                <div 
                  className="w-full h-full opacity-0"
                  style={{ backgroundColor: linkStyling.backgroundColor || 'var(--background)' }}
                >
                  {/* Transparent by default, but will show link's background when active */}
                </div>
              }
              secondContent={
                <div 
                  className="w-full h-full flex items-center justify-center p-4 rounded-lg"
                  style={{ backgroundColor: linkStyling.backgroundColor || 'var(--background)' }}
                >
                  <div className="text-center">
                    <h4 
                      className="font-medium"
                      style={{ color: linkStyling.color || 'var(--foreground)' }}
                    >
                      {revealText}
                    </h4>
                  </div>
                </div>
              }
              gridSize={linkStyling.pixelTransitionGridSize}
              pixelColor={linkStyling.pixelTransitionColor}
              animationStepDuration={linkStyling.pixelTransitionDuration}
              className="w-full h-full"
            />
          </div>
        </div>
      );
    }

    return linkContent;
  };

  if (loading) return <Skeleton className="h-32 w-full" />;
  if (links.length === 0) return null;

  // Group links by group name
  const groupedLinks = links.reduce((acc, link) => {
    const groupName = link.group || 'Ungrouped';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(link);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort links within each group
  Object.keys(groupedLinks).forEach(groupName => {
    groupedLinks[groupName].sort((a, b) => a.order - b.order);
  });

  // Get unique group names from links and groups
  const getUniqueGroups = () => {
    const linkGroups = links.map(link => link.group).filter((group): group is string => Boolean(group));
    const persistentGroups = groups.map(group => group.name);
    const allGroups = [...linkGroups, ...persistentGroups];
    const uniqueGroups = Array.from(new Set(allGroups));
    return uniqueGroups;
  };

  return (
    <div className="mb-2 fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Links</h3>
      <div className="space-y-4">
        {/* Show ungrouped links first */}
        {groupedLinks['Ungrouped'] && groupedLinks['Ungrouped'].length > 0 && (
          <div className="space-y-3">
            {groupedLinks['Ungrouped'].map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                {renderLinkCard(link)}
              </a>
            ))}
          </div>
        )}

        {/* Show grouped links */}
        {getUniqueGroups().map((groupName) => {
          const groupLinks = groupedLinks[groupName] || [];
          if (groupLinks.length === 0) return null;
          
          const groupData = groups.find(g => g.name === groupName);
          const isGroupOpen = groupData ? groupData.isOpen : true;
          
          return (
            <div key={groupName} className="space-y-2">
              <h4 
                className="text-sm font-medium uppercase tracking-wide flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: groupData?.titleTextColor || '#ffffff' }}
                onClick={() => {
                  // Toggle group visibility by updating the groups state
                  setGroups(prevGroups => 
                    prevGroups.map(g => 
                      g.name === groupName 
                        ? { ...g, isOpen: !g.isOpen }
                        : g
                    )
                  );
                }}
              >
                <span className="text-lg">{isGroupOpen ? '🔽' : '▶️'}</span>
                📁 {groupName}
                <span className="text-xs">({groupLinks.length})</span>
              </h4>
              
              {isGroupOpen && (
                <div className="space-y-3">
                  {groupLinks.map((link) => (
                    <a 
                      key={link.id} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {renderLinkCard(link)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
        console.log('Loaded notes:', data?.notes);
      } catch (err) {
        console.error('Failed to load notes:', err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    if (did) { loadNotes(); }
  }, [did]);

  if (loading) return <Skeleton className="h-32 w-full" />;
  if (notes.length === 0) return null;

  return (
    <div className="mb-2 fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Notes</h3>
      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-sm">📝</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">
                      {note.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
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
  const [widgets, setWidgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWidgets = async () => {
      try {
        console.log('Loading widgets for DID:', did);
        const data = await atprotocol.getPublicWidgets(did);
        setWidgets(data?.widgets || []);
        console.log('Loaded widgets:', data?.widgets);
      } catch (err) {
        console.error('Failed to load widgets:', err);
        setWidgets([]);
      } finally {
        setLoading(false);
      }
    };
    if (did) { loadWidgets(); }
  }, [did]);

  const renderWidget = (widget: any) => {
    if (!widget.enabled) return null;

    const config = widget.config || {};
    
    switch (widget.type) {
      case 'clock':
        return <PublicClockWidget config={config} />;
      case 'custom_code':
        return <PublicCustomCodeWidget config={config} />;
      case 'social_badge':
        return <PublicSocialBadgeWidget config={config} />;
      case 'weather':
        return <PublicWeatherWidget config={config} />;
      case 'quote':
        return <PublicQuoteWidget config={config} />;
      case 'counter':
        return <PublicCounterWidget config={config} />;
      case 'progress_bar':
        return <PublicProgressBarWidget config={config} />;
      case 'calendar':
        return <PublicCalendarWidget config={config} />;
      case 'music_player':
        return <PublicMusicPlayerWidget config={config} />;
      case 'donation':
        return <PublicDonationWidget config={config} />;
      case 'contact_form':
        return <PublicContactFormWidget config={config} />;
      case 'embed':
        return <PublicEmbedWidget config={config} />;
      case 'text_block':
        return <PublicTextBlockWidget config={config} />;
      case 'image_gallery':
        return <PublicImageGalleryWidget config={config} />;
      case 'stats':
        return <PublicStatsWidget config={config} />;
      case 'announcement':
        return <PublicAnnouncementWidget config={config} />;
      case 'todo_list':
        return <PublicTodoListWidget config={config} />;
      case 'countdown':
        return <PublicCountdownWidget config={config} />;
      case 'qr_code':
        return <PublicQRCodeWidget config={config} />;
      case 'social_links':
        return <PublicSocialLinksWidget config={config} />;
      case 'testimonial':
        return <PublicTestimonialWidget config={config} />;
      case 'pricing_table':
        return <PublicPricingTableWidget config={config} />;
      case 'newsletter':
        return <PublicNewsletterWidget config={config} />;
      case 'recent_posts':
        return <PublicRecentPostsWidget config={config} />;
      case 'poll':
        return <PollWidget config={config} isEditMode={false} />;
      case 'live_chat':
        return <PublicLiveChatWidget config={config} />;
      case 'blog_posts':
        return <PublicBlogPostsWidget config={config} />;
      case 'heat_map':
        return <PublicHeatMapWidget config={config} />;
      case 'work_history':
        return <WorkHistoryWidget isPublic={true} targetDid={did} />;
      case 'product_showcase':
        return <PublicProductShowcaseWidget config={config} />;
      case 'github_activity':
        return <GitHubActivityWidget config={config} />;
      case 'kofi_support':
        return <KofiSupportWidget config={config} />;
      case 'reaction_bar':
        return <ReactionBarWidget config={config} widgetId={widget.id} />;
      case 'spinning_wheel':
        return <SpinningWheelWidget config={config} widgetId={widget.id} />;
      case 'before_after_slider':
        return <BeforeAfterSliderWidget config={config} />;
      case 'mini_game':
        return <MiniGameWidget config={config} />;
      default:
        return <div className="p-4 bg-muted rounded-lg">Unknown widget type: {widget.type}</div>;
    }
  };

  if (loading) return <Skeleton className="h-32 w-full" />;
  if (widgets.length === 0) return null;

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'w-64'; // 256px
      case 'medium': return 'w-80'; // 320px
      case 'large': return 'w-96'; // 384px
      case 'full': return 'w-full';
      default: return 'w-full'; // Default to full width
    }
  };

  return (
    <div className="mb-2 fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Widgets</h3>
      <div className="space-y-6">
        {widgets
          .filter(w => w.enabled)
          .sort((a, b) => a.order - b.order)
          .reduce((acc: any[], widget, index) => {
            // Group widgets for side-by-side layout
            if (widget.width === 'half' && index > 0 && widgets[index - 1]?.width === 'half') {
              // This widget should be paired with the previous one
              return acc;
            }
            
            if (widget.width === 'half' && index < widgets.length - 1 && widgets[index + 1]?.width === 'half') {
              // This widget should be paired with the next one
              acc.push(widget);
              return acc;
            }
            
            acc.push(widget);
            return acc;
          }, [])
          .map((widget, index) => {
            const nextWidget = widgets.find(w => w.order === widget.order + 1);
            const isSideBySide = widget.width === 'half' && nextWidget?.width === 'half';
            
            return (
              <div key={widget.id} className={`relative group ${isSideBySide ? 'flex flex-col md:flex-row gap-6' : ''}`}>
                {/* First widget */}
                <div className="relative group flex-1">
                  <div className={`${getSizeClass(widget.size)} mx-auto h-full`}>
                    <Card className="w-full h-full flex flex-col">
                      <CardContent className="pt-8 flex-1">
                        {renderWidget(widget)}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Second widget (if side-by-side) */}
                {isSideBySide && nextWidget && (
                  <div className="relative group flex-1">
                    <div className={`${getSizeClass(nextWidget.size)} mx-auto h-full`}>
                      <Card className="w-full h-full flex flex-col">
                        <CardContent className="pt-8 flex-1">
                          {renderWidget(nextWidget)}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

// Public Widget Components (simplified versions for public viewing)
function PublicClockWidget({ config }: { config: any }) {
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    if (config.format === '24h') {
      return date.toLocaleTimeString('en-US', { hour12: false });
    }
    return date.toLocaleTimeString('en-US', { hour12: true });
  };

  return (
    <div className="text-center">
      <div className="text-3xl font-mono font-bold text-primary">
        {formatTime(time)}
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        {time.toLocaleDateString()}
      </div>
    </div>
  );
}

function PublicCustomCodeWidget({ config }: { config: any }) {
  return (
    <div className="space-y-2">
      <div 
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: config.html || '<p>Add your custom HTML code in the widget settings.</p>' }}
      />
      {config.css && (
        <style dangerouslySetInnerHTML={{ __html: config.css }} />
      )}
      {config.js && (
        <script dangerouslySetInnerHTML={{ __html: config.js }} />
      )}
    </div>
  );
}

function PublicSocialBadgeWidget({ config }: { config: any }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        <Users className="w-4 h-4 text-primary-foreground" />
      </div>
      <div>
        <div className="font-medium">@{config.username || 'username'}</div>
        {config.showCount && (
          <div className="text-sm text-muted-foreground">
            {Math.floor(Math.random() * 10000)} followers
          </div>
        )}
      </div>
    </div>
  );
}

function PublicWeatherWidget({ config }: { config: any }) {
  return (
    <div className="flex items-center gap-3">
      <Cloud className="w-8 h-8 text-blue-500" />
      <div>
        <div className="font-medium">{config.location || 'Your Location'}</div>
        <div className="text-sm text-muted-foreground">
          22°C • Sunny
        </div>
      </div>
    </div>
  );
}

function PublicQuoteWidget({ config }: { config: any }) {
  return (
    <blockquote className="border-l-4 border-primary pl-4 italic">
      <p className="text-lg mb-2">
        "{config.text || 'Your inspiring quote here'}"
      </p>
      {config.author && (
        <cite className="text-sm text-muted-foreground">— {config.author}</cite>
      )}
    </blockquote>
  );
}

function PublicCounterWidget({ config }: { config: any }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-primary mb-1">
        {config.count || 0}
      </div>
      <div className="text-sm text-muted-foreground">
        {config.label || 'Count'}
      </div>
    </div>
  );
}

function PublicProgressBarWidget({ config }: { config: any }) {
  const percentage = Math.min(((config.current || 0) / (config.target || 100)) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{config.label || 'Progress'}</span>
        <span>{config.current || 0}/{config.target || 100} {config.unit || ''}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function PublicCalendarWidget({ config }: { config: any }) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const today = new Date();
  const currentMonth = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const events = config?.events || [];
  
  // Get the actual number of days in the current month
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  // Create empty cells for days before the first day of the month
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`empty-${i}`} className="p-1"></div>
  ));
  
  // Filter events for the current month
  const getEventsForDate = (day: number) => {
    return events.filter((event: any) => {
      try {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === today.getMonth() && 
               eventDate.getFullYear() === today.getFullYear() && 
               eventDate.getDate() === day;
      } catch {
        return false;
      }
    });
  };
  
  // Create array for days of the month
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayEvents = getEventsForDate(day);
    
    return (
      <div key={day} className="relative">
        <div 
          className={`text-center p-1 rounded relative z-10 ${
            day === today.getDate() ? 'bg-primary text-primary-foreground' : ''
          }`}
        >
          {day}
        </div>
        {dayEvents.length > 0 && (
          <>
            {/* Dot behind the number */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dayEvents[0].color || '#3b82f6' }}
              />
            </div>
            {/* Clickable layer on top */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              title={`${dayEvents[0].title} - Click for details`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(dayEvents[0]);
              }}
            >
              <div className="w-4 h-4 rounded-full hover:bg-black/10 transition-colors" />
            </div>
          </>
        )}
      </div>
    );
  });
  
  return (
    <>
      <div className="space-y-2">
        <div className="font-medium text-center">{currentMonth}</div>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-muted-foreground p-1">
              {day}
            </div>
          ))}
          {emptyCells}
          {monthDays}
        </div>
        {events.length > 0 && (
          <div className="mt-3 space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Events:</div>
            {events.slice(0, 3).map((event: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color || '#3b82f6' }}
                />
                <span className="truncate">{event.title}</span>
              </div>
            ))}
            {events.length > 3 && (
              <div className="text-xs text-muted-foreground">+{events.length - 3} more events</div>
            )}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: selectedEvent?.color || '#3b82f6' }}
              />
              Event Details
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Event Title</Label>
                <p className="text-lg font-semibold">{selectedEvent.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                <p className="text-base">{selectedEvent.date}</p>
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedEvent(null)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function PublicMusicPlayerWidget({ config }: { config: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  
  const platform = config.platform || 'spotify';
  const trackId = config.trackId || '';
  const trackName = config.trackName || '';
  const artistName = config.artistName || '';
  const audioUrl = config.audioUrl || '';
  
  // For audio files, use HTML5 audio player
  const isAudioFile = audioUrl && (audioUrl.endsWith('.mp3') || audioUrl.endsWith('.wav') || audioUrl.endsWith('.ogg'));
  
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => setIsPlaying(false));
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);
  
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const value = parseFloat(e.target.value);
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(value);
  };
  
  // If it's an audio file URL, show custom player
  if (isAudioFile) {
    return (
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-lg">
        <audio ref={audioRef} src={audioUrl} />
        <div className="flex items-center gap-3 mb-3">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
            onClick={togglePlay}
          >
            {isPlaying ? '⏸' : '▶'}
          </Button>
          <div className="flex-1">
            <div className="font-semibold text-sm">{trackName}</div>
            <div className="text-xs opacity-90">{artistName}</div>
          </div>
          <Music className="w-6 h-6 opacity-75" />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
          }}
        />
      </div>
    );
  }
  
  // Check if configuration is incomplete
  if (!trackId && !audioUrl) {
    return (
      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border-2 border-dashed">
        <Music className="w-6 h-6 text-muted-foreground" />
        <div className="flex-1 text-center">
          <div className="font-medium text-muted-foreground">No music configured</div>
        </div>
      </div>
    );
  }
  
  // If there's a trackId but no track name/artist, show incomplete state
  if (trackId && (!trackName || !artistName)) {
    return (
      <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border-2 border-amber-200 dark:border-amber-800">
        <Music className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        <div className="flex-1 text-center">
          <div className="font-medium text-amber-900 dark:text-amber-100 text-sm">Music player configuration incomplete</div>
        </div>
      </div>
    );
  }
  
  // Show clickable music card that opens the platform
  return (
    <a
      href={trackId}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          <Music className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="font-semibold">{trackName}</div>
          <div className="text-sm opacity-90">{artistName}</div>
          <div className="text-xs opacity-75 mt-1">
            Play on {platform === 'spotify' ? 'Spotify' : platform === 'apple_music' ? 'Apple Music' : platform === 'soundcloud' ? 'SoundCloud' : 'YouTube'}
          </div>
        </div>
        <ExternalLink className="w-5 h-5 opacity-75" />
      </div>
    </a>
  );
}

function PublicDonationWidget({ config }: { config: any }) {
  return (
    <div className="text-center space-y-3">
      <Heart className="w-8 h-8 text-red-500 mx-auto" />
      <div>
        <div className="font-medium">Support Me</div>
        <div className="text-sm text-muted-foreground">
          {config.message || 'Help support my work'}
        </div>
      </div>
      <Button className="w-full">
        Donate {config.amount && `$${config.amount}`}
      </Button>
    </div>
  );
}

function PublicContactFormWidget({ config }: { config: any }) {
  const userEmail = config?.email || 'your@email.com';
  
  const handleEmailClick = () => {
    const subject = config?.subject || 'Hello';
    const body = config?.message || 'Hi there!';
    const mailtoLink = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="space-y-4 text-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">Contact Me</h3>
        <p className="text-sm text-muted-foreground">Get in touch with me</p>
      </div>
      
      <div className="space-y-3">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Email me at:</p>
          <p className="text-base font-medium">{userEmail}</p>
        </div>
        
        <Button 
          onClick={handleEmailClick} 
          className="w-full"
          variant="outline"
        >
          <Mail className="w-4 h-4 mr-2" />
          Open Email Client
        </Button>
      </div>
    </div>
  );
}

function PublicEmbedWidget({ config }: { config: any }) {
  if (!config.url) {
    return (
      <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
        Add a URL in the widget settings
      </div>
    );
  }
  
  return (
    <div className="aspect-video">
      <iframe
        src={config.url}
        width={config.width || 560}
        height={config.height || 315}
        frameBorder="0"
        allowFullScreen
        className="w-full h-full rounded-lg"
      />
    </div>
  );
}

function PublicTextBlockWidget({ config }: { config: any }) {
  return (
    <div className="prose prose-sm max-w-none">
      <div dangerouslySetInnerHTML={{ 
        __html: config.content || '<p>Add your text content in the widget settings.</p>' 
      }} />
    </div>
  );
}

function PublicImageGalleryWidget({ config }: { config: any }) {
  return (
    <div className="space-y-2">
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <Image className="w-8 h-8 text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Add images in settings</span>
      </div>
    </div>
  );
}

function PublicStatsWidget({ config }: { config: any }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{config?.stat1Value || '0'}</div>
        <div className="text-sm text-muted-foreground">{config?.stat1Label || 'Views'}</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{config?.stat2Value || '0'}</div>
        <div className="text-sm text-muted-foreground">{config?.stat2Label || 'Downloads'}</div>
      </div>
    </div>
  );
}

function PublicAnnouncementWidget({ config }: { config: any }) {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getTypeStyles(config.type || 'info')}`}>
      <div className="flex items-start gap-2">
        <Megaphone className="w-5 h-5 mt-0.5" />
        <div className="flex-1">
          {config.message || 'Add your announcement message in the widget settings.'}
        </div>
      </div>
    </div>
  );
}

// New Public Widget Components
function PublicTodoListWidget({ config }: { config: any }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{config.title || 'My Tasks'}</h3>
      <div className="space-y-2">
        {(config.items || []).map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border-2 ${
              item.completed ? 'bg-primary border-primary' : 'border-muted-foreground'
            }`}>
              {item.completed && <X className="w-3 h-3 text-white" />}
            </div>
            <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
              {item.text || `Task ${index + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicCountdownWidget({ config }: { config: any }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!config.targetDate) return;

    const target = new Date(config.targetDate).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [config.targetDate]);

  return (
    <div className="text-center">
      <h3 className="font-semibold text-lg mb-4">{config.title || 'Countdown'}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {config.showDays && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold">{timeLeft.days}</div>
            <div className="text-sm text-muted-foreground">Days</div>
          </div>
        )}
        {config.showHours && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm text-muted-foreground">Hours</div>
          </div>
        )}
        {config.showMinutes && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </div>
        )}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-sm text-muted-foreground">Seconds</div>
        </div>
      </div>
    </div>
  );
}

function PublicQRCodeWidget({ config }: { config: any }) {
  return (
    <div className="text-center">
      <h3 className="font-semibold text-lg mb-4">{config.title || 'QR Code'}</h3>
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="text-sm text-muted-foreground">
          QR Code for: {config.text || 'No text provided'}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Size: {config.size || 200}px
        </div>
      </div>
    </div>
  );
}

function PublicSocialLinksWidget({ config }: { config: any }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{config.title || 'Follow Me'}</h3>
      <div className="grid grid-cols-2 gap-3">
        {(config.links || []).map((link: any, index: number) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{link.platform || 'Social'}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function PublicTestimonialWidget({ config }: { config: any }) {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Heart
            key={i}
            className={`w-4 h-4 ${
              i < (config.rating || 5) ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
      <blockquote className="text-lg italic">
        "{config.text || 'This is a great service!'}"
      </blockquote>
      <div>
        <div className="font-semibold">{config.author || 'Customer'}</div>
        <div className="text-sm text-muted-foreground">{config.role || 'Client'}</div>
      </div>
    </div>
  );
}

function PublicPricingTableWidget({ config }: { config: any }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-center">{config.title || 'Pricing Plans'}</h3>
      <div className="grid gap-4">
        {(config.plans || []).map((plan: any, index: number) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="text-center">
              <h4 className="font-semibold text-lg">{plan.name || `Plan ${index + 1}`}</h4>
              <div className="text-2xl font-bold text-primary">{plan.price || '$0'}</div>
              <div className="text-sm text-muted-foreground">{plan.period || '/month'}</div>
            </div>
            <ul className="mt-4 space-y-2">
              {(plan.features || []).map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicNewsletterWidget({ config }: { config: any }) {
  return (
    <div className="text-center space-y-4">
      <h3 className="font-semibold text-lg">{config.title || 'Newsletter'}</h3>
      <p className="text-sm text-muted-foreground">
        {config.description || 'Subscribe to our newsletter'}
      </p>
      <div className="space-y-2">
        <Input
          placeholder={config.placeholder || 'Enter your email'}
          className="w-full"
          disabled
        />
        <Button className="w-full" disabled>
          Subscribe
        </Button>
      </div>
    </div>
  );
}

function PublicRecentPostsWidget({ config }: { config: any }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{config.title || 'Recent Posts'}</h3>
      <div className="space-y-3">
        {(config.posts || []).slice(0, config.showCount || 3).map((post: any, index: number) => (
          <div key={index} className="border-b border-border pb-3 last:border-b-0">
            <h4 className="font-medium text-sm">{post.title || `Post ${index + 1}`}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {post.excerpt || 'No excerpt available'}
            </p>
            <div className="text-xs text-muted-foreground mt-2">
              {post.date || 'No date'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function PublicLiveChatWidget({ config }: { config: any }) {
  if (!config.isActive) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">Live chat is currently offline</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="font-semibold">{config.title || 'Live Chat'}</h3>
      </div>
      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Chat is available! Click to start a conversation.
        </p>
      </div>
    </div>
  );
}

function PublicBlogPostsWidget({ config }: { config: any }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{config.title || 'Latest Posts'}</h3>
      <div className="space-y-3">
        {(config.posts || []).slice(0, config.showCount || 3).map((post: any, index: number) => (
          <div key={index} className="border-b border-border pb-3 last:border-b-0">
            <h4 className="font-medium text-sm hover:text-primary cursor-pointer">
              {post.title || `Blog Post ${index + 1}`}
            </h4>
            {config.showExcerpt && post.excerpt && (
              <p className="text-xs text-muted-foreground mt-1">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              {config.showDate && (
                <span>{post.date || 'No date'}</span>
              )}
              {config.showViews && (
                <span>{post.views || 0} views</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicHeatMapWidget({ config }: { config: any }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{config.title || 'Analytics'}</h3>
      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Analytics data is only visible to the profile owner
        </p>
      </div>
    </div>
  );
}

function PublicProductShowcaseWidget({ config }: { config: any }) {
  const products = config.products || [];
  
  if (products.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">{config.title || 'Products'}</h3>
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            No products available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{config.title || 'Products'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: any, index: number) => (
          <div key={index} className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
            {product.imageUrl && (
              <div className="aspect-square mb-3 rounded-lg overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm">{product.name}</h4>
                {product.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Featured</span>
                )}
              </div>
              
              {product.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {product.price && (
                    <span className="font-semibold text-sm">
                      {product.currency || '$'}{product.price}
                    </span>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      {product.currency || '$'}{product.originalPrice}
                    </span>
                  )}
                </div>
                
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs">⭐</span>
                    <span className="text-xs">{product.rating}</span>
                  </div>
                )}
              </div>
              
              {product.platformUrl && (
                <a
                  href={product.platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mt-3 bg-primary text-primary-foreground text-center py-2 px-4 rounded-md text-sm hover:bg-primary/90 transition-colors"
                >
                  {product.isAvailable ? 'View Product' : 'Coming Soon'}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

