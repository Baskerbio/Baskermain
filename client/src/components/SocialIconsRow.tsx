import { SocialLink, SocialIconsConfig } from '@shared/schema';
import { BrandIcons } from './BrandIcons';

interface SocialIconsRowProps {
  socialLinks: SocialLink[];
  config?: SocialIconsConfig;
  isEditMode?: boolean;
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

export function SocialIconsRow({ socialLinks, config, isEditMode = false }: SocialIconsRowProps) {
  // Default config
  const defaultConfig: SocialIconsConfig = {
    enabled: true,
    placement: 'under-bio',
    style: 'default',
    size: 'medium',
  };

  const activeConfig = { ...defaultConfig, ...config };

  // Filter and sort enabled links, limit to 8
  const visibleLinks = socialLinks
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

  const handleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-row items-center justify-center gap-3 mt-2 mb-0 fade-in flex-wrap">
      {visibleLinks.map((link) => {
        const platformInfo = PLATFORM_ICONS[link.platform] || PLATFORM_ICONS.custom;
        const Icon = BrandIcons[link.platform as keyof typeof BrandIcons] || BrandIcons.custom;
        
        // Use per-icon custom colors first, then global config, then platform default
        const iconColor = link.customColor || activeConfig.iconColor || platformInfo.color;
        const bgColor = link.customBackgroundColor || activeConfig.backgroundColor || platformInfo.color + '15';
        const hoverColor = activeConfig.hoverColor || platformInfo.color;

        return (
          <button
            key={link.id}
            onClick={() => handleClick(link.url)}
            className={`
              ${sizeClasses[size]} 
              ${styleClasses[style]}
              ${style === 'minimal' ? 'bg-transparent border-2' : ''}
              flex items-center justify-center
              transition-all duration-200
              hover:scale-110 hover:shadow-lg
              group relative
            `}
            style={{
              backgroundColor: style === 'minimal' ? 'transparent' : bgColor,
              borderColor: style === 'minimal' ? iconColor : 'transparent',
            }}
            title={link.label || platformInfo.label}
            aria-label={link.label || platformInfo.label}
          >
            <Icon 
              className={iconSizes[size]}
              style={{ color: iconColor }}
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
        );
      })}
      
      {isEditMode && visibleLinks.length < 8 && (
        <div className="text-xs text-muted-foreground">
          {8 - visibleLinks.length} more slots
        </div>
      )}
    </div>
  );
}

