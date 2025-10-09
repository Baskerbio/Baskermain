import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PublicStoriesRing } from './PublicStoriesRing';
import { SocialIconsRow } from './SocialIconsRow';
import { UserProfile } from '@shared/schema';
import { usePublicSettings } from '../hooks/use-atprotocol';

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
      {settings?.showBanner !== false && profile.banner && (
        <div className="relative mb-6 mx-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 2xl:mx-24">
          <div className="relative h-24 sm:h-28 md:h-32 lg:h-36 bg-gradient-to-r from-yellow-400 to-orange-500 overflow-hidden rounded-xl">
            <img 
              src={profile.banner} 
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
      
      <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-display-name">
        {profile.displayName || profile.handle}
      </h2>
      
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
