import { Server, Socket } from 'socket.io';
import roomService from '../services/roomService';

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
    socket.emit('room:joined', room);
    socket.to(room.id).emit('room:joined', room);
  } catch (error) {
    socket.emit('room:error', { message: 'Failed to join room' })
  }
};

const leaveRoom = (socket: Socket, io: Server, roomId: string): void => {
  try {
    const room = roomService.removePlayerFromRoom(socket.id, roomId);
    socket.leave(room.id);
    socket.emit('room:left', null);
    socket.to(room.id).emit('room:left', room);
  } catch (error) {
    socket.emit('room:error', { message: 'Failed to leave room' });
  }
};

const leaveAllRooms = (socket: Socket, io: Server): void => {
  roomService.getRoomIds().forEach(roomId => {
    leaveRoom(socket, io, roomId);
  });
};

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
};

export default roomController;