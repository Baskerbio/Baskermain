import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SocialBadgeWidgetProps {
  config: any;
}

export function SocialBadgeWidget({ config }: SocialBadgeWidgetProps) {
  const platformIcons = {
    twitter: '🐦',
    instagram: '📷',
    youtube: '📺',
    linkedin: '💼',
    github: '💻',
    facebook: '👥',
    tiktok: '🎵',
    discord: '💬',
    twitch: '🎮',
    spotify: '🎵',
    custom: '🔗'
  };

  const platformColors = {
    twitter: 'bg-blue-500',
    instagram: 'bg-pink-500',
    youtube: 'bg-red-500',
    linkedin: 'bg-blue-600',
    github: 'bg-gray-800',
    facebook: 'bg-blue-700',
    tiktok: 'bg-black',
    discord: 'bg-indigo-600',
    twitch: 'bg-purple-600',
    spotify: 'bg-green-500',
    custom: 'bg-gray-500'
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const styleClasses = {
    rounded: 'rounded-lg',
    square: 'rounded-none',
    pill: 'rounded-full'
  };

  return (
    <div className="space-y-2">
      {config.links && config.links.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {config.links.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${sizeClasses[config.size as keyof typeof sizeClasses || 'md']} ${styleClasses[config.style as keyof typeof styleClasses || 'rounded']} flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer`}
              style={{
                backgroundColor: link.backgroundColor || platformColors[link.platform as keyof typeof platformColors]?.replace('bg-', '') + '20',
                color: link.customColor || 'inherit'
              }}
            >
              {config.showIcon && (
                <span className="text-lg">
                  {platformIcons[link.platform as keyof typeof platformIcons] || '🔗'}
                </span>
              )}
              <span className="font-medium">{link.label}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <div className={`w-8 h-8 ${platformColors[config.platform as keyof typeof platformColors] || 'bg-primary'} rounded-full flex items-center justify-center`}>
            <span className="text-white text-lg">
              {platformIcons[config.platform as keyof typeof platformIcons] || '🔗'}
            </span>
          </div>
          <div>
            <div className="font-medium">@{config.username || 'username'}</div>
            {config.showCount && (
              <div className="text-sm text-muted-foreground">
                {Math.floor(Math.random() * 10000)} followers
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}