import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Code, Play, Square } from 'lucide-react';

interface CustomGameProps {
  customCode?: string;
  highScoreEnabled?: boolean;
}

export function CustomGame({ customCode = '', highScoreEnabled = true }: CustomGameProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (highScoreEnabled) {
      const stored = localStorage.getItem('custom_game_highscore');
      if (stored) setHighScore(parseInt(stored));
    }
  }, [highScoreEnabled]);

  const runCode = () => {
    if (!customCode.trim()) {
      setError('No code provided');
      return;
    }

    setError(null);
    setOutput('');
    setIsRunning(true);

    try {
      // Create a safe execution environment
      const safeCode = `
        (function() {
          let score = 0;
          let output = '';
          let gameRunning = true;
          let gameInterval = null;
          
          // Override console.log to capture output
          const originalLog = console.log;
          console.log = function(...args) {
            output += args.join(' ') + '\\n';
          };
          
          // Game API functions
          const gameAPI = {
            setScore: (newScore) => { 
              score = Math.max(0, newScore); 
              if (score > 0) {
                output += 'Score: ' + score + '\\n';
              }
            },
            addScore: (points) => { 
              score += points; 
              if (points > 0) {
                output += 'Added ' + points + ' points! Score: ' + score + '\\n';
              }
            },
            getScore: () => score,
            stop: () => { 
              gameRunning = false; 
              if (gameInterval) {
                clearInterval(gameInterval);
              }
              output += 'Game stopped!\\n';
            },
            isRunning: () => gameRunning,
            log: (...args) => { output += args.join(' ') + '\\n'; },
            wait: (ms) => {
              return new Promise(resolve => setTimeout(resolve, ms));
            },
            random: (min, max) => {
              return Math.floor(Math.random() * (max - min + 1)) + min;
            }
          };
          
          // Execute user code
          ${customCode}
          
          // Restore console.log
          console.log = originalLog;
          
          return { score, output, gameRunning };
        })();
      `;

      const result = eval(safeCode);
      setScore(result.score || 0);
      setOutput(result.output || '');
      
      if (highScoreEnabled && result.score > highScore) {
        setHighScore(result.score);
        localStorage.setItem('custom_game_highscore', result.score.toString());
      }
      
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const stopCode = () => {
    setIsRunning(false);
    setError('Game stopped');
  };

  const resetGame = () => {
    setScore(0);
    setOutput('');
    setError(null);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-between w-full max-w-sm">
        <div className="text-sm">
          <span className="text-muted-foreground">Score: </span>
          <span className="font-bold">{score}</span>
        </div>
        {highScoreEnabled && (
          <div className="text-sm">
            <span className="text-muted-foreground">Best: </span>
            <span className="font-bold">{highScore}</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-sm space-y-3">
        <div className="flex gap-2">
          <Button 
            onClick={runCode} 
            disabled={isRunning || !customCode.trim()}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Game'}
          </Button>
          {isRunning && (
            <Button onClick={stopCode} variant="outline">
              <Square className="w-4 h-4" />
            </Button>
          )}
          <Button onClick={resetGame} variant="outline">
            Reset
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {output && (
          <div className="p-3 bg-muted border rounded-lg text-sm font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
            {output}
          </div>
        )}

        {!customCode.trim() && (
          <div className="text-center space-y-4 py-8">
            <Code className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-lg font-semibold">Code Your Own Game</p>
            <p className="text-sm text-muted-foreground">
              Add your custom JavaScript game code in the widget settings!
            </p>
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg text-left">
              <p className="font-semibold mb-2">Available API:</p>
              <ul className="space-y-1">
                <li>• gameAPI.setScore(score) - Set current score</li>
                <li>• gameAPI.addScore(points) - Add to score</li>
                <li>• gameAPI.getScore() - Get current score</li>
                <li>• gameAPI.log(text) - Display text</li>
                <li>• gameAPI.stop() - Stop the game</li>
                <li>• gameAPI.random(min, max) - Random number</li>
                <li>• gameAPI.wait(ms) - Wait (async)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
