import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BadgeCheck, CheckCircle2 } from 'lucide-react';
import { PublicStoriesRing } from './PublicStoriesRing';
import { SocialIconsRow } from './SocialIconsRow';
import { UserProfile } from '@shared/schema';
import { usePublicSettings } from '../hooks/use-atprotocol';
import { isVerifiedAccount, isTrustedVerifier, getVerificationTooltip } from '../lib/verification-utils';

interface PublicProfileHeaderProps {
  profile: UserProfile;
}

export function PublicProfileHeader({ profile }: PublicProfileHeaderProps) {
  const { data: settings } = usePublicSettings(profile.did);
  
  console.log('🔍 PublicProfileHeader - settings:', settings);
  console.log('🔍 PublicProfileHeader - socialLinks:', settings?.socialLinks);
  console.log('🔍 PublicProfileHeader - socialIconsConfig:', settings?.socialIconsConfig);
  console.log('🔍 PublicProfileHeader - bannerAdjustment:', settings?.bannerAdjustment);
  console.log('🔍 PublicProfileHeader - profile.banner:', profile.banner);
  
  if (!profile) return null;

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
      
      <p className="text-muted-foreground mb-4" data-testid="text-handle">
        @{profile.handle}
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
