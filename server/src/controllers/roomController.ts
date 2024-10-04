import { Server, Socket } from 'socket.io';
import roomService from '../services/roomService';
import logger from '../utils/logger';
import gameController from './gameController';
import gameService from '../services/gameService';

const createRoom = (socket: Socket, io: Server): void => {
  try {
    const room = roomService.createRoom(socket.id);
    socket.join(room.id);
    socket.emit('room:created', room);
  } catch (error) {
    socket.emit('room:error', { message: 'Failed to create room' });
  }
};

const joinRoom = (socket: Socket, io: Server, roomId: string): void => {
  try {
    const room = roomService.addPlayerToRoom(socket.id, roomId);
    socket.join(room.id);
    io.to(room.id).emit('room:joined', room);
  } catch (error) {
    logger.error(error.message);
    socket.emit('room:error:join', { message: error.message })
  }
};

const leaveRoom = (socket: Socket, io: Server, roomId: string): void => {
  try {
    const room = roomService.removePlayerFromRoom(socket.id, roomId);
    socket.leave(room.id);
    socket.emit('room:left', null);
    io.to(room.id).emit('room:left', room);
  } catch (error) {
    socket.emit('room:error', { message: 'Failed to leave room' });
  }
};

const leaveAllRooms = (socket: Socket, io: Server): void => {
  roomService.getRoomIds().forEach(roomId => {
    leaveRoom(socket, io, roomId);
  });
};

const setReady = (socket: Socket, io: Server, roomId: string, ready: boolean): void => {
  const room = roomService.setReady(socket.id, roomId, ready);

  // check if all players are ready and if yes, start the game
  if (Object.values(room.ready).every(r => r)) {
    startGame(socket, io, roomId);
  }
};

const startGame = (socket: Socket, io: Server, roomId: string) => {
  const room = roomService.getRoom(roomId);
  io.to(roomId).emit('game:start', room.playerIds);

  setTimeout(() => {
    const result = gameService.determineWinner(roomId);
    io.to(roomId).emit('game:result', result);
    gameService.resetMoves(roomId);
  }, 5000);
}


const roomController = (socket: Socket, io: Server): void => {
  socket.on('room:create', () => {
    createRoom(socket, io);
  });

  socket.on('room:join', (roomId: string) => {
    joinRoom(socket, io, roomId);
  });

  socket.on('room:leave', (roomId: string) => {
    leaveRoom(socket, io, roomId);
  });

  socket.on('disconnect', () => {
    leaveAllRooms(socket, io);
  });

  socket.on('room:ready', (roomId: string, ready: boolean) => {
    setReady(socket, io, roomId, ready);
  });
};

export default roomController;