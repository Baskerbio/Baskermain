import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useLinks, useSettings, useSaveSettings, usePublicSettings, useWorkHistory, usePublicWorkHistory, useCompanies } from '../hooks/use-atprotocol';
import { useEditMode } from './EditModeProvider';
import { Eye, Link as LinkIcon, Camera, Edit, CheckCircle, AlertCircle, Building2, Loader2 } from 'lucide-react';
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
  const { isEditMode: contextEditMode } = useEditMode();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);

  // Use props if provided, otherwise fall back to context
  const profile = propProfile || user;
  const isEditMode = propIsEditMode !== undefined ? propIsEditMode : contextEditMode;
  
  // Fetch appropriate settings based on context
  const isPublicProfile = !isOwnProfile && !!targetDid;
  const { data: ownSettings } = useSettings(!isPublicProfile);
  const { data: publicSettings } = usePublicSettings(isPublicProfile ? targetDid : null);
  const { mutate: saveSettings } = useSaveSettings();
  
  // Fetch work history for verification badges
  const { data: workHistory = [] } = useWorkHistory();
  const { data: publicWorkHistory = [] } = usePublicWorkHistory(isPublicProfile ? targetDid : null);
  const { data: companies = [] } = useCompanies();
  const effectiveWorkHistory = isPublicProfile ? publicWorkHistory : workHistory;
  
  // Use the appropriate settings for the current context
  const effectiveSettings = isPublicProfile ? publicSettings : ownSettings;

  console.log('🔍 ProfileHeader - profile:', profile);
  console.log('🔍 ProfileHeader - isEditMode:', isEditMode, 'isOwnProfile:', isOwnProfile, 'targetDid:', targetDid);
  console.log('🔍 ProfileHeader - isPublicProfile:', isPublicProfile, 'ownSettings:', ownSettings, 'publicSettings:', publicSettings, 'effectiveSettings:', effectiveSettings);

  // Initialize bio text when settings change
  React.useEffect(() => {
    if (effectiveSettings?.customBio !== undefined) {
      setBioText(effectiveSettings.customBio || '');
    }
  }, [effectiveSettings?.customBio]);

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

  // Check if user has verified work history
  console.log('🔍 ProfileHeader - effectiveWorkHistory:', effectiveWorkHistory);
  console.log('🔍 ProfileHeader - companies:', companies);
  const hasVerifiedWork = effectiveWorkHistory.some(item => item.verificationStatus === 'verified');
  const hasUnverifiedWork = effectiveWorkHistory.some(item => item.verificationStatus === 'unverified');
  console.log('🔍 ProfileHeader - hasVerifiedWork:', hasVerifiedWork, 'hasUnverifiedWork:', hasUnverifiedWork);
  
  // Get the first company from work history for the logo
  const getFirstCompany = () => {
    if (effectiveWorkHistory.length === 0) return null;
    const firstWorkItem = effectiveWorkHistory[0];
    return companies.find(c => c.id === firstWorkItem.companyId);
  };

  const firstCompany = getFirstCompany();

  const getVerificationBadge = () => {
    console.log('🔍 getVerificationBadge called - hasVerifiedWork:', hasVerifiedWork, 'hasUnverifiedWork:', hasUnverifiedWork);
    console.log('🔍 getVerificationBadge - firstCompany:', firstCompany);
    console.log('🔍 getVerificationBadge - showVerificationInfo state:', showVerificationInfo);
    if (hasVerifiedWork) {
      return (
        <div 
          className="flex items-center gap-1 text-green-600 cursor-pointer hover:opacity-80 transition-opacity select-none relative z-10" 
          title="Verified employee - Click for details"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            console.log('🔍 Verification badge clicked');
            setShowVerificationInfo(true);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
        >
          {firstCompany?.logo ? (
            <img 
              src={firstCompany.logo} 
              alt={firstCompany.name}
              className="w-4 h-4 rounded-full object-cover"
            />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span className="text-xs font-medium">Verified</span>
        </div>
      );
    } else if (hasUnverifiedWork) {
      return (
        <div 
          className="flex items-center gap-1 text-amber-600 cursor-pointer hover:opacity-80 transition-opacity select-none relative z-10" 
          title="Verification pending - Click for details"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            console.log('🔍 Verification badge clicked (unverified)');
            console.log('🔍 Setting showVerificationInfo to true');
            setShowVerificationInfo(true);
            console.log('🔍 showVerificationInfo should now be true');
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
        >
          {firstCompany?.logo ? (
            <img 
              src={firstCompany.logo} 
              alt={firstCompany.name}
              className="w-4 h-4 rounded-full object-cover"
            />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <Loader2 className="w-3 h-3" />
        </div>
      );
    }
    return null;
  };

  if (!profile) return null;

  return (
    <div className="text-center mb-8 fade-in" data-testid="profile-header">
      <div className="relative inline-block mb-0">
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
        {(() => {
          const badge = getVerificationBadge();
          console.log('🔍 Verification badge rendered:', badge);
          return badge;
        })()}
      </div>
      
      <p className="text-muted-foreground mb-4" data-testid="text-handle">
        @{profile.handle}
      </p>
      
      {(effectiveSettings?.customBio || profile.description) && !isEditingBio && (
        <div className="relative group mb-6 max-w-md mx-auto">
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
      
      {/* Verification Info Dialog */}
      {(() => {
        console.log('🔍 Dialog render check - showVerificationInfo:', showVerificationInfo);
        return showVerificationInfo;
      })() && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowVerificationInfo(false)}>
          <div className="bg-background border rounded-lg p-6 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              {firstCompany?.logo ? (
                <img 
                  src={firstCompany.logo} 
                  alt={firstCompany.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-muted-foreground" />
              )}
              <div>
                <h3 className="font-semibold text-lg">
                  {hasVerifiedWork ? 'Verified Employee' : 'Claims to Work Here'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {firstCompany?.name || 'Company'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {hasVerifiedWork ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">This user has been verified as an employee</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">This user claims to work here but is not verified</span>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                {hasVerifiedWork 
                  ? 'Their employment has been verified by our admin team through submitted documentation.'
                  : 'This is an unverified claim. The user has not provided proof of employment.'
                }
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowVerificationInfo(false)}
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
