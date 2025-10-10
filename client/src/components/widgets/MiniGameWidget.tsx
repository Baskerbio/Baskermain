import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, RotateCcw } from 'lucide-react';
import { SnakeGame } from './games/SnakeGame';
import { MemoryGame } from './games/MemoryGame';
import { Game2048 } from './games/Game2048';
import { TetrisGame } from './games/TetrisGame';

interface MiniGameWidgetProps {
  config: {
    game?: 'snake' | 'memory' | '2048' | 'tetris';
    title?: string;
    highScoreEnabled?: boolean;
    difficulty?: 'easy' | 'medium' | 'hard';
    theme?: string;
  };
}

export function MiniGameWidget({ config }: MiniGameWidgetProps) {
  const [gameKey, setGameKey] = useState(0);

  const resetGame = () => {
    setGameKey((prev) => prev + 1);
  };

  const renderGame = () => {
    switch (config.game || 'snake') {
      case 'snake':
        return <SnakeGame key={gameKey} difficulty={config.difficulty} highScoreEnabled={config.highScoreEnabled} />;
      case 'memory':
        return <MemoryGame key={gameKey} difficulty={config.difficulty} highScoreEnabled={config.highScoreEnabled} />;
      case '2048':
        return <Game2048 key={gameKey} highScoreEnabled={config.highScoreEnabled} />;
      case 'tetris':
        return <TetrisGame key={gameKey} difficulty={config.difficulty} highScoreEnabled={config.highScoreEnabled} />;
      default:
        return <div className="text-center text-muted-foreground">Game not found</div>;
    }
  };

  const getGameName = () => {
    switch (config.game || 'snake') {
      case 'snake':
        return 'Snake';
      case 'memory':
        return 'Memory Match';
      case '2048':
        return '2048';
      case 'tetris':
        return 'Tetris';
      default:
        return 'Game';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            {config.title || getGameName()}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={resetGame}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Restart
          </Button>
        </div>
      </CardHeader>
      <CardContent>{renderGame()}</CardContent>
    </Card>
  );
}

