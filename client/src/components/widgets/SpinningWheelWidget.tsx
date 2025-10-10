import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface SpinningWheelWidgetProps {
  config: {
    title?: string;
    prizes: string[];
    colors?: string[];
    spinDuration?: number;
    spinsPerUser?: number;
    showResult?: boolean;
  };
  widgetId: string;
}

export function SpinningWheelWidget({ config, widgetId }: SpinningWheelWidgetProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(config.spinsPerUser || 1);

  const prizes = config.prizes || ['Prize 1', 'Prize 2', 'Prize 3'];
  const colors = config.colors || [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
  ];

  useEffect(() => {
    const storageKey = `spins_${widgetId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setSpinsLeft(data.spinsLeft || 0);
      } catch (e) {
        console.error('Failed to load spins:', e);
      }
    }
  }, [widgetId]);

  const spin = () => {
    if (spinning || spinsLeft <= 0) return;

    setSpinning(true);
    setResult(null);

    // Random prize index
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const segmentAngle = 360 / prizes.length;
    const targetRotation = 360 * 5 + prizeIndex * segmentAngle + segmentAngle / 2;

    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(prizes[prizeIndex]);
      const newSpinsLeft = spinsLeft - 1;
      setSpinsLeft(newSpinsLeft);

      // Save to localStorage
      const storageKey = `spins_${widgetId}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({ spinsLeft: newSpinsLeft })
      );
    }, config.spinDuration || 4000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          {config.title || 'Spin to Win!'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wheel */}
        <div className="relative w-64 h-64 mx-auto">
          <div
            className="relative w-full h-full rounded-full border-4 border-primary shadow-xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${config.spinDuration || 4000}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
                : 'none',
            }}
          >
            {prizes.map((prize, index) => {
              const segmentAngle = 360 / prizes.length;
              const startAngle = index * segmentAngle;
              const color = colors[index % colors.length];

              return (
                <div
                  key={index}
                  className="absolute w-full h-full"
                  style={{
                    transform: `rotate(${startAngle}deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${
                      50 + 50 * Math.sin((segmentAngle * Math.PI) / 180)
                    }% ${50 - 50 * Math.cos((segmentAngle * Math.PI) / 180)}%)`,
                    backgroundColor: color,
                  }}
                >
                  <div
                    className="absolute top-8 left-1/2 -translate-x-1/2 text-white font-bold text-sm text-center px-2"
                    style={{
                      transform: `rotate(${segmentAngle / 2}deg)`,
                      maxWidth: '80px',
                    }}
                  >
                    {prize}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-primary shadow-lg flex items-center justify-center">
            <div className="text-2xl">🎯</div>
          </div>

          {/* Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-primary z-10" />
        </div>

        {/* Spin Button */}
        <div className="text-center space-y-3">
          <Button
            onClick={spin}
            disabled={spinning || spinsLeft <= 0}
            size="lg"
            className="w-full"
          >
            {spinning ? 'Spinning...' : spinsLeft > 0 ? 'Spin the Wheel!' : 'No spins left'}
          </Button>

          <p className="text-sm text-muted-foreground">
            Spins remaining: <span className="font-bold">{spinsLeft}</span>
          </p>
        </div>

        {/* Result */}
        {config.showResult !== false && result && (
          <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary animate-pulse">
            <p className="text-sm text-muted-foreground mb-1">You won:</p>
            <p className="text-xl font-bold text-primary">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

