import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface Game2048Props {
  highScoreEnabled?: boolean;
}

type Grid = number[][];

const SIZE = 4;

export function Game2048({ highScoreEnabled = true }: Game2048Props) {
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (highScoreEnabled) {
      const stored = localStorage.getItem('2048_highscore');
      if (stored) setHighScore(parseInt(stored));
    }
  }, [highScoreEnabled]);

  const initializeGrid = (): Grid => {
    const newGrid: Grid = Array(SIZE)
      .fill(0)
      .map(() => Array(SIZE).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    return newGrid;
  };

  const addRandomTile = (grid: Grid) => {
    const emptyCells: { row: number; col: number }[] = [];
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (grid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const startGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const move = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (gameOver || !gameStarted) return;

      let newGrid = grid.map((row) => [...row]);
      let moved = false;
      let newScore = score;

      const slide = (row: number[]): { row: number[]; score: number } => {
        const filtered = row.filter((val) => val !== 0);
        const result: number[] = [];
        let addedScore = 0;

        for (let i = 0; i < filtered.length; i++) {
          if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
            result.push(filtered[i] * 2);
            addedScore += filtered[i] * 2;
            i++;
          } else {
            result.push(filtered[i]);
          }
        }

        while (result.length < SIZE) {
          result.push(0);
        }

        return { row: result, score: addedScore };
      };

      if (direction === 'left') {
        for (let row = 0; row < SIZE; row++) {
          const { row: newRow, score: addedScore } = slide(newGrid[row]);
          if (JSON.stringify(newRow) !== JSON.stringify(newGrid[row])) moved = true;
          newGrid[row] = newRow;
          newScore += addedScore;
        }
      } else if (direction === 'right') {
        for (let row = 0; row < SIZE; row++) {
          const reversed = [...newGrid[row]].reverse();
          const { row: newRow, score: addedScore } = slide(reversed);
          if (JSON.stringify(newRow.reverse()) !== JSON.stringify(newGrid[row])) moved = true;
          newGrid[row] = newRow.reverse();
          newScore += addedScore;
        }
      } else if (direction === 'up') {
        for (let col = 0; col < SIZE; col++) {
          const column = newGrid.map((row) => row[col]);
          const { row: newColumn, score: addedScore } = slide(column);
          if (JSON.stringify(newColumn) !== JSON.stringify(column)) moved = true;
          for (let row = 0; row < SIZE; row++) {
            newGrid[row][col] = newColumn[row];
          }
          newScore += addedScore;
        }
      } else if (direction === 'down') {
        for (let col = 0; col < SIZE; col++) {
          const column = newGrid.map((row) => row[col]).reverse();
          const { row: newColumn, score: addedScore } = slide(column);
          if (JSON.stringify(newColumn.reverse()) !== JSON.stringify(newGrid.map((row) => row[col]))) moved = true;
          newColumn.reverse();
          for (let row = 0; row < SIZE; row++) {
            newGrid[row][col] = newColumn[row];
          }
          newScore += addedScore;
        }
      }

      if (moved) {
        addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(newScore);

        if (highScoreEnabled && newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('2048_highscore', newScore.toString());
        }

        // Check for game over
        if (!canMove(newGrid)) {
          setGameOver(true);
        }
      }
    },
    [grid, gameOver, gameStarted, score, highScore, highScoreEnabled]
  );

  const canMove = (grid: Grid): boolean => {
    // Check for empty cells
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (grid[row][col] === 0) return true;
      }
    }

    // Check for possible merges
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const current = grid[row][col];
        if (
          (col < SIZE - 1 && grid[row][col + 1] === current) ||
          (row < SIZE - 1 && grid[row + 1][col] === current)
        ) {
          return true;
        }
      }
    }

    return false;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        move('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        move('down');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        move('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        move('right');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move, gameStarted]);

  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      0: 'bg-muted',
      2: 'bg-blue-100',
      4: 'bg-blue-200',
      8: 'bg-orange-300',
      16: 'bg-orange-400',
      32: 'bg-red-300',
      64: 'bg-red-400',
      128: 'bg-yellow-300',
      256: 'bg-yellow-400',
      512: 'bg-green-300',
      1024: 'bg-green-400',
      2048: 'bg-purple-400',
    };
    return colors[value] || 'bg-purple-500';
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

      {!gameStarted ? (
        <div className="text-center space-y-4 py-8">
          <p className="text-lg font-semibold">2048</p>
          <p className="text-sm text-muted-foreground">
            Combine tiles to reach 2048!
          </p>
          <Button onClick={startGame}>Start Game</Button>
        </div>
      ) : (
        <div className="relative">
          <div className="grid grid-cols-4 gap-2 p-2 bg-muted/50 rounded-lg">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg ${getTileColor(
                    cell
                  )} transition-all`}
                >
                  {cell !== 0 && cell}
                </div>
              ))
            )}
          </div>

          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
              <p className="text-white text-xl font-bold mb-2">Game Over!</p>
              <p className="text-white mb-4">Final Score: {score}</p>
              <Button onClick={startGame}>Play Again</Button>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Use arrow keys to move tiles
      </p>
    </div>
  );
}

