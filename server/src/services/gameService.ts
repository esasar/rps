import roomService from './roomService';
import { Move, Room } from '../index.d'
import logger from '../utils/logger';

// move: move-it-defeats
// 'rock' beats 'scissors' etc.
const moves: { [key: string]: Move } = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

const playerMove = (roomId: string, playerId: string, move: Move) => {
  try {
    // change player move
    const room = roomService.getRoom(roomId);
    if (!room.playerIds.some(p => p === playerId)) {
      throw new Error(`Player ${playerId} was not in room ${roomId}`);
    }
    if (!room.moves) room.moves = {};
    room.moves[playerId] = move;
    logger.info(`Player ${playerId} made move ${move}`);

  } catch (error) {
    throw error;
  }
}

const determineWinner = (roomId: string) => {
  const room = roomService.getRoom(roomId);

  const [player1, player2] = room.playerIds;
  // if both players have not made a move, return
  if (!room.moves[player1] || !room.moves[player2]) {
    return { 
      winner: 'draw', 
      [player1]: undefined, [player2]: undefined 
    };
  }

  // if only one player has made a move, return
  if (!room.moves[player1] && room.moves[player2]) {
    return { 
      winner: player2, 
      [player1]: undefined, [player2]: room.moves[player2] 
    };
  }
  if (room.moves[player1] && !room.moves[player2]) {
    return { 
      winner: player1, 
      [player1]: room.moves[player1], [player2]: undefined 
    };
  }
  const move1 = room.moves[player1];
  const move2 = room.moves[player2];

  // draw
  if (move1 === move2) {
    return { 
      winner: 'draw', 
      [player1]: move1, [player2]: move2 
    };
  } 

  // player 1 wins
  if (moves[move1] === move2) {
    return { 
      winner: player1, 
      [player1]: move1, 
      [player2]: move2
    };
  } 

  // player 2 wins
  return { 
    winner: player2, 
    [player1]: move1, 
    [player2]: move2 
  };
}

const resetMoves = (roomId: string) => {
  try {
    const room = roomService.getRoom(roomId);
    Object.keys(room.ready).forEach(playerId => {
      room.ready[playerId] = false;
    });
  } catch (error) {
    throw error;
  }
}

const gameService = {
  playerMove,
  determineWinner,
  resetMoves,
};

export default gameService;
