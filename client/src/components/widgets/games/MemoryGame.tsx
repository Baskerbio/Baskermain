import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface MemoryGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  highScoreEnabled?: boolean;
}

type Card = {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
};

const EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻', '🎬', '🎤', '🎧', '🎹'];

export function MemoryGame({ difficulty = 'medium', highScoreEnabled = true }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const getPairCount = () => {
    switch (difficulty) {
      case 'easy':
        return 6;
      case 'hard':
        return 12;
      default:
        return 8;
    }
  };

  useEffect(() => {
    if (highScoreEnabled) {
      const stored = localStorage.getItem('memory_bestscore');
      if (stored) setBestScore(parseInt(stored));
    }
  }, [highScoreEnabled]);

  const initializeGame = () => {
    const pairCount = getPairCount();
    const selectedEmojis = EMOJIS.slice(0, pairCount);
    const gameCards: Card[] = [];

    selectedEmojis.forEach((emoji, index) => {
      gameCards.push(
        { id: index * 2, value: emoji, flipped: false, matched: false },
        { id: index * 2 + 1, value: emoji, flipped: false, matched: false }
      );
    });

    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameStarted(true);
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) return;
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards.find((c) => c.id === cardId)?.matched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, flipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);

      const card1 = cards.find((c) => c.id === newFlippedCards[0]);
      const card2 = cards.find((c) => c.id === newFlippedCards[1]);

      if (card1 && card2 && card1.value === card2.value) {
        // Match found
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              newFlippedCards.includes(card.id)
                ? { ...card, matched: true }
                : card
            )
          );
          setFlippedCards([]);
          setMatches(matches + 1);

          // Check if game is won
          if (matches + 1 === getPairCount()) {
            if (highScoreEnabled && (bestScore === null || moves + 1 < bestScore)) {
              setBestScore(moves + 1);
              localStorage.setItem('memory_bestscore', (moves + 1).toString());
            }
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              newFlippedCards.includes(card.id)
                ? { ...card, flipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const gridCols = getPairCount() <= 6 ? 3 : 4;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-between w-full max-w-sm">
        <div className="text-sm">
          <span className="text-muted-foreground">Moves: </span>
          <span className="font-bold">{moves}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Matches: </span>
          <span className="font-bold">
            {matches}/{getPairCount()}
          </span>
        </div>
        {highScoreEnabled && bestScore !== null && (
          <div className="text-sm">
            <span className="text-muted-foreground">Best: </span>
            <span className="font-bold">{bestScore}</span>
          </div>
        )}
      </div>

      {!gameStarted ? (
        <div className="text-center space-y-4 py-8">
          <p className="text-lg font-semibold">Memory Match</p>
          <p className="text-sm text-muted-foreground">
            Find all matching pairs!
          </p>
          <Button onClick={initializeGame}>Start Game</Button>
        </div>
      ) : (
        <div
          className="grid gap-2 max-w-sm"
          style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
        >
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.flipped || card.matched}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 flex items-center justify-center text-3xl transition-all ${
                card.flipped || card.matched
                  ? 'bg-primary/10 border-primary'
                  : 'bg-muted border-border hover:bg-muted/70'
              } ${card.matched ? 'opacity-50' : ''}`}
            >
              {(card.flipped || card.matched) ? card.value : '?'}
            </button>
          ))}
        </div>
      )}

      {matches === getPairCount() && gameStarted && (
        <div className="text-center space-y-2 p-4 bg-primary/10 rounded-lg">
          <p className="text-lg font-bold text-primary">You Won!</p>
          <p className="text-sm text-muted-foreground">
            Completed in {moves} moves
          </p>
          <Button onClick={initializeGame} size="sm">
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}

