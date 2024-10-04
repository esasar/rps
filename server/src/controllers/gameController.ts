import { Server, Socket } from 'socket.io';
import gameService from '../services/gameService';
import { Move } from '../index.d';

const makeMove = (socket: Socket, io: Server, roomId: string, move: Move) => {
  try {
    gameService.playerMove(roomId, socket.id, move);
  } catch (error) {
    io.emit('room:error', { message: 'failed to make a move' });
  }
};

const gameController = (socket: Socket, io: Server): void => {
  socket.on('game:move', (move: Move, roomId: string) => {
    makeMove(socket, io, roomId, move);
  });
}

export default gameController;
