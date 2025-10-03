import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { atprotocol } from '../lib/atprotocol';
import { Link } from 'wouter';
import { Shield, ExternalLink, Users, Flag, Settings, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

interface ModeratorPermissions {
  canReviewReports: boolean;
  canIssueLabels: boolean;
  canTakedownContent: boolean;
  canSuspendAccounts: boolean;
}

interface ModeratorStatus {
  isModerator: boolean;
  permissions: ModeratorPermissions | null;
}

export default function ModerationPanel() {
  const { profile } = useAuth();
  const [status, setStatus] = useState<ModeratorStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkModeratorStatus();
  }, [profile]);

  const checkModeratorStatus = async () => {
    try {
      const did = atprotocol.getCurrentDid() || localStorage.getItem('userDid');
      
      console.log('🔍 Checking moderation status for DID:', did);
      
      if (!did) {
        console.log('❌ No DID found');
        setLoading(false);
        return;
      }

      // Check both admin and moderator status
      const [moderatorResponse, adminResponse] = await Promise.all([
        fetch('/api/moderation/status', {
          headers: { 'x-user-did': did },
        }),
        fetch('/api/admin/status', {
          headers: { 'x-user-did': did },
        })
      ]);

      const moderatorData = await moderatorResponse.json();
      const adminData = await adminResponse.json();

      console.log('🔍 Moderator data:', moderatorData);
      console.log('🔍 Admin data:', adminData);

      // If user is an admin, give them full moderator permissions
      if (adminData.isAdmin) {
        console.log('✅ User is admin, granting full moderator access');
        setStatus({
          isModerator: true,
          permissions: {
            canReviewReports: true,
            canIssueLabels: true,
            canTakedownContent: true,
            canSuspendAccounts: true
          }
        });
      } else if (moderatorData.isModerator) {
        console.log('✅ User is moderator');
        setStatus(moderatorData);
      } else {
        console.log('❌ User is neither admin nor moderator');
        setStatus({ isModerator: false, permissions: null });
      }
    } catch (error) {
      console.error('Failed to check moderator status:', error);
      setStatus({ isModerator: false, permissions: null });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Checking moderator access...</p>
        </div>
      </div>
    );
  }

  if (!status?.isModerator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <h1 className="text-xl font-bold">Moderation Panel</h1>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-6">
                You don't have moderator permissions to access this panel.
              </p>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Moderation Panel</h1>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Welcome, Moderator</h2>
                <p className="text-muted-foreground">
                  You have access to the Basker moderation system
                </p>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Your Permissions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Your Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PermissionCard
                title="Review Reports"
                description="View and triage content reports"
                enabled={status.permissions?.canReviewReports || false}
              />
              <PermissionCard
                title="Issue Labels"
                description="Apply warning labels to content"
                enabled={status.permissions?.canIssueLabels || false}
              />
              <PermissionCard
                title="Takedown Content"
                description="Remove violating content"
                enabled={status.permissions?.canTakedownContent || false}
              />
              <PermissionCard
                title="Suspend Accounts"
                description="Suspend user accounts"
                enabled={status.permissions?.canSuspendAccounts || false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Access Ozone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Self-Hosted Ozone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ozone is the official AT Protocol moderation tool. You need to self-host it for your own moderation dashboard.
              </p>
              <Button className="w-full" variant="outline" asChild>
                <a href="https://github.com/bluesky-social/ozone" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Ozone on GitHub
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                Clone and run Ozone locally to get a full moderation dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Manage Moderators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add or remove moderators and manage their permissions. Control who has access to moderation tools.
              </p>
              <Link href="/admin">
                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                Manage moderator roles and permissions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5" />
              Documentation & Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <DocLink
                title="Quick Access Guide"
                description="Learn how to access and use the moderation system"
                href="/docs/QUICK_ACCESS.md"
              />
              <DocLink
                title="Moderation Access Guide"
                description="Detailed instructions for moderator access"
                href="/docs/MODERATION_ACCESS_GUIDE.md"
              />
              <DocLink
                title="Ozone Integration"
                description="Full guide to Ozone integration and setup"
                href="/docs/OZONE_INTEGRATION.md"
              />
              <DocLink
                title="Ozone GitHub Repository"
                description="Official Ozone source code and documentation"
                href="https://github.com/bluesky-social/ozone"
                external
              />
            </div>
          </CardContent>
        </Card>

        {/* API Information */}
        <Card className="mt-8 border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium">API Endpoints Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">GET</Badge>
                <code className="text-xs">/api/moderation/status</code>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">GET</Badge>
                <code className="text-xs">/api/moderation/reports</code>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">POST</Badge>
                <code className="text-xs">/api/moderation/reports</code>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">GET</Badge>
                <code className="text-xs">/api/moderation/moderators</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function PermissionCard({ title, description, enabled }: { title: string; description: string; enabled: boolean }) {
  return (
    <div className={`p-4 rounded-lg border ${enabled ? 'bg-green-500/5 border-green-500/20' : 'bg-muted/50 border-border'}`}>
      <div className="flex items-start gap-3">
        {enabled ? (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        )}
        <div className="flex-1">
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

function DocLink({ title, description, href, external }: { title: string; description: string; href: string; external?: boolean }) {
  const content = (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group">
      <div className="flex-1">
        <h4 className="font-medium text-sm group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}
