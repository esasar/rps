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
    const room = roomService.addPlayerToRoom(roomId, socket.id);
    socket.join(room.id);
    socket.emit('room:joined', room);
    socket.to(room.id).emit('room:joined', room);
  } catch (error) {
    socket.emit('room:error', { message: 'Failed to join room' })
  }
};

// leave room

const roomController = (socket: Socket, io: Server): void => {
  socket.on('room:create', () => {
    createRoom(socket, io);
  })

  socket.on('room:join', (roomId: string) => {
    joinRoom(socket, io, roomId);
  })
};

export default roomController;