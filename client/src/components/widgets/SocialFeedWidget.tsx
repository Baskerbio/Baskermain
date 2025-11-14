import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface SocialFeedWidgetConfig {
  platform?: 'bluesky' | 'mastodon' | 'twitter' | 'custom';
  handle?: string;
  postLimit?: number;
  showAvatars?: boolean;
  samplePosts?: Array<{
    id: string;
    content: string;
    publishedAt?: string;
  }>;
}

interface SocialFeedWidgetProps {
  config: SocialFeedWidgetConfig;
  isPublic?: boolean;
}

interface FetchedPost {
  id: string;
  content: string;
  publishedAt?: string;
  uri?: string;
}

interface ActorSearchResult {
  did: string;
  handle: string;
}

const platformLabels: Record<string, string> = {
  bluesky: 'Bluesky',
  mastodon: 'Mastodon',
  twitter: 'Twitter',
  custom: 'Social',
};

function normalizeHandle(rawHandle?: string) {
  if (!rawHandle) return '';
  const handle = rawHandle.trim().replace(/^@/, '').toLowerCase();
  if (handle.startsWith('did:')) return handle;
  if (!handle.includes('.')) {
    return `${handle}.bsky.social`;
  }
  return handle;
}

function buildHandleCandidates(rawHandle?: string) {
  if (!rawHandle) return [];
  const candidates = new Set<string>();
  const cleaned = rawHandle.trim().replace(/^@/, '');
  if (cleaned) {
    candidates.add(cleaned.toLowerCase());
    if (!cleaned.includes('.') && !cleaned.startsWith('did:')) {
      candidates.add(`${cleaned.toLowerCase()}.bsky.social`);
    }
    if (cleaned.startsWith('did:')) {
      candidates.add(cleaned);
    }
  }
  return Array.from(candidates);
}

async function fetchAuthorFeed(actor: string, limit: number) {
  const url = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(actor)}&limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.json();
}

async function searchActor(term: string): Promise<ActorSearchResult | null> {
  const url = `https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?term=${encodeURIComponent(term)}&limit=5`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const data = await response.json();
  if (!Array.isArray(data.actors)) return null;
  const match = data.actors.find((actor: any) => {
    const handle = actor?.handle?.toLowerCase();
    return handle === term.toLowerCase() || handle === `${term.toLowerCase()}.bsky.social`;
  }) || data.actors[0];
  if (!match) return null;
  return { did: match.did, handle: match.handle };
}

function formatTimestamp(date?: string) {
  if (!date) return 'Just now';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return 'Recently';
  }
}

function buildFallbackPosts(handle?: string): SocialFeedWidgetConfig['samplePosts'] {
  const safeHandle = handle?.trim() || 'your-handle';
  return [
    {
      id: 'preview-1',
      content: `Sharing a quick project update — new widget layouts are live on Basker!`,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'preview-2',
      content: `Pinned a fresh link: basker.bio/${safeHandle}. Take a look and let me know what you think.`,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      id: 'preview-3',
      content: `Saturday mood board is up — swipe through the gallery on my Basker page.`,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
  ];
}

const SocialFeedWidget: React.FC<SocialFeedWidgetProps> = ({ config, isPublic = false }) => {
  const platform = config.platform || 'bluesky';
  const [posts, setPosts] = useState<FetchedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const resolveBlueskyFeed = async (handle: string) => {
      const limit = config.postLimit || 3;
      const baseCandidates = buildHandleCandidates(handle);
      const tried = new Set<string>();

      const tryCandidate = async (candidate: string) => {
        if (tried.has(candidate)) return [];
        tried.add(candidate);
        const data = await fetchAuthorFeed(candidate, limit);
        return Array.isArray(data.feed) ? data.feed : [];
      };

      for (const candidate of baseCandidates) {
        try {
          const feed = await tryCandidate(candidate);
          if (feed.length > 0) {
            return feed;
          }
        } catch (err) {
          console.debug('Bluesky feed attempt failed for', candidate, err);
        }
      }

      const cleaned = handle.trim().replace(/^@/, '');
      const searchMatch = await searchActor(cleaned);
      if (searchMatch) {
        const searchCandidates = buildHandleCandidates(searchMatch.did || searchMatch.handle);
        for (const candidate of searchCandidates) {
          try {
            const feed = await tryCandidate(candidate);
            if (feed.length > 0) {
              return feed;
            }
          } catch (err) {
            console.debug('Bluesky feed attempt (search) failed for', candidate, err);
          }
        }
      }

      throw new Error('No feed entries returned');
    };

    const fetchBlueskyFeed = async (handle: string) => {
      setLoading(true);
      setError(null);
      try {
        const feed = await resolveBlueskyFeed(handle);
        if (isCancelled) return;

        const feedPosts: FetchedPost[] = feed
          .map((item: any) => {
            const postContent = item?.post?.record?.text;
            if (!postContent) return null;
            const uri: string | undefined = item?.post?.uri || item?.post?.record?.uri;
            return {
              id: uri || `${handle}-${Math.random().toString(36).slice(2)}`,
              content: postContent,
              publishedAt: item.post?.indexedAt,
              uri,
            } as FetchedPost;
          })
          .filter(Boolean);

        if (feedPosts.length === 0) {
          setError('No recent posts found.');
          setPosts([]);
        } else {
          setPosts(feedPosts);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Failed to load Bluesky feed:', err);
          setError('Unable to load recent posts right now.');
          setPosts([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    if (platform === 'bluesky' && config.handle?.trim()) {
      fetchBlueskyFeed(config.handle.trim());
    } else {
      setPosts([]);
      setError(null);
    }

    return () => {
      isCancelled = true;
    };
  }, [platform, config.handle, config.postLimit]);

  const hasFetchedPosts = posts.length > 0;
  const fallbackPosts =
    config.samplePosts && config.samplePosts.length > 0
      ? config.samplePosts.slice(0, config.postLimit || 3)
      : buildFallbackPosts(config.handle).slice(0, config.postLimit || 3);

  const postsToRender = hasFetchedPosts ? posts.slice(0, config.postLimit || 3) : fallbackPosts;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline" className="border-dashed">
            {platformLabels[platform] || 'Social'}
          </Badge>
          <span className="text-base font-medium">Latest posts</span>
        </CardTitle>
        {config.handle && (
          <p className="text-sm text-muted-foreground">
            @{normalizeHandle(config.handle)}
          </p>
        )}
        {!isPublic && (
          <p className="text-xs text-muted-foreground">
            Connect your account in the widget settings to pull live posts.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <p className="text-xs text-muted-foreground">Loading latest posts…</p>
        )}
        {!loading && hasFetchedPosts && (
          <p className="text-xs text-muted-foreground">Powered by Bluesky</p>
        )}
        {error && !loading && (
          <p className="text-xs text-muted-foreground">{error}</p>
        )}
        {postsToRender.map((post) => {
          const postUrl = post.uri && post.uri.startsWith('at://')
            ? post.uri.replace('at://', 'https://bsky.app/profile/').replace('/app.bsky.feed.post/', '/post/')
            : undefined;

          const PostWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
            postUrl
              ? (
                  <a
                    href={postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 rounded-lg transition-colors hover:bg-muted/40"
                  >
                    {children}
                  </a>
                )
              : (
                  <div className="flex gap-3">
                    {children}
                  </div>
                );

          return (
            <PostWrapper key={post.id}>
              {config.showAvatars !== false && (
                <Avatar className="w-8 h-8 shrink-0 bg-primary/10 text-primary">
                  <AvatarFallback>
                    {(config.handle || 'B').slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1 space-y-1.5 py-1">
                <p className="text-sm leading-snug text-foreground whitespace-pre-wrap">
                  {post.content}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(post.publishedAt)}
                </p>
              </div>
            </PostWrapper>
          );
        })}
      </CardContent>
    </Card>
  );
};

export const PublicSocialFeedWidget: React.FC<{ config: SocialFeedWidgetConfig }> = ({ config }) => (
  <SocialFeedWidget config={config} isPublic />
);

export default SocialFeedWidget;

