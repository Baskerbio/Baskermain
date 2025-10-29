import { SocialLink, SocialIconsConfig } from '@shared/schema';
import { BrandIcons } from './BrandIcons';
import { Button } from '@/components/ui/button';
import { Settings, Edit, X, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SocialIconsRowProps {
  socialLinks: SocialLink[];
  config?: SocialIconsConfig;
  isEditMode?: boolean;
  onEditStyling?: () => void;
  onUpdateLink?: (updatedLink: SocialLink) => void;
  onRemoveLink?: (linkId: string) => void;
  onToggleEnabled?: (linkId: string) => void;
}

const PLATFORM_ICONS: Record<string, { color: string; label: string }> = {
  twitter: { color: '#1DA1F2', label: 'Twitter / X' },
  instagram: { color: '#E4405F', label: 'Instagram' },
  facebook: { color: '#1877F2', label: 'Facebook' },
  linkedin: { color: '#0A66C2', label: 'LinkedIn' },
  youtube: { color: '#FF0000', label: 'YouTube' },
  tiktok: { color: '#000000', label: 'TikTok' },
  github: { color: '#181717', label: 'GitHub' },
  twitch: { color: '#9146FF', label: 'Twitch' },
  discord: { color: '#5865F2', label: 'Discord' },
  telegram: { color: '#26A5E4', label: 'Telegram' },
  whatsapp: { color: '#25D366', label: 'WhatsApp' },
  snapchat: { color: '#FFFC00', label: 'Snapchat' },
  reddit: { color: '#FF4500', label: 'Reddit' },
  pinterest: { color: '#E60023', label: 'Pinterest' },
  spotify: { color: '#1DB954', label: 'Spotify' },
  soundcloud: { color: '#FF3300', label: 'SoundCloud' },
  bandcamp: { color: '#629AA9', label: 'Bandcamp' },
  patreon: { color: '#FF424D', label: 'Patreon' },
  kofi: { color: '#FF5E5B', label: 'Ko-fi' },
  buymeacoffee: { color: '#FFDD00', label: 'Buy Me a Coffee' },
  venmo: { color: '#3D95CE', label: 'Venmo' },
  cashapp: { color: '#00C244', label: 'Cash App' },
  paypal: { color: '#00457C', label: 'PayPal' },
  email: { color: '#EA4335', label: 'Email' },
  website: { color: '#6366F1', label: 'Website' },
  custom: { color: '#6B7280', label: 'Link' },
};

// Individual Social Icon Component with Edit Options
function SocialIconWithEdit({ 
  link, 
  platformInfo, 
  Icon, 
  iconColor, 
  bgColor, 
  hoverColor, 
  borderStyle, 
  sizeClasses, 
  iconSizes, 
  styleClasses, 
  style, 
  size,
  isEditMode, 
  onUpdateLink, 
  onRemoveLink, 
  onToggleEnabled 
}: {
  link: SocialLink;
  platformInfo: { color: string; label: string };
  Icon: any;
  iconColor: string;
  bgColor: string;
  hoverColor: string;
  borderStyle: any;
  sizeClasses: any;
  iconSizes: any;
  styleClasses: any;
  style: string;
  size: string;
  isEditMode: boolean;
  onUpdateLink?: (updatedLink: SocialLink) => void;
  onRemoveLink?: (linkId: string) => void;
  onToggleEnabled?: (linkId: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    url: link.url,
    label: link.label || '',
    customColor: link.customColor || '',
    customBackgroundColor: link.customBackgroundColor || '',
  });

  const handleClick = (url: string) => {
    if (!isEditMode) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSave = () => {
    if (onUpdateLink) {
      const updatedLink: SocialLink = {
        ...link,
        url: editData.url,
        label: editData.label,
        customColor: editData.customColor || undefined,
        customBackgroundColor: editData.customBackgroundColor || undefined,
      };
      onUpdateLink(updatedLink);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      url: link.url,
      label: link.label || '',
      customColor: link.customColor || '',
      customBackgroundColor: link.customBackgroundColor || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="relative group">
      {/* Main Icon Button */}
      <button
        onClick={() => handleClick(link.url)}
        className={`
          ${sizeClasses[size]} 
          ${styleClasses[style]}
          ${style === 'minimal' ? 'bg-transparent' : ''}
          flex items-center justify-center
          transition-all duration-200
          hover:scale-110 hover:shadow-lg
          relative
          ${isEditMode ? 'cursor-default' : ''}
          ${!link.enabled && isEditMode ? 'opacity-30 grayscale' : ''}
        `}
        style={{
          backgroundColor: style === 'minimal' ? 'transparent' : bgColor,
          ...borderStyle,
        }}
        title={link.label || platformInfo.label}
        aria-label={link.label || platformInfo.label}
      >
        <Icon 
          className={iconSizes[size]}
          style={{ color: !link.enabled && isEditMode ? '#999' : iconColor }}
          aria-hidden="true"
        />
        
        {/* Hover effect overlay */}
        <div 
          className={`
            absolute inset-0 ${styleClasses[style]}
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
          `}
          style={{
            backgroundColor: hoverColor + '20',
          }}
        />

        {/* Tooltip */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {link.label || platformInfo.label}
          </div>
        </div>
      </button>

      {/* Edit Controls - Only show in edit mode */}
      {isEditMode && (
        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onToggleEnabled?.(link.id)}
            className="h-6 w-6 p-0 rounded-full shadow-lg"
            title={link.enabled ? 'Hide icon' : 'Show icon'}
          >
            {link.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsEditing(!isEditing)}
            className="h-6 w-6 p-0 rounded-full shadow-lg"
            title="Edit icon"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemoveLink?.(link.id)}
            className="h-6 w-6 p-0 rounded-full shadow-lg"
            title="Remove icon"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Edit Form - Appears below the icon */}
      {isEditing && isEditMode && (
        <div className="absolute top-full left-0 mt-2 w-64 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <div className="space-y-2">
            <div>
              <Label className="text-xs mb-1 block">URL</Label>
              <Input
                value={editData.url}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                placeholder="https://twitter.com/yourname"
                className="text-xs h-7"
              />
            </div>

            {link.platform === 'custom' && (
              <div>
                <Label className="text-xs mb-1 block">Custom Label</Label>
                <Input
                  value={editData.label}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  placeholder="e.g., My Portfolio"
                  className="text-xs h-7"
                />
              </div>
            )}

            {/* Per-icon color customization */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs mb-1 block">Icon Color</Label>
                <Input
                  type="color"
                  value={editData.customColor || platformInfo.color}
                  onChange={(e) => setEditData({ ...editData, customColor: e.target.value })}
                  className="h-6 w-full p-0 cursor-pointer"
                />
              </div>
              
              <div>
                <Label className="text-xs mb-1 block">Background</Label>
                <Input
                  type="color"
                  value={editData.customBackgroundColor || platformInfo.color + '15'}
                  onChange={(e) => setEditData({ ...editData, customBackgroundColor: e.target.value })}
                  className="h-6 w-full p-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handleSave}
                className="flex-1 h-6 text-xs"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 h-6 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SocialIconsRow({ socialLinks, config, isEditMode = false, onEditStyling, onUpdateLink, onRemoveLink, onToggleEnabled }: SocialIconsRowProps) {
  // Default config
  const defaultConfig: SocialIconsConfig = {
    enabled: true,
    placement: 'under-bio',
    style: 'default',
    size: 'medium',
  };

  const activeConfig = { ...defaultConfig, ...config };

  // In edit mode, show all links (greyed out if disabled). Otherwise, filter to enabled only
  const visibleLinks = isEditMode
    ? socialLinks.sort((a, b) => a.order - b.order).slice(0, 8)
    : socialLinks
        .filter(link => link.enabled)
        .sort((a, b) => a.order - b.order)
        .slice(0, 8);

  if (!activeConfig.enabled || visibleLinks.length === 0) {
    return null;
  }

  // Size mappings
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-12 h-12',
    large: 'w-14 h-14',
  };

  const iconSizes = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-7 h-7',
  };

  // Style mappings
  const styleClasses = {
    default: 'rounded-lg',
    rounded: 'rounded-full',
    square: 'rounded-none',
    minimal: 'rounded-lg',
  };

  const size = activeConfig.size || 'medium';
  const style = activeConfig.style || 'default';

  return (
    <div className="relative">
      <div className="flex flex-row items-center justify-center gap-3 mt-2 mb-0 fade-in flex-wrap">
        {visibleLinks.map((link) => {
          const platformInfo = PLATFORM_ICONS[link.platform] || PLATFORM_ICONS.custom;
          const Icon = BrandIcons[link.platform as keyof typeof BrandIcons] || BrandIcons.custom;
          
          // Use per-icon custom colors first, then global config, then platform default
          const iconColor = link.customColor || activeConfig.iconColor || platformInfo.color;
          const bgColor = link.customBackgroundColor || activeConfig.backgroundColor || platformInfo.color + '15';
          const hoverColor = activeConfig.hoverColor || platformInfo.color;

          // Build border style object
          const borderStyle: any = {};
          if (activeConfig.borderWidth && activeConfig.borderWidth > 0) {
            borderStyle.borderWidth = `${activeConfig.borderWidth}px`;
            borderStyle.borderStyle = activeConfig.borderStyle || 'solid';
            borderStyle.borderColor = activeConfig.borderColor || iconColor;
          } else if (style === 'minimal') {
            borderStyle.borderWidth = '2px';
            borderStyle.borderColor = iconColor;
          }

          return (
            <SocialIconWithEdit
              key={link.id}
              link={link}
              platformInfo={platformInfo}
              Icon={Icon}
              iconColor={iconColor}
              bgColor={bgColor}
              hoverColor={hoverColor}
              borderStyle={borderStyle}
              sizeClasses={sizeClasses}
              iconSizes={iconSizes}
              styleClasses={styleClasses}
              style={style}
              size={size}
              isEditMode={isEditMode}
              onUpdateLink={onUpdateLink}
              onRemoveLink={onRemoveLink}
              onToggleEnabled={onToggleEnabled}
            />
          );
        })}
        
        {isEditMode && visibleLinks.length < 8 && (
          <div className="text-xs text-muted-foreground">
            {8 - visibleLinks.length} more slots
          </div>
        )}
      </div>
      
      {/* Edit Button - Only show in edit mode */}
      {isEditMode && visibleLinks.length > 0 && onEditStyling && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onEditStyling}
            className="h-8 w-8 p-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            title="Edit Social Icons Styling"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}