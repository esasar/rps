import React, { useState, useEffect } from 'react';

import { Move } from '../../App.d'

interface OpponentMoveProps {
  isGame: boolean;
  result: Record<string, Move>;
  playerId: string;
}

const emojiMap: Record<Move, string> = {
  'rock': '\u270A',
  'paper': '\u270B',
  'scissors': '\u270C\uFE0F',
}

const moves = Object.keys(emojiMap) as Move[];

export const OpponentMove: React.FC<OpponentMoveProps> = ({ isGame, result, playerId }) => {
  const [opponentAnimation, setOpponentAnimation] = useState<Move>(moves[0])

  useEffect(() => {
    const cycleChoices = () => {
      setOpponentAnimation((prevChoice) => {
        const currentIndex = moves.indexOf(prevChoice)
        const nextIndex = (currentIndex + 1) % moves.length
        return moves[nextIndex];
      })
    }

    const intervalId = setInterval(cycleChoices, 300)

    return () => clearInterval(intervalId)
  }, [setOpponentAnimation])

  const getOpponentId = (id: string | undefined) => {
    return Object.keys(result).find(key => key !== id && key !== 'winner') || '';
  };
  
  return (
    <div className={isGame ? 'opponentmove-animated' : 'opponentmove'}>
      {result ? (
        emojiMap[result[getOpponentId(playerId) as keyof typeof result]] || ''
      ) : (
        emojiMap[opponentAnimation]
      )}
    </div>
  );
};