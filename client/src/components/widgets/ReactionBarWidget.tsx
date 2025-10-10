import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReactionBarWidgetProps {
  config: {
    title?: string;
    reactions: string[];
    showCounts?: boolean;
    allowMultiple?: boolean;
  };
  widgetId: string;
}

export function ReactionBarWidget({ config, widgetId }: ReactionBarWidgetProps) {
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());

  // Load reactions from localStorage
  useEffect(() => {
    const storageKey = `reactions_${widgetId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setReactionCounts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load reactions:', e);
      }
    }

    // Load user's reactions
    const userStorageKey = `user_reactions_${widgetId}`;
    const userStored = localStorage.getItem(userStorageKey);
    if (userStored) {
      try {
        setUserReactions(new Set(JSON.parse(userStored)));
      } catch (e) {
        console.error('Failed to load user reactions:', e);
      }
    }
  }, [widgetId]);

  const handleReaction = (reaction: string) => {
    const storageKey = `reactions_${widgetId}`;
    const userStorageKey = `user_reactions_${widgetId}`;

    let newCounts = { ...reactionCounts };
    let newUserReactions = new Set(userReactions);

    if (userReactions.has(reaction)) {
      // Remove reaction
      newCounts[reaction] = Math.max((newCounts[reaction] || 1) - 1, 0);
      newUserReactions.delete(reaction);
    } else {
      // Add reaction
      if (!config.allowMultiple && userReactions.size > 0) {
        // Remove previous reaction if only one is allowed
        const prevReaction = Array.from(userReactions)[0];
        newCounts[prevReaction] = Math.max((newCounts[prevReaction] || 1) - 1, 0);
        newUserReactions.clear();
      }
      newCounts[reaction] = (newCounts[reaction] || 0) + 1;
      newUserReactions.add(reaction);
    }

    setReactionCounts(newCounts);
    setUserReactions(newUserReactions);

    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(newCounts));
    localStorage.setItem(userStorageKey, JSON.stringify(Array.from(newUserReactions)));
  };

  const reactions = config.reactions || ['👍', '❤️', '🎉', '🔥', '😍'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-base">
          {config.title || 'React to this page'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {reactions.map((reaction) => {
            const count = reactionCounts[reaction] || 0;
            const isActive = userReactions.has(reaction);

            return (
              <Button
                key={reaction}
                variant={isActive ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleReaction(reaction)}
                className={`relative transition-all ${
                  isActive ? 'scale-110 shadow-lg' : 'hover:scale-105'
                }`}
              >
                <span className="text-2xl">{reaction}</span>
                {config.showCounts !== false && count > 0 && (
                  <span className="ml-2 text-sm font-medium">
                    {count > 999 ? '999+' : count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
        {!config.allowMultiple && (
          <p className="text-xs text-center text-muted-foreground mt-3">
            Click to react • Click again to remove
          </p>
        )}
        {config.allowMultiple && (
          <p className="text-xs text-center text-muted-foreground mt-3">
            Click to add reactions • Click again to remove
          </p>
        )}
      </CardContent>
    </Card>
  );
}

