import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlipHorizontal } from 'lucide-react';

interface BeforeAfterSliderWidgetProps {
  config: {
    title?: string;
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
    startPosition?: number;
    showLabels?: boolean;
    orientation?: 'vertical' | 'horizontal';
  };
}

export function BeforeAfterSliderWidget({ config }: BeforeAfterSliderWidgetProps) {
  const [sliderPosition, setSliderPosition] = useState(config.startPosition || 50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!config.beforeImage || !config.afterImage) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Configure before and after images in widget settings
        </CardContent>
      </Card>
    );
  }

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlipHorizontal className="w-5 h-5" />
          {config.title || 'Before & After'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="relative w-full aspect-video overflow-hidden rounded-lg cursor-col-resize select-none"
          onMouseMove={handleMouseMove}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchMove={handleTouchMove}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
        >
          {/* After Image (Full) */}
          <div className="absolute inset-0">
            <img
              src={config.afterImage}
              alt={config.afterLabel || 'After'}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {config.showLabels !== false && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {config.afterLabel || 'After'}
              </div>
            )}
          </div>

          {/* Before Image (Clipped) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={config.beforeImage}
              alt={config.beforeLabel || 'Before'}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {config.showLabels !== false && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {config.beforeLabel || 'Before'}
              </div>
            )}
          </div>

          {/* Slider */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize shadow-lg"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </div>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-3">
          Drag the slider to compare
        </p>
      </CardContent>
    </Card>
  );
}

