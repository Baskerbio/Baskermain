import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface MicroblogPost {
  id: string;
  content: string;
  createdAt: string;
}

interface MicroblogWidgetConfig {
  title?: string;
  posts?: MicroblogPost[];
  crossPostToBluesky?: boolean;
}

interface MicroblogWidgetProps {
  config: MicroblogWidgetConfig;
  isPublic?: boolean;
}

function ensurePosts(config: MicroblogWidgetConfig): MicroblogPost[] {
  if (config.posts && config.posts.length > 0) {
    return config.posts;
  }
  return [
    {
      id: 'demo-1',
      content: 'Testing a new carousel layout. Looking slick on mobile devices!',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 'demo-2',
      content: 'Pinned a new guide to the Info Center — deep dive on Basker Widgets.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: 'demo-3',
      content: 'Reminder: applications for Solaris beta cards close Friday.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
  ];
}

const MicroblogWidget: React.FC<MicroblogWidgetProps> = ({ config, isPublic = false }) => {
  const posts = ensurePosts(config);
  const title = config.title?.trim() || 'Microblog';

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {config.crossPostToBluesky && (
          <Badge variant="outline" className="text-xs border-dashed">
            Cross-posts to Bluesky
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="space-y-1.5">
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {post.content}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {isPublic
              ? 'No microblog posts yet.'
              : 'Publish your first microblog update from the widget settings.'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const PublicMicroblogWidget: React.FC<{ config: MicroblogWidgetConfig }> = ({ config }) => (
  <MicroblogWidget config={config} isPublic />
);

export default MicroblogWidget;

