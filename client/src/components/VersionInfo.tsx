import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Calendar } from 'lucide-react';

interface VersionInfoProps {
  className?: string;
  showIcon?: boolean;
}

export function VersionInfo({ className = '', showIcon = true }: VersionInfoProps) {
  const version = '1.0.0';
  const buildDate = new Date().toLocaleDateString();

  return (
    <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
      {showIcon && <GitBranch className="w-3 h-3" />}
      <Badge variant="outline" className="text-xs px-2 py-0.5">
        v{version}
      </Badge>
      <span className="hidden sm:inline">•</span>
      <span className="hidden sm:inline flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {buildDate}
      </span>
    </div>
  );
}
