import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface TetrisGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  highScoreEnabled?: boolean;
}

const ROWS = 20;
const COLS = 10;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // L
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // J
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // Z
];

const COLORS = ['#00F0F0', '#F0F000', '#A000F0', '#F0A000', '#0000F0', '#00F000', '#F00000'];

type Grid = number[][];

export function TetrisGame({ difficulty = 'medium', highScoreEnabled = true }: TetrisGameProps) {
  const [grid, setGrid] = useState<Grid>([]);
  const [currentPiece, setCurrentPiece] = useState<number[][]>([]);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [currentColor, setCurrentColor] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const getSpeed = () => {
    switch (difficulty) {
      case 'easy':
        return 800;
      case 'hard':
        return 300;
      default:
        return 500;
    }
  };

  useEffect(() => {
    if (highScoreEnabled) {
      const stored = localStorage.getItem('tetris_highscore');
      if (stored) setHighScore(parseInt(stored));
    }
  }, [highScoreEnabled]);

  const initializeGame = () => {
    const newGrid: Grid = Array(ROWS)
      .fill(0)
      .map(() => Array(COLS).fill(0));
    setGrid(newGrid);
    spawnPiece();
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const spawnPiece = () => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[shapeIndex];
    setCurrentPiece(shape);
    setCurrentPos({ x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2), y: 0 });
    setCurrentColor(shapeIndex);
  };

  const checkCollision = (piece: number[][], pos: { x: number; y: number }, gridToCheck: Grid): boolean => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const newY = pos.y + y;
          const newX = pos.x + x;
          if (newY >= ROWS || newX < 0 || newX >= COLS || (newY >= 0 && gridToCheck[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const mergePiece = () => {
    const newGrid = grid.map((row) => [...row]);
    for (let y = 0; y < currentPiece.length; y++) {
      for (let x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x]) {
          const gridY = currentPos.y + y;
          const gridX = currentPos.x + x;
          if (gridY >= 0) {
            newGrid[gridY][gridX] = currentColor + 1;
          }
        }
      }
    }

    // Clear completed lines
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (newGrid[y].every((cell) => cell !== 0)) {
        newGrid.splice(y, 1);
        newGrid.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++; // Check this line again
      }
    }

    const newScore = score + linesCleared * 100;
    setScore(newScore);

    if (highScoreEnabled && newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('tetris_highscore', newScore.toString());
    }

    setGrid(newGrid);

    // Spawn new piece
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[shapeIndex];
    const newPos = { x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2), y: 0 };

    if (checkCollision(shape, newPos, newGrid)) {
      setGameOver(true);
    } else {
      setCurrentPiece(shape);
      setCurrentPos(newPos);
      setCurrentColor(shapeIndex);
    }
  };

  const moveDown = useCallback(() => {
    if (!gameStarted || gameOver) return;

    const newPos = { ...currentPos, y: currentPos.y + 1 };
    if (!checkCollision(currentPiece, newPos, grid)) {
      setCurrentPos(newPos);
    } else {
      mergePiece();
    }
  }, [currentPiece, currentPos, grid, gameOver, gameStarted]);

  const moveHorizontal = (direction: number) => {
    if (!gameStarted || gameOver) return;
    const newPos = { ...currentPos, x: currentPos.x + direction };
    if (!checkCollision(currentPiece, newPos, grid)) {
      setCurrentPos(newPos);
    }
  };

  const rotate = () => {
    if (!gameStarted || gameOver) return;
    const rotated = currentPiece[0].map((_, i) =>
      currentPiece.map((row) => row[i]).reverse()
    );
    if (!checkCollision(rotated, currentPos, grid)) {
      setCurrentPiece(rotated);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveHorizontal(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveHorizontal(1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveDown();
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        rotate();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, moveDown]);

  useEffect(() => {
    const interval = setInterval(moveDown, getSpeed());
    return () => clearInterval(interval);
  }, [moveDown]);

  const renderGrid = () => {
    const displayGrid = grid.map((row) => [...row]);

    // Add current piece to display grid
    for (let y = 0; y < currentPiece.length; y++) {
      for (let x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x]) {
          const gridY = currentPos.y + y;
          const gridX = currentPos.x + x;
          if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
            displayGrid[gridY][gridX] = currentColor + 1;
          }
        }
      }
    }

    return displayGrid;
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
          <p className="text-lg font-semibold">Tetris</p>
          <p className="text-sm text-muted-foreground">Clear lines to score!</p>
          <Button onClick={initializeGame}>Start Game</Button>
        </div>
      ) : (
        <div className="relative">
          <div
            className="grid gap-[1px] p-2 bg-muted/50 rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              width: COLS * 20 + 4,
            }}
          >
            {renderGrid().map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className="w-[18px] h-[18px] rounded-sm"
                  style={{
                    backgroundColor: cell ? COLORS[cell - 1] : '#2a2a2a',
                  }}
                />
              ))
            )}
          </div>

          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
              <p className="text-white text-xl font-bold mb-2">Game Over!</p>
              <p className="text-white mb-4">Score: {score}</p>
              <Button onClick={initializeGame}>Play Again</Button>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        ← → to move • ↑/Space to rotate • ↓ to drop
      </p>
    </div>
  );
}

