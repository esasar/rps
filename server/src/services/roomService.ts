type Move = 'rock' | 'paper' | 'scissors';

interface Room {
  id: string;
  playerIds: string[];
  moves?: { [playerId: string]: Move };
};

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
  console.log(`Player ${playerId} created room ${id}`);

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

  room.playerIds.push(playerId);
  console.log(`Player ${playerId} has been added to room ${roomId}`);

  return room;
};

// remove player from a room
const removePlayerFromRoom = (playerId: string, roomId: string): Room => {
  if (!(roomId in rooms)) {
    throw new Error(`Room ${roomId} does not exist`);
  }

  const room = rooms[roomId];
  room.playerIds = room.playerIds.filter(id => id !== playerId);
  console.log(`Player ${playerId} was removed from room ${roomId}`);

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
  console.log(`Room ${roomId} was deleted`);
};

// get all rooms
const getRooms = () => {
  return rooms;
}

// get all room ids
const getRoomIds = () => {
  return Object.keys(rooms);
};

const roomService = {
  createRoom,
  addPlayerToRoom,
  removePlayerFromRoom,
  deleteRoom,
  getRooms,
  getRoomIds,
};

export default roomService;
