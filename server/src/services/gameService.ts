import roomService from './roomService';
import { Move, Room } from '../index.d'

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
    console.log(`Player ${playerId} made move ${move}`);

    // if both players have made a move, determine outcome
    if (Object.keys(room.moves).length === 2) {
      return gameService.determineWinner(room);
    }
  } catch (error) {
    throw error;
  }
}

const determineWinner = (room: Room) => {
  const [player1, player2] = room.playerIds;
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
    room.moves = {};
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
