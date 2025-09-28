import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useLinks, useSettings } from '../hooks/use-atprotocol';
import { useEditMode } from './EditModeProvider';
import { Eye, Link as LinkIcon, Camera } from 'lucide-react';
import { ProfileImageUpload } from './ProfileImageUpload';
import { StoriesRing } from './StoriesRing';
import { PublicStoriesRing } from './PublicStoriesRing';
import { UserProfile } from '@shared/schema';

interface ProfileHeaderProps {
  profile?: UserProfile;
  isEditMode?: boolean;
  isOwnProfile?: boolean;
  targetDid?: string; // For public profiles
}

export function ProfileHeader({ profile: propProfile, isEditMode: propIsEditMode, isOwnProfile = true, targetDid }: ProfileHeaderProps) {
  const { user } = useAuth();
  const { data: links = [] } = useLinks();
  const { data: settings } = useSettings();
  const { isEditMode: contextEditMode } = useEditMode();
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Use props if provided, otherwise fall back to context
  const profile = propProfile || user;
  const isEditMode = propIsEditMode !== undefined ? propIsEditMode : contextEditMode;

  console.log('🔍 ProfileHeader - profile:', profile);
  console.log('🔍 ProfileHeader - isEditMode:', isEditMode, 'isOwnProfile:', isOwnProfile, 'targetDid:', targetDid);
  console.log('🔍 ProfileHeader - settings:', settings, 'showStories:', settings?.showStories);

  if (!profile) return null;

  return (
    <div className="text-center mb-8 fade-in" data-testid="profile-header">
      <div className="relative inline-block mb-0">
        {(settings === null || settings?.showStories !== false) && (
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
      
      <h2 className="text-2xl font-bold text-foreground mb-0" data-testid="text-display-name">
        {profile.displayName || profile.handle}
      </h2>
      
      <p className="text-muted-foreground mb-4" data-testid="text-handle">
        @{profile.handle}
      </p>
      
      {profile.description && (
        <p className="text-foreground mb-6 max-w-md mx-auto" data-testid="text-bio">
          {profile.description}
        </p>
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
    </div>
  );
}
