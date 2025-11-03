import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronDown, RotateCw, ChevronUp } from 'lucide-react';

interface TetrisGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  highScoreEnabled?: boolean;
}

const ROWS = 20;
const COLS = 10;

// Tetris piece definitions with proper rotations
interface Tetromino {
  shape: number[][];
  rotations: number[][][];
}

const TETROMINOES: { [key: string]: Tetromino } = {
  I: {
    shape: [[1, 1, 1, 1]],
    rotations: [
      [[1, 1, 1, 1]],
      [[1], [1], [1], [1]],
    ],
  },
  O: {
    shape: [[1, 1], [1, 1]],
    rotations: [
      [[1, 1], [1, 1]],
    ],
  },
  T: {
    shape: [[0, 1, 0], [1, 1, 1]],
    rotations: [
      [[0, 1, 0], [1, 1, 1]],
      [[1, 0], [1, 1], [1, 0]],
      [[1, 1, 1], [0, 1, 0]],
      [[0, 1], [1, 1], [0, 1]],
    ],
  },
  L: {
    shape: [[1, 0, 0], [1, 1, 1]],
    rotations: [
      [[1, 0, 0], [1, 1, 1]],
      [[1, 1], [1, 0], [1, 0]],
      [[1, 1, 1], [0, 0, 1]],
      [[0, 1], [0, 1], [1, 1]],
    ],
  },
  J: {
    shape: [[0, 0, 1], [1, 1, 1]],
    rotations: [
      [[0, 0, 1], [1, 1, 1]],
      [[1, 0], [1, 0], [1, 1]],
      [[1, 1, 1], [1, 0, 0]],
      [[1, 1], [0, 1], [0, 1]],
    ],
  },
  S: {
    shape: [[0, 1, 1], [1, 1, 0]],
    rotations: [
      [[0, 1, 1], [1, 1, 0]],
      [[1, 0], [1, 1], [0, 1]],
    ],
  },
  Z: {
    shape: [[1, 1, 0], [0, 1, 1]],
    rotations: [
      [[1, 1, 0], [0, 1, 1]],
      [[0, 1], [1, 1], [1, 0]],
    ],
  },
};

const COLORS = [
  '#00F0F0', // I - Cyan
  '#F0F000', // O - Yellow
  '#A000F0', // T - Purple
  '#F0A000', // L - Orange
  '#0000F0', // J - Blue
  '#00F000', // S - Green
  '#F00000', // Z - Red
];

const PIECE_NAMES = ['I', 'O', 'T', 'L', 'J', 'S', 'Z'];

type Grid = number[][];

export function TetrisGame({ difficulty = 'medium', highScoreEnabled = true }: TetrisGameProps) {
  const [grid, setGrid] = useState<Grid>([]);
  const [currentPiece, setCurrentPiece] = useState<{ name: string; rotations: number[][][]; rotationIndex: number } | null>(null);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [currentColor, setCurrentColor] = useState(0);
  const [nextPiece, setNextPiece] = useState<string>('I');
  const [nextPieceColor, setNextPieceColor] = useState(0);
  const [heldPiece, setHeldPiece] = useState<string | null>(null);
  const [heldPieceColor, setHeldPieceColor] = useState(0);
  const [canHold, setCanHold] = useState(true);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Touch controls
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  
  // Refs to track latest state for mergePiece
  const gridRef = useRef(grid);
  const currentPieceRef = useRef(currentPiece);
  const currentPosRef = useRef(currentPos);
  const currentColorRef = useRef(currentColor);
  const nextPieceRef = useRef(nextPiece);
  const nextPieceColorRef = useRef(nextPieceColor);
  const heldPieceRef = useRef(heldPiece);
  const heldPieceColorRef = useRef(heldPieceColor);
  const canHoldRef = useRef(canHold);
  const scoreRef = useRef(score);
  const linesRef = useRef(lines);
  const levelRef = useRef(level);
  const highScoreRef = useRef(highScore);
  const gameStartedRef = useRef(gameStarted);
  const isPausedRef = useRef(isPaused);
  const gameOverRef = useRef(gameOver);

  useEffect(() => {
    gridRef.current = grid;
    currentPieceRef.current = currentPiece;
    currentPosRef.current = currentPos;
    currentColorRef.current = currentColor;
    nextPieceRef.current = nextPiece;
    nextPieceColorRef.current = nextPieceColor;
    heldPieceRef.current = heldPiece;
    heldPieceColorRef.current = heldPieceColor;
    canHoldRef.current = canHold;
    scoreRef.current = score;
    linesRef.current = lines;
    levelRef.current = level;
    highScoreRef.current = highScore;
    gameStartedRef.current = gameStarted;
    isPausedRef.current = isPaused;
    gameOverRef.current = gameOver;
  }, [grid, currentPiece, currentPos, currentColor, nextPiece, nextPieceColor, heldPiece, heldPieceColor, canHold, score, lines, level, highScore, gameStarted, isPaused, gameOver]);

  const getSpeed = () => {
    const baseSpeed = difficulty === 'easy' ? 800 : difficulty === 'hard' ? 300 : 500;
    return Math.max(50, baseSpeed - (levelRef.current - 1) * 50);
  };

  useEffect(() => {
    if (highScoreEnabled) {
      const stored = localStorage.getItem('tetris_highscore');
      if (stored) setHighScore(parseInt(stored));
    }
  }, [highScoreEnabled]);

  useEffect(() => {
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [lines]);

  const initializeGame = () => {
    const newGrid: Grid = Array(ROWS)
      .fill(0)
      .map(() => Array(COLS).fill(0));
    setGrid(newGrid);
    setHeldPiece(null);
    setCanHold(true);
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    const firstPiece = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
    const firstColor = PIECE_NAMES.indexOf(firstPiece);
    spawnPiece(firstPiece, firstColor);
    const nextPiece = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
    const nextColor = PIECE_NAMES.indexOf(nextPiece);
    setNextPiece(nextPiece);
    setNextPieceColor(nextColor);
    setGameStarted(true);
  };

  const spawnPiece = (pieceName: string, colorIndex: number) => {
    const tetromino = TETROMINOES[pieceName];
    setCurrentPiece({ name: pieceName, rotations: tetromino.rotations, rotationIndex: 0 });
    setCurrentPos({ x: Math.floor(COLS / 2) - 1, y: 0 });
    setCurrentColor(colorIndex);
    setCanHold(true);
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
    if (!currentPieceRef.current) return;
    
    const currentGrid = gridRef.current;
    const piece = currentPieceRef.current;
    const pos = currentPosRef.current;
    const color = currentColorRef.current;
    const next = nextPieceRef.current;
    const nextColor = nextPieceColorRef.current;
    
    const newGrid = currentGrid.map((row) => [...row]);
    const shape = piece.rotations[piece.rotationIndex];
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const gridY = pos.y + y;
          const gridX = pos.x + x;
          if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
            newGrid[gridY][gridX] = color + 1;
          }
        }
      }
    }

    // Clear completed lines with improved scoring
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (newGrid[y].every((cell) => cell !== 0)) {
        newGrid.splice(y, 1);
        newGrid.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++; // Check this line again
      }
    }

    // Calculate score based on lines cleared
    const currentScore = scoreRef.current;
    const currentLines = linesRef.current;
    const currentLevel = levelRef.current;
    
    let lineScore = 0;
    switch (linesCleared) {
      case 1:
        lineScore = 100 * currentLevel;
        break;
      case 2:
        lineScore = 300 * currentLevel;
        break;
      case 3:
        lineScore = 500 * currentLevel;
        break;
      case 4:
        lineScore = 800 * currentLevel; // Tetris!
        break;
    }

    const newScore = currentScore + lineScore;
    const newLines = currentLines + linesCleared;
    const newLevel = Math.floor(newLines / 10) + 1;

    setScore(newScore);
    setLines(newLines);
    setLevel(newLevel);

    if (highScoreEnabled && newScore > highScoreRef.current) {
      setHighScore(newScore);
      localStorage.setItem('tetris_highscore', newScore.toString());
    }

    setGrid(newGrid);

    // Spawn next piece
    const tetromino = TETROMINOES[next];
    const spawnPos = { x: Math.floor(COLS / 2) - 1, y: 0 };

    if (checkCollision(tetromino.rotations[0], spawnPos, newGrid)) {
      setGameOver(true);
    } else {
      spawnPiece(next, nextColor);
      // Generate next next piece
      const nextNextPiece = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
      const nextNextColor = PIECE_NAMES.indexOf(nextNextPiece);
      setNextPiece(nextNextPiece);
      setNextPieceColor(nextNextColor);
    }
  };

  const moveDown = () => {
    const currentGrid = gridRef.current;
    const piece = currentPieceRef.current;
    const pos = currentPosRef.current;
    const isStarted = gameStartedRef.current;
    const isPausedState = isPausedRef.current;
    const gameOverState = gameOverRef.current;
    
    if (!isStarted || gameOverState || !piece || isPausedState) return;

    const shape = piece.rotations[piece.rotationIndex];
    const newPos = { ...pos, y: pos.y + 1 };
    if (!checkCollision(shape, newPos, currentGrid)) {
      setCurrentPos(newPos);
    } else {
      mergePiece();
    }
  };

  const moveHorizontal = (direction: number) => {
    const currentGrid = gridRef.current;
    const piece = currentPieceRef.current;
    const pos = currentPosRef.current;
    const isStarted = gameStartedRef.current;
    const isPausedState = isPausedRef.current;
    const gameOverState = gameOverRef.current;
    
    if (!isStarted || gameOverState || !piece || isPausedState) return;
    const shape = piece.rotations[piece.rotationIndex];
    const newPos = { ...pos, x: pos.x + direction };
    if (!checkCollision(shape, newPos, currentGrid)) {
      setCurrentPos(newPos);
    }
  };

  const rotate = () => {
    const currentGrid = gridRef.current;
    const piece = currentPieceRef.current;
    const pos = currentPosRef.current;
    const isStarted = gameStartedRef.current;
    const isPausedState = isPausedRef.current;
    const gameOverState = gameOverRef.current;
    
    if (!isStarted || gameOverState || !piece || isPausedState) return;
    
    const newRotationIndex = (piece.rotationIndex + 1) % piece.rotations.length;
    const rotated = piece.rotations[newRotationIndex];
    
    if (!checkCollision(rotated, pos, currentGrid)) {
      setCurrentPiece({ ...piece, rotationIndex: newRotationIndex });
    } else {
      // Try wall kicks
      const kicks = [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
      ];
      
      for (const kick of kicks) {
        const kickedPos = { x: pos.x + kick.x, y: pos.y + kick.y };
        if (!checkCollision(rotated, kickedPos, currentGrid)) {
          setCurrentPiece({ ...piece, rotationIndex: newRotationIndex });
          setCurrentPos(kickedPos);
          break;
        }
      }
    }
  };

  const hardDrop = () => {
    const currentGrid = gridRef.current;
    const piece = currentPieceRef.current;
    const pos = currentPosRef.current;
    const isStarted = gameStartedRef.current;
    const isPausedState = isPausedRef.current;
    const gameOverState = gameOverRef.current;
    const currentScore = scoreRef.current;
    
    if (!isStarted || gameOverState || !piece || isPausedState) return;
    
    let dropDistance = 0;
    let newPos = { ...pos };
    const shape = piece.rotations[piece.rotationIndex];
    
    while (!checkCollision(shape, { ...newPos, y: newPos.y + 1 }, currentGrid)) {
      newPos.y++;
      dropDistance++;
    }
    
    setCurrentPos(newPos);
    if (dropDistance > 0) {
      setScore(currentScore + dropDistance);
      setTimeout(() => mergePiece(), 10);
    }
  };

  const holdPiece = () => {
    const piece = currentPieceRef.current;
    const color = currentColorRef.current;
    const next = nextPieceRef.current;
    const nextColor = nextPieceColorRef.current;
    const held = heldPieceRef.current;
    const heldColor = heldPieceColorRef.current;
    const canHoldState = canHoldRef.current;
    const isStarted = gameStartedRef.current;
    const isPausedState = isPausedRef.current;
    const gameOverState = gameOverRef.current;
    
    if (!isStarted || gameOverState || !piece || !canHoldState || isPausedState) return;
    
    if (held === null) {
      // First hold
      setHeldPiece(piece.name);
      setHeldPieceColor(color);
      spawnPiece(next, nextColor);
      const nextNextPiece = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
      const nextNextColor = PIECE_NAMES.indexOf(nextNextPiece);
      setNextPiece(nextNextPiece);
      setNextPieceColor(nextNextColor);
    } else {
      // Swap pieces
      const tempName = held;
      const tempColor = heldColor;
      setHeldPiece(piece.name);
      setHeldPieceColor(color);
      spawnPiece(tempName, tempColor);
    }
    setCanHold(false);
  };

  const togglePause = () => {
    const isStarted = gameStartedRef.current;
    const gameOverState = gameOverRef.current;
    const isPausedState = isPausedRef.current;
    if (isStarted && !gameOverState) {
      setIsPaused(!isPausedState);
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const isStarted = gameStartedRef.current;
    if (!isStarted) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const isStarted = gameStartedRef.current;
    if (!touchStartRef.current || !isStarted) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    
    // Only process if it's a quick swipe
    if (deltaTime < 300) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > 20) {
          if (deltaX > 0) {
            moveHorizontal(1);
          } else {
            moveHorizontal(-1);
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > 20) {
          if (deltaY > 0) {
            moveDown();
          } else {
            rotate();
          }
        }
      }
    }
    touchStartRef.current = null;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const isStarted = gameStartedRef.current;
      if (!isStarted) return;

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
      } else if (e.key === 'Shift' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        holdPiece();
      } else if (e.key === 'Enter' || e.key.toLowerCase() === 'p') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted]);

  useEffect(() => {
    if (!isPaused && gameStarted && !gameOver) {
      const interval = setInterval(() => {
        moveDown();
      }, getSpeed());
    return () => clearInterval(interval);
    }
  }, [isPaused, gameStarted, gameOver]);

  const renderGrid = () => {
    const displayGrid = grid.map((row) => [...row]);

    if (currentPiece) {
      const shape = currentPiece.rotations[currentPiece.rotationIndex];
    // Add current piece to display grid
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
          const gridY = currentPos.y + y;
          const gridX = currentPos.x + x;
          if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
            displayGrid[gridY][gridX] = currentColor + 1;
            }
          }
        }
      }
    }

    return displayGrid;
  };

  const renderMiniPiece = (pieceName: string, colorIndex: number) => {
    if (!pieceName) return null;
    const tetromino = TETROMINOES[pieceName];
    const shape = tetromino.rotations[0];
    
    // Calculate offset to center the piece
    let leftOffset = COLS;
    let rightOffset = 0;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          leftOffset = Math.min(leftOffset, x);
          rightOffset = Math.max(rightOffset, x);
        }
      }
    }
    const centerOffset = Math.floor((COLS - (rightOffset - leftOffset + 1)) / 2) - leftOffset;
    
    return (
      <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, width: '64px' }}>
        {Array(4)
          .fill(0)
          .map((_, y) =>
            Array(COLS)
              .fill(0)
              .map((_, x) => {
                const adjustedX = x - centerOffset;
                const cellValue = y < shape.length && adjustedX >= 0 && adjustedX < shape[y].length ? shape[y][adjustedX] : 0;
  return (
                  <div
                    key={`${y}-${x}`}
                    className="w-[5px] h-[5px] rounded-sm"
                    style={{
                      backgroundColor: cellValue ? COLORS[colorIndex] : 'transparent',
                      border: cellValue ? `1px solid rgba(255, 255, 255, 0.3)` : 'none',
                    }}
                  />
                );
              })
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      {!gameStarted ? (
        <div className="text-center space-y-3 py-4">
          <p className="text-xl font-bold">Tetris</p>
          <Button onClick={initializeGame}>Start Game</Button>
        </div>
      ) : (
        <>
          {/* Compact stats */}
          <div className="flex items-center justify-between w-full max-w-xs px-2">
            <div className="text-xs font-bold">Score: {score.toLocaleString()}</div>
            <div className="text-xs font-bold">Level: {level}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePause}
              className="text-xs h-6 px-2"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          </div>

          {/* Game board */}
        <div className="relative">
            {isPaused && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-10">
                <p className="text-white text-xl font-bold">PAUSED</p>
              </div>
            )}
          <div
              className="grid gap-[1px] p-1 bg-muted/50 rounded-lg border border-border/50 touch-none"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                width: 'fit-content',
            }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
          >
            {renderGrid().map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                    className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-sm transition-all"
                  style={{
                      backgroundColor: cell ? COLORS[cell - 1] : '#1a1a1a',
                      border: cell ? `1px solid rgba(255, 255, 255, 0.3)` : '1px solid rgba(255, 255, 255, 0.05)',
                      boxShadow: cell ? `inset 0 0 4px rgba(255, 255, 255, 0.2)` : 'none',
                  }}
                />
              ))
            )}
          </div>

          {gameOver && (
              <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center rounded-lg z-20">
              <p className="text-white text-xl font-bold mb-2">Game Over!</p>
                <p className="text-white text-sm mb-3">Score: {score.toLocaleString()}</p>
                <Button onClick={initializeGame} size="sm">Play Again</Button>
            </div>
          )}
        </div>

          {/* Compact controls */}
          <div className="w-full max-w-xs">
            <div className="grid grid-cols-3 gap-1 mb-1">
              <Button
                variant="outline"
                size="sm"
                onClick={holdPiece}
                disabled={!canHold}
                className="text-[10px] h-8"
              >
                Hold
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={rotate}
                className="text-[10px] h-8"
              >
                <RotateCw className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveHorizontal(1)}
                className="text-[10px] h-8 px-0"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveHorizontal(-1)}
                className="text-[10px] h-8 px-0"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={hardDrop}
                className="text-[10px] h-8 px-0"
              >
                <ChevronDown className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={rotate}
                className="text-[10px] h-8 px-0"
              >
                <ChevronUp className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
