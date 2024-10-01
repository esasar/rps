import { Server, Socket } from 'socket.io';
import gameService from '../services/gameService';

type Move = 'rock' | 'paper' | 'scissors';

interface Room {
  id: string;
  playerIds: string[];
  moves?: { [playerId: string]: Move };
  scores?: { [playerId: string]: number };
  round?: number;
};

const makeMove = (socket: Socket, io: Server, roomId: string, move: Move) => {
  try {
    const result = gameService.playerMove(roomId, socket.id, move);
    if (result) {
      console.log(result);
      io.to(roomId).emit('game:result', result);
      gameService.resetMoves(roomId);
    }
  } catch (error) {
    io.emit('room:error', { message: 'failed to make a move' });
  }
};

const gameController = (socket: Socket, io: Server): void => {
  socket.on('game:move', (move: Move, roomId: string) => {
    makeMove(socket, io, roomId, move);
  })
}

export default gameController;
