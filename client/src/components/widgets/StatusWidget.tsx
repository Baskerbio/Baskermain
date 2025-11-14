import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatusWidgetConfig {
  message?: string;
  emoji?: string;
  backgroundColor?: string;
  textColor?: string;
  pulse?: boolean;
}

interface StatusWidgetProps {
  config: StatusWidgetConfig;
  isPublic?: boolean;
}

const StatusWidget: React.FC<StatusWidgetProps> = ({ config, isPublic = false }) => {
  const message = config.message?.trim() || 'Commissions open this week!';
  const emoji = config.emoji || '🚀';
  const backgroundColor = config.backgroundColor || 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(168,85,247,0.22))';
  const textColor = config.textColor || '#0f172a';

  return (
    <Card
      className="w-full border-none shadow-none"
      style={{
        background: backgroundColor,
        color: textColor,
      }}
    >
      <CardContent className="p-5">
        <div className={cn('flex items-center gap-3 text-sm font-semibold')}>
          <span className="text-xl">{emoji}</span>
          <span>{message}</span>
        </div>
        {!isPublic && (
          <p className="mt-2 text-xs text-slate-700/80 dark:text-slate-200/70">
            Update this status anytime from the widget settings.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const PublicStatusWidget: React.FC<{ config: StatusWidgetConfig }> = ({ config }) => (
  <StatusWidget config={config} isPublic />
);

export default StatusWidget;

