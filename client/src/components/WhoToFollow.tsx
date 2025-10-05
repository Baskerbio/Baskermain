import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, UserPlus, Users } from 'lucide-react';
import { atprotocol } from '../lib/atprotocol';

interface SuggestedUser {
  did: string;
  handle: string;
  displayName: string;
  description?: string;
  avatar?: string;
  viewer?: {
    following?: string;
    followedBy?: string;
  };
}

interface WhoToFollowProps {
  title?: string;
  maxUsers?: number;
  showTitle?: boolean;
  compact?: boolean;
}

export function WhoToFollow({ 
  title = "Who to Follow", 
  maxUsers = 3, 
  showTitle = true,
  compact = false 
}: WhoToFollowProps) {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSuggestedUsers = async () => {
      setIsLoading(true);
      
      try {
        // Use real Bluesky API to get suggested users
        const response = await fetch('https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const users = data.actors?.slice(0, maxUsers) || [];
          setSuggestedUsers(users);
        } else {
          // Fallback to curated list if API fails
          const fallbackUsers = [
            {
              did: 'did:plc:basker',
              handle: 'basker.bio',
              displayName: 'Basker',
              description: 'Your link-in-bio platform',
              avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg'
            }
          ];
          setSuggestedUsers(fallbackUsers.slice(0, maxUsers));
        }
      } catch (error) {
        console.error('Failed to load suggested users:', error);
        setSuggestedUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestedUsers();
  }, [maxUsers]);

  const handleFollowUser = (handle: string) => {
    window.open(`https://bsky.app/profile/${handle}`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenProfile = (handle: string) => {
    window.open(`https://bsky.app/profile/${handle}`, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className={`${compact ? 'w-full max-w-xs' : 'max-w-sm'} bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg`}>
        {showTitle && (
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        <div className="space-y-3">
          {Array.from({ length: maxUsers }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestedUsers.length === 0) {
    return null;
  }

  return (
    <div className={`${compact ? 'w-full max-w-xs' : 'max-w-sm'} bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg animate-fade-in`}>
      {showTitle && (
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      
      <div className="space-y-3">
        {suggestedUsers.map((user) => (
          <div 
            key={user.did}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handleOpenProfile(user.handle)}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={user.avatar} 
                alt={user.displayName}
              />
              <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                {user.displayName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">
                {user.displayName || user.handle}
              </p>
              <p className="text-xs text-gray-500 truncate">
                @{user.handle}
              </p>
              {user.description && !compact && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {user.description}
                </p>
              )}
            </div>
            
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                handleFollowUser(user.handle);
              }}
            >
              <UserPlus className="w-3 h-3 mr-1" />
              Follow
            </Button>
          </div>
        ))}
        
        <div className="pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-gray-600 hover:text-gray-800"
            onClick={() => window.open('https://bsky.app', '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Discover more on Bluesky
          </Button>
        </div>
      </div>
    </div>
  );
}
