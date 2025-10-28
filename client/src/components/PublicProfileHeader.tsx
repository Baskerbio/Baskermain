import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BadgeCheck, CheckCircle2 } from 'lucide-react';
import { PublicStoriesRing } from './PublicStoriesRing';
import { SocialIconsRow } from './SocialIconsRow';
import { UserProfile } from '@shared/schema';
import { usePublicSettings } from '../hooks/use-atprotocol';
import { isVerifiedAccount, isTrustedVerifier, isBaskerVerified, getVerificationTooltip } from '../lib/verification-utils';
import { useState } from 'react';

interface PublicProfileHeaderProps {
  profile: UserProfile;
}

export function PublicProfileHeader({ profile }: PublicProfileHeaderProps) {
  const { data: settings } = usePublicSettings(profile.did);
  const [showVerificationTooltip, setShowVerificationTooltip] = useState(false);
  
  console.log('🔍 PublicProfileHeader - settings:', settings);
  console.log('🔍 PublicProfileHeader - socialLinks:', settings?.socialLinks);
  console.log('🔍 PublicProfileHeader - socialIconsConfig:', settings?.socialIconsConfig);
  console.log('🔍 PublicProfileHeader - bannerAdjustment:', settings?.bannerAdjustment);
  console.log('🔍 PublicProfileHeader - profile.banner:', profile.banner);
  console.log('🔍 PublicProfileHeader - FULL PROFILE:', JSON.stringify(profile, null, 2));
  
  if (!profile) return null;

  // Truncate username if longer than 19 characters
  const truncateUsername = (username: string) => {
    if (username.length > 19) {
      return username.substring(0, 19) + '...';
    }
    return username;
  };

  return (
    <div className="text-center mb-8 fade-in" data-testid="profile-header">
      {/* Banner Section */}
      {settings?.showBanner !== false && (settings?.customBanner || profile.banner) && (
        <div className="relative mb-6 mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 2xl:mx-24">
          <div className="relative h-24 sm:h-28 md:h-32 lg:h-36 bg-gradient-to-r from-yellow-400 to-orange-500 overflow-hidden rounded-xl">
            <img 
              src={settings?.customBanner || profile.banner} 
              alt="Profile banner" 
              className="w-full h-full object-cover rounded-xl transition-transform"
              style={settings?.bannerAdjustment ? {
                transform: `scale(${settings.bannerAdjustment.scale / 100}) rotate(${settings.bannerAdjustment.rotation}deg)`,
                objectPosition: `${settings.bannerAdjustment.positionX}% ${settings.bannerAdjustment.positionY}%`,
              } : undefined}
              data-testid="img-banner"
            />
          </div>
        </div>
      )}
      
      <div className="relative inline-block mb-4" style={{ marginTop: profile.banner && settings?.showBanner !== false ? '-64px' : '0' }}>
        <PublicStoriesRing 
          profile={profile}
          targetDid={profile.did}
          settings={settings}
        />
      </div>
      
      <div className="flex items-center justify-center gap-2 mb-2">
        <h2 className="text-2xl font-bold text-foreground" data-testid="text-display-name">
          {profile.displayName || profile.handle}
        </h2>
        {isVerifiedAccount(profile) && (
          <TooltipProvider>
            <Tooltip open={showVerificationTooltip} onOpenChange={setShowVerificationTooltip}>
              <TooltipTrigger asChild>
                <button 
                  className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowVerificationTooltip(!showVerificationTooltip);
                  }}
                >
                  {isBaskerVerified(profile) ? (
                    // Yellow sun for Basker verified accounts with black background circle
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0"
                      data-testid="icon-basker-verified"
                      aria-label="Verified Basker account"
                    >
                      {/* Blue background circle (Bluesky blue) */}
                      <circle cx="12" cy="12" r="11" fill="#0F73FF" stroke="#0F73FF" strokeWidth="1"/>
                      {/* New sun icon - properly centered and scaled */}
                      <g transform="scale(0.4) translate(5.4, 5.4)">
                        <path fill="#FFFFFF" d="M11 11H37V37H11z"></path>
                        <path fill="#FFFFFF" d="M11.272 11.272H36.728V36.728H11.272z" transform="rotate(-45.001 24 24)"></path>
                        <path fill="#FFFFFF" d="M13,24c0,6.077,4.923,11,11,11c6.076,0,11-4.923,11-11s-4.924-11-11-11C17.923,13,13,17.923,13,24"></path>
                      </g>
                    </svg>
                  ) : isTrustedVerifier(profile) ? (
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
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3 bg-gray-900 border border-gray-700 shadow-lg rounded-md" side="top" align="center" sideOffset={8}>
                {(() => {
                  const verificationInfo = getVerificationTooltip(profile);
                  return (
                    <div className="space-y-2">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 22 22" fill="none" className="text-blue-500 flex-shrink-0">
                            <circle cx="11" cy="11" r="9" fill="currentColor" />
                            <path d="M8 11L10 13L14 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="font-semibold text-sm text-white">Verified Account</span>
                        </div>
                        <button 
                          className="text-gray-400 hover:text-gray-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowVerificationTooltip(false);
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                      
                      {/* Verification Info */}
                      <div className="text-xs text-gray-300 leading-relaxed">
                        {verificationInfo.reason || "This account has a checkmark because it's been verified by trusted sources."}
                      </div>
                      
                      {/* Verified By Section */}
                      <div className="bg-gray-800 rounded p-2 border border-gray-600">
                        <div className="text-xs font-medium text-gray-300 mb-1 text-center">Verified by:</div>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#1185fe"/>
                            </svg>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-medium text-gray-100">{verificationInfo.source}</div>
                            <div className="text-xs text-gray-400">{verificationInfo.date || '2024'}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Learn More Button */}
                      <a 
                        href="https://bsky.social/about/blog/04-21-2025-verification" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full text-center text-xs text-blue-400 hover:text-blue-300 underline transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Learn more at Bluesky
                      </a>
                    </div>
                  );
                })()}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <p className="text-muted-foreground mb-4" data-testid="text-handle">
        @{truncateUsername(profile.handle)}
      </p>
      
      {/* Social Icons - under avatar placement */}
      {settings?.socialIconsConfig?.placement === 'under-avatar' && settings?.socialLinks && settings.socialLinks.filter(l => l.enabled).length > 0 && (
        <div className="mb-4">
          <SocialIconsRow 
            socialLinks={settings.socialLinks} 
            config={settings.socialIconsConfig}
            isEditMode={false}
          />
        </div>
      )}
      
      {(settings?.customBio || profile.description) && (
        <p className="text-foreground mb-6 max-w-md mx-auto" data-testid="text-description">
          {settings?.customBio || profile.description}
        </p>
      )}
      
      {/* Social Icons - under bio placement (default) */}
      {(!settings?.socialIconsConfig?.placement || settings?.socialIconsConfig?.placement === 'under-bio') && settings?.socialLinks && settings.socialLinks.filter(l => l.enabled).length > 0 && (
        <div className="mb-4">
          <SocialIconsRow 
            socialLinks={settings.socialLinks} 
            config={settings.socialIconsConfig}
            isEditMode={false}
          />
        </div>
      )}
    </div>
  );
}
