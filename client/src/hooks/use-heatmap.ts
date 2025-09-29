import { useMutation, useQuery } from '@tanstack/react-query';
import { atprotocol } from '@/lib/atprotocol';
import { useEffect } from 'react';

export function useHeatMap() {
  const { data: heatMapData, refetch } = useQuery({
    queryKey: ['heatMapData'],
    queryFn: () => atprotocol.getHeatMapData(),
  });

  const trackMutation = useMutation({
    mutationFn: async (trackingData: {
      elementId: string;
      elementType: 'link' | 'widget' | 'story' | 'button';
      action: 'click' | 'view';
    }) => {
      if (!heatMapData?.heatMapData) return;
      
      const existingData = heatMapData.heatMapData;
      const existingItem = existingData.find(
        (item: any) => item.elementId === trackingData.elementId
      );

      let updatedData;
      if (existingItem) {
        updatedData = existingData.map((item: any) => {
          if (item.elementId === trackingData.elementId) {
            return {
              ...item,
              [trackingData.action === 'click' ? 'clicks' : 'views']: 
                item[trackingData.action === 'click' ? 'clicks' : 'views'] + 1,
              lastClicked: trackingData.action === 'click' ? new Date().toISOString() : item.lastClicked,
              updatedAt: new Date().toISOString(),
            };
          }
          return item;
        });
      } else {
        const newItem = {
          id: `heat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          elementId: trackingData.elementId,
          elementType: trackingData.elementType,
          clicks: trackingData.action === 'click' ? 1 : 0,
          views: trackingData.action === 'view' ? 1 : 0,
          lastClicked: trackingData.action === 'click' ? new Date().toISOString() : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updatedData = [...existingData, newItem];
      }

      await atprotocol.saveHeatMapData(updatedData);
      return updatedData;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const trackClick = (elementId: string, elementType: 'link' | 'widget' | 'story' | 'button') => {
    trackMutation.mutate({
      elementId,
      elementType,
      action: 'click',
    });
  };

  const trackView = (elementId: string, elementType: 'link' | 'widget' | 'story' | 'button') => {
    trackMutation.mutate({
      elementId,
      elementType,
      action: 'view',
    });
  };

  return {
    heatMapData: heatMapData?.heatMapData || [],
    trackClick,
    trackView,
    isLoading: trackMutation.isPending,
  };
}

// Hook for automatic view tracking
export function useViewTracking(elementId: string, elementType: 'link' | 'widget' | 'story' | 'button') {
  const { trackView } = useHeatMap();

  useEffect(() => {
    // Track view when component mounts
    trackView(elementId, elementType);
  }, [elementId, elementType, trackView]);
}
