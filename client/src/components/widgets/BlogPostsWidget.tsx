import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, Tag, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { atprotocol } from '@/lib/atprotocol';

interface BlogPostsWidgetProps {
  config: {
    title: string;
    showCount: number;
    showExcerpt: boolean;
    showTags: boolean;
    showDate: boolean;
    showViews: boolean;
  };
  isEditMode?: boolean;
}

export function BlogPostsWidget({ config, isEditMode = false }: BlogPostsWidgetProps) {
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const { data: blogData, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => atprotocol.getBlogPosts(),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isEditMode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Blog Posts Widget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure your blog posts display in the widget editor
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const posts = blogData?.posts?.filter((post: any) => post.isPublished) || [];
  const displayPosts = posts.slice(0, config.showCount || 3);

  if (posts.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No blog posts published yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          {config.title || 'Latest Posts'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayPosts.map((post: any) => (
          <div
            key={post.id}
            className="border-b border-border pb-4 last:border-b-0 last:pb-0"
          >
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer">
                {post.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {config.showDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </div>
                )}
                
                {config.showViews && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.views || 0} views
                  </div>
                )}
              </div>

              {config.showExcerpt && post.excerpt && (
                <p className="text-sm text-muted-foreground">
                  {expandedPost === post.id 
                    ? post.excerpt 
                    : truncateText(post.excerpt, 150)
                  }
                </p>
              )}

              {config.showTags && post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="w-2 h-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {config.showExcerpt && post.excerpt && post.excerpt.length > 150 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedPost(
                    expandedPost === post.id ? null : post.id
                  )}
                  className="p-0 h-auto text-xs"
                >
                  {expandedPost === post.id ? 'Show less' : 'Read more'}
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {posts.length > (config.showCount || 3) && (
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full">
              View All Posts ({posts.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
