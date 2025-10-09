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
  
  if (!profile) return null;

  return (
    <div className="text-center mb-8 fade-in" data-testid="profile-header">
      <div className="relative inline-block mb-4">
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
      {settings?.socialIconsConfig?.placement === 'under-avatar' && settings?.socialLinks && settings.socialLinks.length > 0 && (
        <SocialIconsRow 
          socialLinks={settings.socialLinks} 
          config={settings.socialIconsConfig}
          isEditMode={false}
        />
      )}
      
      {(settings?.customBio || profile.description) && (
        <p className="text-foreground mb-6 max-w-md mx-auto" data-testid="text-description">
          {settings?.customBio || profile.description}
        </p>
      )}
      
      {/* Social Icons - under bio placement (default) */}
      {(!settings?.socialIconsConfig?.placement || settings?.socialIconsConfig?.placement === 'under-bio') && settings?.socialLinks && settings.socialLinks.length > 0 && (
        <SocialIconsRow 
          socialLinks={settings.socialLinks} 
          config={settings.socialIconsConfig}
          isEditMode={false}
        />
      )}
    </div>
  );
}
