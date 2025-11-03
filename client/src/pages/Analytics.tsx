import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHeatMap } from '@/hooks/use-heatmap';
import { BarChart3, TrendingUp, Users, MousePointer, ExternalLink, Calendar, Download, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';
import { Header } from '@/components/Header';
import { SEOHead } from '@/components/SEOHead';

export default function Analytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const { heatMapData } = useHeatMap();
  
  // Ensure heatMapData is always an array
  const data = Array.isArray(heatMapData) ? heatMapData : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <SEOHead 
          title="Analytics Dashboard - Basker"
          description="View your profile analytics and track engagement on Basker"
          keywords="Basker analytics, profile analytics, link tracking, engagement metrics"
        />
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Please log in to view analytics</p>
              <Link href="/">
                <Button>Go to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate stats from heat map data
  const totalClicks = data.reduce((sum, item) => sum + (item.clicks || 0), 0);
  const totalViews = data.reduce((sum, item) => sum + (item.views || 0), 0);
  const linkClicks = data.filter(item => item.elementType === 'link');
  const widgetClicks = data.filter(item => item.elementType === 'widget');

  // Sort links by clicks
  const topLinks = [...linkClicks].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  // Calculate CTR
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <SEOHead 
        title="Analytics Dashboard - Basker"
        description="View your profile analytics and track engagement on Basker"
        keywords="Basker analytics, profile analytics, link tracking, engagement metrics"
      />
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your profile performance and engagement</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Profile visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Link & widget clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ctr}%</div>
            <p className="text-xs text-muted-foreground">
              Clicks per view
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkClicks.length}</div>
            <p className="text-xs text-muted-foreground">
              Published links
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="links" className="space-y-4">
        <TabsList>
          <TabsTrigger value="links">Link Performance</TabsTrigger>
          <TabsTrigger value="widgets">Widget Stats</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Links</CardTitle>
              <CardDescription>Your most clicked links</CardDescription>
            </CardHeader>
            <CardContent>
              {topLinks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No link data available yet. Start adding links to track their performance!
                </p>
              ) : (
                <div className="space-y-4">
                  {topLinks.map((link, index) => {
                    const clickRate = totalViews > 0 ? ((link.clicks / totalViews) * 100).toFixed(1) : '0';
                    return (
                      <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">Link #{link.elementId.slice(-8)}</p>
                            <p className="text-sm text-muted-foreground">
                              Last clicked: {link.lastClicked ? new Date(link.lastClicked).toLocaleDateString() : 'Never'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-2xl font-bold">{link.clicks}</p>
                            <p className="text-xs text-muted-foreground">clicks</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{clickRate}%</p>
                            <p className="text-xs text-muted-foreground">CTR</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="widgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Widget Engagement</CardTitle>
              <CardDescription>Interactions with your widgets</CardDescription>
            </CardHeader>
            <CardContent>
              {widgetClicks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No widget interaction data yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {widgetClicks.map((widget, index) => (
                    <div key={widget.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <BarChart3 className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Widget #{widget.elementId.slice(-8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {widget.elementType}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{widget.clicks}</p>
                        <p className="text-xs text-muted-foreground">interactions</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Traffic source tracking coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>Visitor devices and browsers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Device analytics coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.bsky.app/img/avatar/plain/did:plc:uw2cz5hnxy2i6jbmh6t2i7hi/bafkreihdglcgqdgmlak64violet4j3g7xwsio4odk2j5cn67vatl3iu5we@jpeg"
                alt="Basker"
                className="w-5 h-5 rounded-full"
              />
              <h3 className="text-lg font-bold text-primary">Basker</h3>
              <span className="text-sm text-muted-foreground">© 2025</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">v2.0.0.0</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                Built on the AT Protocol • Your data, your control
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your own link-in-bio page with basker
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

