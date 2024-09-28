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
    return Array.from({ length }, () => {
      chars.charAt(Math.floor(Math.random() * chars.length))
    }).join('');
  };

  let id: string;
  do {
    id = idGen(4);
  } while (id in rooms);

  return id;
};

// create a room
const createRoom = (playerId: string, roomId: string = generateId()): Room => {
  if (roomId in rooms) throw new Error(`Room ${roomId} already exists`);
  
  const newRoom = { 
    id: roomId,
    playerIds: [playerId],
  };

  rooms[roomId] = newRoom;
  console.log(`Player ${playerId} created room ${roomId}`);

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
const removePlayerFromRoom = (playerId: string, roomId: string) => {
  if (!(roomId in rooms)) {
    throw new Error(`Room ${roomId} does not exist`);
  }

  const room = rooms[playerId];
  room.playerIds = room.playerIds.filter(playerId => playerId !== playerId);
  console.log(`Player ${playerId} was removed from room ${roomId}`);
}

// delete room
const deleteRoom = (roomId: string) => {
  if (roomId in rooms) {
    throw new Error(`Room ${roomId} does not exist`);
  }

  delete rooms[roomId];
  console.log(`Room ${roomId} was deleted`);
}

const roomService = {
  createRoom,
  addPlayerToRoom,
  removePlayerFromRoom,
  deleteRoom,
};

export default roomService;