import { Move, Room } from '../index.d'
import logger from '../utils/logger'

// in-memory storage for rooms
const rooms: { [roomId: string]: Room } = {};

// generate a unique id
const generateId = () => {
  const idGen = (length: number) => {
    const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    return Array.from({ length }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  };

  let id: string;
  do {
    id = idGen(4);
  } while (id in rooms);

  return id;
};

// create a room
const createRoom = (playerId: string, roomId?: string): Room => {
  const id = roomId || generateId();

  if (id in rooms) throw new Error(`Room ${id} already exists`);
  
  const newRoom = { 
    id,
    playerIds: [playerId],
  };

  rooms[id] = newRoom;
  logger.info(`Player ${playerId} created room ${id}`);

  return newRoom;
};

// add player to a room
const addPlayerToRoom = (playerId: string, roomId: string): Room => {
  if (!(roomId in rooms)) {
    throw new Error(`Room ${roomId} does not exist`);
  }
  
  const room = rooms[roomId];
  if (room.playerIds.includes(playerId)) {
    throw new Error(`Player ${playerId} is already in room ${roomId}`);
  } 

  if (room.playerIds.length === 2) {
    throw new Error(`Room ${roomId} is full`);
  }

  room.playerIds.push(playerId);
  if (room.moves) {
    room.moves[playerId] = undefined;
  } else {
    room.moves = { [playerId]: undefined };
  }
  if (room.scores) {
    room.scores[playerId] = 0;
  } else {
    room.scores = { [playerId]: 0 };
  }
  if (room.ready) {
    room.ready[playerId] = false;
  } else {
    room.ready = { [playerId]: false };
  }
  logger.info(`Player ${playerId} has been added to room ${roomId}`);

  return room;
};

// remove player from a room
const removePlayerFromRoom = (playerId: string, roomId: string): Room => {
  if (!(roomId in rooms)) {
    throw new Error(`Room ${roomId} does not exist`);
  }

  const room = rooms[roomId];
  room.playerIds = room.playerIds.filter(id => id !== playerId);
  if (room.moves) {
    delete room.moves[playerId];
  }
  if (room.scores) {
    delete room.scores[playerId];
  }
  if (room.ready) {
    delete room.ready[playerId];
  }
  logger.info(`Player ${playerId} was removed from room ${roomId}`);

  if (room.playerIds.length === 0) {
    try {
      deleteRoom(roomId);
    } catch (error) {
      throw error;
    }
  }

  return room;
};

// delete room
const deleteRoom = (roomId: string) => {
  if (!(roomId in rooms)) {
    throw new Error(`Room ${roomId} does not exist`);
  }

  delete rooms[roomId];
  logger.info(`Room ${roomId} was deleted`);
};

// get all rooms
const getRooms = () => {
  return rooms;
}

// get a room
const getRoom = (roomId: string) => {
  const room = rooms[roomId];
  if (!room) {
    throw new Error(`Room ${roomId} does not exist`);
  }
  return room;
}

// get all room ids
const getRoomIds = () => {
  return Object.keys(rooms);
};

const setReady = (playerId: string, roomId: string, ready: boolean): Room => {
  const room = getRoom(roomId);
  if (!room.ready) {
    room.ready = {};
  }
  room.ready[playerId] = ready;
  logger.info(`Player ${playerId} is ready: ${ready}`);
  return room;
}

const roomService = {
  createRoom,
  addPlayerToRoom,
  removePlayerFromRoom,
  deleteRoom,
  getRooms,
  getRoom,
  getRoomIds,
  setReady,
};

export default roomService;
