import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '../contexts/AuthContext';
import { useLinks, useSettings, useSaveSettings, usePublicSettings, useWorkHistory, usePublicWorkHistory, useCompanies } from '../hooks/use-atprotocol';
import { atprotocol } from '../lib/atprotocol';
import { useEditMode } from './EditModeProvider';
import { Eye, Link as LinkIcon, Camera, Edit, CheckCircle, AlertCircle, Building2, Loader2, UserPlus, UserMinus, ExternalLink, BadgeCheck, CheckCircle2 } from 'lucide-react';
import { ProfileImageUpload } from './ProfileImageUpload';
import { BannerUpload } from './BannerUpload';
import { StoriesRing } from './StoriesRing';
import { PublicStoriesRing } from './PublicStoriesRing';
import { SocialIconsRow } from './SocialIconsRow';
import { SocialIconsEditor } from './SocialIconsEditor';
import { UserProfile } from '@shared/schema';
import { isVerifiedAccount, isTrustedVerifier, getVerificationTooltip } from '../lib/verification-utils';

interface ProfileHeaderProps {
  profile?: UserProfile;
  isEditMode?: boolean;
  isOwnProfile?: boolean;
  targetDid?: string; // For public profiles
  onOpenSettings?: () => void; // Callback to open settings modal
}

export function ProfileHeader({ profile: propProfile, isEditMode: propIsEditMode, isOwnProfile = true, targetDid, onOpenSettings }: ProfileHeaderProps) {
  const { user } = useAuth();
  const { data: links = [] } = useLinks();
  const { isEditMode: contextEditMode } = useEditMode();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showBannerUpload, setShowBannerUpload] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followUri, setFollowUri] = useState<string | null>(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Use props if provided, otherwise fall back to context
  const profile = propProfile || user;
  const isEditMode = propIsEditMode !== undefined ? propIsEditMode : contextEditMode;
  
  // Fetch appropriate settings based on context
  const isPublicProfile = !isOwnProfile && !!targetDid;
  const { data: ownSettings } = useSettings(!isPublicProfile);
  const { data: publicSettings } = usePublicSettings(isPublicProfile ? targetDid : null);
  const { mutate: saveSettings } = useSaveSettings();
  
  const { data: workHistory = [] } = useWorkHistory();
  const { data: publicWorkHistory = [] } = usePublicWorkHistory(isPublicProfile ? targetDid : null);
  const { data: companies = [] } = useCompanies();
  const effectiveWorkHistory = isPublicProfile ? publicWorkHistory : workHistory;
  
  // Use the appropriate settings for the current context
  const effectiveSettings = isPublicProfile ? publicSettings : ownSettings;

  console.log('🔍 ProfileHeader - profile:', profile);
  console.log('🔍 ProfileHeader - isEditMode:', isEditMode, 'isOwnProfile:', isOwnProfile, 'targetDid:', targetDid);
  console.log('🔍 ProfileHeader - isPublicProfile:', isPublicProfile, 'ownSettings:', ownSettings, 'publicSettings:', publicSettings, 'effectiveSettings:', effectiveSettings);
  console.log('🔍 ProfileHeader - bannerAdjustment:', effectiveSettings?.bannerAdjustment);
  console.log('🔍 ProfileHeader - profile.banner:', profile?.banner);

  // Initialize bio text when settings change
  React.useEffect(() => {
    if (effectiveSettings?.customBio !== undefined) {
      setBioText(effectiveSettings.customBio || '');
    }
  }, [effectiveSettings?.customBio]);

  // Check follow status when viewing someone else's profile
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (isPublicProfile && targetDid && user?.did !== targetDid) {
        try {
          const followStatus = await atprotocol.getFollowStatus(targetDid);
          setIsFollowing(followStatus.isFollowing);
          setFollowUri(followStatus.followUri);
        } catch (error) {
          console.error('Failed to check follow status:', error);
        }
      }
    };

    checkFollowStatus();
  }, [isPublicProfile, targetDid, user?.did]);

  const handleSaveBio = () => {
    if (!ownSettings || isPublicProfile) return;
    
    const updatedSettings = {
      ...ownSettings,
      customBio: bioText.trim() || undefined,
    };
    
    saveSettings(updatedSettings, {
      onSuccess: () => {
        setIsEditingBio(false);
      },
      onError: () => {
        console.error('Failed to save bio');
      },
    });
  };

  const handleCancelBio = () => {
    setBioText(effectiveSettings?.customBio || '');
    setIsEditingBio(false);
  };

  const handleFollow = async () => {
    if (!targetDid || isFollowLoading) return;
    
    setIsFollowLoading(true);
    try {
      const result = await atprotocol.followUser(targetDid);
      setIsFollowing(true);
      setFollowUri(result.uri);
    } catch (error) {
      console.error('Failed to follow user:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!followUri || isFollowLoading) return;
    
    setIsFollowLoading(true);
    try {
      await atprotocol.unfollowUser(followUri);
      setIsFollowing(false);
      setFollowUri(null);
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleOpenBluesky = () => {
    if (!profile?.handle) return;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try to open in the Bluesky mobile app first
      const appUrl = `com.bsky.app://profile/${profile.handle}`;
      window.location.href = appUrl;
      
      // Fallback to website if app doesn't open
      setTimeout(() => {
        window.open(`https://bsky.app/profile/${profile.handle}`, '_blank');
      }, 1000);
    } else {
      // Open in website for desktop
      window.open(`https://bsky.app/profile/${profile.handle}`, '_blank');
    }
  };

  // Check if user has verified work history
  console.log('🔍 ProfileHeader - effectiveWorkHistory:', effectiveWorkHistory);
  console.log('🔍 ProfileHeader - companies:', companies);
  
  
  
  // Get the first company from work history for the logo
  const getFirstCompany = () => {
    if (effectiveWorkHistory.length === 0) return null;
    const firstWorkItem = effectiveWorkHistory[0];
    console.log('🔍 getFirstCompany - firstWorkItem:', firstWorkItem);
    console.log('🔍 getFirstCompany - companies:', companies);
    console.log('🔍 getFirstCompany - looking for companyId:', firstWorkItem.companyId);
    const company = companies.find(c => c.id === firstWorkItem.companyId || c.did === firstWorkItem.companyId);
    console.log('🔍 getFirstCompany - found company:', company);
    return company;
  };

  const firstCompany = getFirstCompany();


  if (!profile) return null;

  return (
    <div className="text-center mb-0 fade-in" data-testid="profile-header">
      {/* Banner Section */}
      {effectiveSettings?.showBanner !== false && (
        <div className="relative mb-6 mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 2xl:mx-24">
          <div className="relative h-24 sm:h-28 md:h-32 lg:h-36 bg-gradient-to-r from-yellow-400 to-orange-500 overflow-hidden rounded-xl">
            {/* Use custom banner from settings if available, otherwise use profile banner */}
            {(effectiveSettings?.customBanner || profile.banner) && (
              <img 
                src={effectiveSettings?.customBanner || profile.banner} 
                alt="Profile banner" 
                className="w-full h-full object-cover rounded-xl transition-transform"
                style={effectiveSettings?.bannerAdjustment ? {
                  transform: `scale(${effectiveSettings.bannerAdjustment.scale / 100}) rotate(${effectiveSettings.bannerAdjustment.rotation}deg)`,
                  objectPosition: `${effectiveSettings.bannerAdjustment.positionX}% ${effectiveSettings.bannerAdjustment.positionY}%`,
                } : undefined}
                data-testid="img-banner"
              />
            )}
            {isEditMode && isOwnProfile && (
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowBannerUpload(true)}
                  className="bg-black/50 hover:bg-black/70 text-white"
                  data-testid="button-upload-banner"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Banner
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (ownSettings) {
                      const updatedSettings = {
                        ...ownSettings,
                        showBanner: false,
                      };
                      saveSettings(updatedSettings);
                    }
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white"
                  data-testid="button-hide-banner"
                >
                  Hide
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Show banner button when hidden */}
      {effectiveSettings?.showBanner === false && isEditMode && isOwnProfile && (
        <div className="mb-6">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (ownSettings) {
                const updatedSettings = {
                  ...ownSettings,
                  showBanner: true,
                };
                saveSettings(updatedSettings);
              }
            }}
            className="mx-auto"
            data-testid="button-show-banner"
          >
            <Camera className="w-4 h-4 mr-2" />
            Show Banner
          </Button>
        </div>
      )}
      
      <div className="relative inline-block mb-0 -mt-16">
        {(effectiveSettings === null || effectiveSettings?.showStories !== false) && (
          targetDid ? (
            <PublicStoriesRing 
              profile={profile}
              targetDid={targetDid}
            />
          ) : (
            <StoriesRing 
              profile={profile}
              isEditMode={isEditMode}
              isOwnProfile={isOwnProfile}
              settings={effectiveSettings}
            />
          )
        )}
        {isEditMode && isOwnProfile && (
          <Button
            size="sm"
            onClick={() => setShowImageUpload(true)}
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-primary hover:bg-primary/90"
            data-testid="button-upload-avatar"
          >
            <Camera className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-0">
        <h2 className="text-2xl font-bold text-foreground" data-testid="text-display-name">
          {profile.displayName || profile.handle}
        </h2>
        {isVerifiedAccount(profile) && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  {isTrustedVerifier(profile) ? (
                    // 7-scalloped badge for trusted verifiers/labelers
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 22 22" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0"
                      data-testid="icon-verified-org"
                      aria-label="Verified organization"
                    >
                      {/* 7-scalloped outer shape */}
                      <path 
                        d="M11 2 L12.5 5 L15.5 5.5 L14.5 8 L16 10.5 L13.5 12 L13 15 L11 13.5 L9 15 L8.5 12 L6 10.5 L7.5 8 L6.5 5.5 L9.5 5 Z" 
                        fill="#3B82F6"
                        transform="translate(0, 2.5) scale(1.15)"
                      />
                      {/* Main circle */}
                      <circle cx="11" cy="11" r="6.5" fill="#3B82F6" />
                      {/* Checkmark */}
                      <path 
                        d="M8 11L10 13L14 9" 
                        stroke="white" 
                        strokeWidth="1.8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    // Simple circle for regular verified users
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 22 22" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0"
                      data-testid="icon-verified"
                      aria-label="Verified account"
                    >
                      {/* Simple circle */}
                      <circle cx="11" cy="11" r="9" fill="#3B82F6" />
                      {/* Checkmark */}
                      <path 
                        d="M8 11L10 13L14 9" 
                        stroke="white" 
                        strokeWidth="1.8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getVerificationTooltip(profile)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <p className="text-muted-foreground mb-0" data-testid="text-handle">
        @{profile.handle}
      </p>
      
      {/* Social Icons - under avatar placement */}
      {effectiveSettings?.socialIconsConfig?.placement === 'under-avatar' && (
        <div className="mb-0">
          {/* Show editor in edit mode */}
          {isEditMode && !isPublicProfile ? (
            <SocialIconsEditor
              socialLinks={effectiveSettings?.socialLinks || []}
              config={effectiveSettings?.socialIconsConfig}
              onSave={(links, config) => {
                // Create settings object if it doesn't exist
                const baseSettings = ownSettings || {
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
                    enabled: false,
                    placement: 'under-bio',
                    style: 'default',
                    size: 'medium',
                    ...(baseSettings.socialIconsConfig || {}),
                    ...config,
                    enabled: links.length > 0,
                  },
                };
                console.log('💾 ProfileHeader saving settings (under-avatar):', {
                  socialLinks: updatedSettings.socialLinks?.length,
                  socialIconsConfig: updatedSettings.socialIconsConfig,
                });
                saveSettings(updatedSettings);
              }}
              onOpenSettings={onOpenSettings}
            />
          ) : (
            /* Show preview for public/non-edit mode */
            effectiveSettings?.socialLinks && effectiveSettings.socialLinks.length > 0 && (
              <SocialIconsRow 
                socialLinks={effectiveSettings.socialLinks} 
                config={effectiveSettings.socialIconsConfig}
                isEditMode={false}
              />
            )
          )}
        </div>
      )}
      
      {(effectiveSettings?.customBio || profile.description) && !isEditingBio && (
        <div className="relative group mb-3 max-w-md mx-auto">
          <p className="text-foreground" data-testid="text-bio">
            {effectiveSettings?.customBio || profile.description}
          </p>
          {isEditMode && !isPublicProfile && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingBio(true)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid="button-edit-bio"
            >
              <Edit className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}
      
      {/* Social Icons - under bio placement (default) */}
      {(!effectiveSettings?.socialIconsConfig?.placement || effectiveSettings?.socialIconsConfig?.placement === 'under-bio') && (
        <div className="mb-0">
          {/* Show editor in edit mode */}
          {isEditMode && !isPublicProfile ? (
            <SocialIconsEditor
              socialLinks={effectiveSettings?.socialLinks || []}
              config={effectiveSettings?.socialIconsConfig}
              onSave={(links, config) => {
                // Create settings object if it doesn't exist
                const baseSettings = ownSettings || {
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
                    enabled: false,
                    placement: 'under-bio',
                    style: 'default',
                    size: 'medium',
                    ...(baseSettings.socialIconsConfig || {}),
                    ...config,
                    enabled: links.length > 0, // Auto-enable if links exist
                  },
                };
                console.log('💾 ProfileHeader saving settings (under-bio):', {
                  socialLinks: updatedSettings.socialLinks?.length,
                  socialIconsConfig: updatedSettings.socialIconsConfig,
                });
                saveSettings(updatedSettings);
              }}
              onOpenSettings={onOpenSettings}
            />
          ) : (
            /* Show preview for public/non-edit mode */
            effectiveSettings?.socialLinks && effectiveSettings.socialLinks.length > 0 && (
              <SocialIconsRow 
                socialLinks={effectiveSettings.socialLinks} 
                config={effectiveSettings.socialIconsConfig}
                isEditMode={false}
              />
            )
          )}
        </div>
      )}
      
      {isEditingBio && isEditMode && !isPublicProfile && (
        <div className="mb-6 max-w-md mx-auto">
          <textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            placeholder="Write your bio..."
            className="w-full h-20 px-3 py-2 border border-input bg-background rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            maxLength={500}
            data-testid="textarea-bio-edit"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {bioText.length}/500 characters
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelBio}
                data-testid="button-cancel-bio"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveBio}
                data-testid="button-save-bio"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Follow and Open Bluesky Buttons - Only show for public profiles when viewing someone else */}
      {isPublicProfile && targetDid && user?.did !== targetDid && (
        <div className="mb-4 flex gap-2">
          <Button
            size="sm"
            variant={isFollowing ? "outline" : "default"}
            onClick={isFollowing ? handleUnfollow : handleFollow}
            disabled={isFollowLoading}
            className="flex items-center gap-2"
            data-testid="button-follow"
          >
            {isFollowLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isFollowing ? (
              <>
                <UserMinus className="w-4 h-4" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Follow
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleOpenBluesky}
            className="flex items-center gap-2"
            data-testid="button-open-bluesky"
          >
            <ExternalLink className="w-4 h-4" />
            Open Bluesky
          </Button>
        </div>
      )}
      
      {!targetDid && (
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1" data-testid="text-link-count">
            <LinkIcon className="w-4 h-4" />
            <span>{links.length} links</span>
          </div>
          <div className="flex items-center gap-1" data-testid="text-view-count">
            <Eye className="w-4 h-4" />
            <span>0 views</span>
          </div>
        </div>
      )}
      
      <ProfileImageUpload 
        isOpen={showImageUpload} 
        onClose={() => setShowImageUpload(false)} 
      />
      
      <BannerUpload 
        isOpen={showBannerUpload} 
        onClose={() => setShowBannerUpload(false)} 
      />
      
    </div>
  );
}
