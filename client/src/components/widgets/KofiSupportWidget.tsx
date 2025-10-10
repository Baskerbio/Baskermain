import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Heart } from 'lucide-react';

interface KofiSupportWidgetProps {
  config: {
    username: string;
    platform?: 'kofi' | 'buymeacoffee';
    customMessage?: string;
    buttonStyle?: string;
    supporterCount?: number;
    showSupporters?: boolean;
    showGoal?: boolean;
    goalAmount?: number;
    currentAmount?: number;
  };
}

export function KofiSupportWidget({ config }: KofiSupportWidgetProps) {
  const platform = config.platform || 'kofi';
  const platformName = platform === 'kofi' ? 'Ko-fi' : 'Buy Me a Coffee';
  const platformUrl =
    platform === 'kofi'
      ? `https://ko-fi.com/${config.username}`
      : `https://buymeacoffee.com/${config.username}`;
  const platformColor = platform === 'kofi' ? '#13C3FF' : '#FFDD00';

  if (!config.username) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Configure your {platformName} username in widget settings
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader style={{ borderTopColor: platformColor, borderTopWidth: 3 }}>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="w-5 h-5" />
          Support Me
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Custom Message */}
        {config.customMessage && (
          <p className="text-sm text-center text-muted-foreground">
            {config.customMessage}
          </p>
        )}

        {/* Support Button */}
        <a href={platformUrl} target="_blank" rel="noopener noreferrer" className="block">
          <Button
            className="w-full"
            size="lg"
            style={{
              backgroundColor: platformColor,
              color: platform === 'kofi' ? '#fff' : '#000',
            }}
          >
            <Coffee className="w-5 h-5 mr-2" />
            Support me on {platformName}
          </Button>
        </a>

        {/* Supporter Count */}
        {config.showSupporters && config.supporterCount > 0 && (
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm">
                <span className="font-bold">{config.supporterCount}</span> supporters
              </span>
            </div>
          </div>
        )}

        {/* Goal Progress */}
        {config.showGoal && config.goalAmount && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Goal Progress</span>
              <span className="font-medium">
                ${config.currentAmount || 0} / ${config.goalAmount}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    ((config.currentAmount || 0) / config.goalAmount) * 100,
                    100
                  )}%`,
                  backgroundColor: platformColor,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

