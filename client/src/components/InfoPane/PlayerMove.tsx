import React from 'react';

import { Move } from '../../App.d'

interface PlayerMoveProps {
  move: Move;
  isGame: boolean;
}

const emojiMap: Record<Move, string> = {
  'rock': '\u270A',
  'paper': '\u270B',
  'scissors': '\u270C\uFE0F',
}

export const PlayerMove: React.FC<PlayerMoveProps> = ({ move, isGame }) => {
  return (
    <div className={isGame ? 'playermove-animated' : 'playermove'}>
      {emojiMap[move]}
    </div>
  );
};