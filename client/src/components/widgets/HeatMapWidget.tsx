import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, MousePointer, Eye, TrendingUp, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { atprotocol } from '@/lib/atprotocol';

interface HeatMapWidgetProps {
  config: {
    title: string;
    showClicks: boolean;
    showViews: boolean;
    timeRange: '24h' | '7d' | '30d' | 'all';
    showTopElements: boolean;
  };
  isEditMode?: boolean;
}

export function HeatMapWidget({ config, isEditMode = false }: HeatMapWidgetProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(config.timeRange || '7d');

  const { data: heatMapData, isLoading } = useQuery({
    queryKey: ['heatMapData'],
    queryFn: () => atprotocol.getHeatMapData(),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRangeFilter = (timeRange: string) => {
    const now = new Date();
    switch (timeRange) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0);
    }
  };

  const getFilteredData = () => {
    if (!heatMapData?.heatMapData) return [];
    
    const cutoffDate = getTimeRangeFilter(selectedTimeRange);
    return heatMapData.heatMapData.filter((item: any) => 
      new Date(item.updatedAt) >= cutoffDate
    );
  };

  const getTopElements = (type: 'clicks' | 'views') => {
    const filtered = getFilteredData();
    return filtered
      .sort((a: any, b: any) => b[type] - a[type])
      .slice(0, 5);
  };

  const getTotalStats = () => {
    const filtered = getFilteredData();
    return filtered.reduce(
      (acc: any, item: any) => ({
        totalClicks: acc.totalClicks + item.clicks,
        totalViews: acc.totalViews + item.views,
        elementCount: acc.elementCount + 1,
      }),
      { totalClicks: 0, totalViews: 0, elementCount: 0 }
    );
  };

  const getHeatIntensity = (value: number, maxValue: number) => {
    if (maxValue === 0) return 'bg-muted';
    const intensity = value / maxValue;
    if (intensity > 0.8) return 'bg-red-500';
    if (intensity > 0.6) return 'bg-orange-500';
    if (intensity > 0.4) return 'bg-yellow-500';
    if (intensity > 0.2) return 'bg-green-500';
    return 'bg-blue-500';
  };

  if (isEditMode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Heat Map Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure your analytics display in the widget editor
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

  const filteredData = getFilteredData();
  const stats = getTotalStats();
  const topClicks = getTopElements('clicks');
  const topViews = getTopElements('views');
  const maxClicks = Math.max(...filteredData.map((item: any) => item.clicks), 1);
  const maxViews = Math.max(...filteredData.map((item: any) => item.views), 1);

  if (filteredData.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No analytics data available</p>
          <p className="text-xs text-muted-foreground mt-2">
            Data will appear as visitors interact with your profile
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {config.title || 'Analytics'}
        </CardTitle>
        <div className="flex gap-2">
          {['24h', '7d', '30d', 'all'].map((range) => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange(range as any)}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clicks">Top Clicks</TabsTrigger>
            <TabsTrigger value="views">Top Views</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MousePointer className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Total Clicks</span>
                </div>
                <div className="text-2xl font-bold">{stats.totalClicks}</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Total Views</span>
                </div>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Element Activity</h4>
              {filteredData.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.elementId}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {item.elementType}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {config.showClicks && (
                      <div className="flex items-center gap-1">
                        <MousePointer className="w-3 h-3" />
                        <span className="text-sm">{item.clicks}</span>
                      </div>
                    )}
                    {config.showViews && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span className="text-sm">{item.views}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="clicks" className="space-y-3">
            {topClicks.map((item: any, index: number) => (
              <div key={item.id} className="flex items-center gap-3">
                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                  {index + 1}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.elementId}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {item.elementType}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getHeatIntensity(item.clicks, maxClicks)}`}
                      style={{ width: `${(item.clicks / maxClicks) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{item.clicks}</span>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="views" className="space-y-3">
            {topViews.map((item: any, index: number) => (
              <div key={item.id} className="flex items-center gap-3">
                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                  {index + 1}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.elementId}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {item.elementType}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getHeatIntensity(item.views, maxViews)}`}
                      style={{ width: `${(item.views / maxViews) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{item.views}</span>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
