import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Star, GitFork, Users } from 'lucide-react';

interface GitHubActivityWidgetProps {
  config: {
    username: string;
    showStats?: boolean;
    showContributions?: boolean;
    showRepos?: boolean;
    repoCount?: number;
    theme?: string;
  };
}

export function GitHubActivityWidget({ config }: GitHubActivityWidgetProps) {
  const [userData, setUserData] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!config.username) return;

    const fetchGitHubData = async () => {
      setLoading(true);
      try {
        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${config.username}`);
        const userData = await userRes.json();
        setUserData(userData);

        // Fetch repos
        if (config.showRepos) {
          const reposRes = await fetch(
            `https://api.github.com/users/${config.username}/repos?sort=stars&per_page=${config.repoCount || 3}`
          );
          const reposData = await reposRes.json();
          setRepos(reposData);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [config.username, config.repoCount, config.showRepos]);

  if (!config.username) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Configure your GitHub username in widget settings
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading GitHub data...
        </CardContent>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Unable to load GitHub profile
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          GitHub Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <img
            src={userData.avatar_url}
            alt={userData.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{userData.name || userData.login}</h3>
            <p className="text-sm text-muted-foreground">@{userData.login}</p>
          </div>
        </div>

        {/* Stats */}
        {config.showStats !== false && (
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-xl font-bold text-primary">{userData.public_repos}</div>
              <div className="text-xs text-muted-foreground">Repos</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-xl font-bold text-primary">{userData.followers}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-xl font-bold text-primary">{userData.following}</div>
              <div className="text-xs text-muted-foreground">Following</div>
            </div>
          </div>
        )}

        {/* Top Repositories */}
        {config.showRepos !== false && repos.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Top Repositories</h4>
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{repo.name}</h5>
                    {repo.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {repo.language && (
                    <Badge variant="secondary" className="text-xs">
                      {repo.language}
                    </Badge>
                  )}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <GitFork className="w-3 h-3" />
                    {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Contribution Graph */}
        {config.showContributions !== false && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Contributions</h4>
            <img
              src={`https://ghchart.rshah.org/${config.username}`}
              alt="GitHub Contributions"
              className="w-full rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

