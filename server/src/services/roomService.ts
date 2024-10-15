import { Move, Room } from '../index.d'
import logger from '../utils/logger'

// move: move-it-defeats
// 'rock' beats 'scissors' etc.
const moves: { [key: string]: Move } = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
}

// in-memory storage for rooms
const rooms: { [roomId: string]: Room } = {}

// generate a unique id
const generateId = () => {
  const idGen = (length: number) => {
    const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    return Array.from({ length }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('')
  }

  let id: string
  do {
    id = idGen(4)
  } while (id in rooms)

  return id
}

// create a room
const createRoom = (playerId: string, roomId?: string): Room => {
  const id = roomId || generateId()

  if (id in rooms) throw new Error(`Room ${id} already exists`)
  
  const newRoom = { 
    id,
    playerIds: [],
    isGameInProgress: false
  }

  rooms[id] = newRoom

  return newRoom
}

const initializePlayerInRoom = (room: Room, playerId: string) => {
  if (!room.moves) room.moves = {}
  if (!room.scores) room.scores = {}
  if (!room.ready) room.ready = {}

  room.moves[playerId] = undefined
  room.scores[playerId] = 0
  room.ready[playerId] = false
}

// add player to a room
const addPlayerToRoom = (playerId: string, roomId: string): Room => {
  const room = getRoom(roomId)

  if (room.playerIds.includes(playerId)) {
    throw new Error(`Player ${playerId} is already in room ${roomId}`)
  } 

  if (room.playerIds.length >= 2) {
    throw new Error(`Room ${roomId} is full`)
  }

  room.playerIds.push(playerId)
  initializePlayerInRoom(room, playerId)

  logger.info(`Player ${playerId} has been added to room ${roomId}`)
  return room
}

// remove player from a room
const removePlayerFromRoom = (playerId: string, roomId: string): Room => {
  const room = getRoom(roomId)

  if (!room.playerIds.includes(playerId)) {
    throw new Error(`Player ${playerId} is not in room ${roomId}`)
  }
  
  room.playerIds = room.playerIds.filter(id => id !== playerId)

  delete room.moves[playerId]
  delete room.scores[playerId]
  delete room.ready[playerId]

  logger.info(`Player ${playerId} has been removed from room ${roomId}`)

  if (room.playerIds.length === 0) {
    deleteRoom(roomId)
  }

  return room
}

// delete room
const deleteRoom = (roomId: string) => {
  if (!(roomId in rooms)) {
    throw new Error(`Room ${roomId} does not exist`)
  }

  delete rooms[roomId]
  logger.info(`Room ${roomId} was deleted`)
}

// get all rooms
const getRooms = () => {
  return rooms
}

// get a room
const getRoom = (roomId: string) => {
  const room = rooms[roomId]
  if (!room) {
    throw new Error(`Room ${roomId} does not exist`)
  }
  return room
}

// get all room ids
const getRoomIds = () => {
  return Object.keys(rooms)
}

const setReady = (playerId: string, roomId: string, ready: boolean): Room => {
  const room = getRoom(roomId)
  if (!room.ready) {
    room.ready = {}
  }
  room.ready[playerId] = ready
  logger.info(`Player ${playerId} is ready: ${ready}`)
  return room
}

const resetMoves = (roomId: string) => {
  const room = getRoom(roomId)
  Object.keys(room.ready).forEach(playerId => {
    room.ready[playerId] = false
  })
}

const playerMove = (playerId: string, roomId: string, move: Move): void => {
  try {
    const room = getRoom(roomId)
    if (!room.playerIds.includes(playerId)) {
      throw new Error(`Player ${playerId} was not in room ${roomId}`)
    }
    if (!room.moves) {
      room.moves = {}
    }
    room.moves[playerId] = move
    logger.info(`Player ${playerId} made a move: ${move}`)
  } catch (error) {
    throw error
  }
}

const determineWinner = (roomId: string) => {
  const room = roomService.getRoom(roomId)

  const [player1, player2] = room.playerIds
  // if both players have not made a move, return
  if (!room.moves[player1] || !room.moves[player2]) {
    return { 
      winner: 'draw', 
      [player1]: undefined, [player2]: undefined 
    }
  }

  // if only one player has made a move, return
  if (!room.moves[player1] && room.moves[player2]) {
    return { 
      winner: player2, 
      [player1]: undefined, [player2]: room.moves[player2] 
    }
  }
  if (room.moves[player1] && !room.moves[player2]) {
    return { 
      winner: player1, 
      [player1]: room.moves[player1], [player2]: undefined 
    }
  }
  const move1 = room.moves[player1]
  const move2 = room.moves[player2]

  // tie
  if (move1 === move2) {
    return { 
      winner: 'tie', 
      [player1]: move1, [player2]: move2 
    }
  } 

  // player 1 wins
  if (moves[move1] === move2) {
    return { 
      winner: player1, 
      [player1]: move1, 
      [player2]: move2
    }
  } 

  // player 2 wins
  return { 
    winner: player2, 
    [player1]: move1, 
    [player2]: move2 
  }
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
  resetMoves,
  playerMove,
  determineWinner
}

export default roomService
