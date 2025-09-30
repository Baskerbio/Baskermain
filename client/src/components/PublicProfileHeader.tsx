import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PublicStoriesRing } from './PublicStoriesRing';
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
      
      {(settings?.customBio || profile.description) && (
        <p className="text-foreground mb-6 max-w-md mx-auto" data-testid="text-description">
          {settings?.customBio || profile.description}
        </p>
      )}
    </div>
  );
}
