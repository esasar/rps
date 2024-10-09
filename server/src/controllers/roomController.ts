import { Server, Socket } from 'socket.io'
import roomService from '../services/roomService'
import logger from '../utils/logger'
import { Move } from '../index.d'

const createRoom = (socket: Socket, io: Server): void => {
  try {
    const room = roomService.createRoom(socket.id)
    socket.join(room.id)
    socket.emit('room:created', room)
    logger.info(`Room ${room.id} created by player ${socket.id}`)
  } catch (error) {
    logger.error(`Failed to create room: ${error.message}`)
    socket.emit('room:error', { message: 'Failed to create room' })
  }
}

const joinRoom = (socket: Socket, io: Server, roomId: string): void => {
  try {
    const room = roomService.addPlayerToRoom(socket.id, roomId)
    socket.join(room.id)
    io.to(room.id).emit('room:joined', room)
    logger.info(`Player ${socket.id} joined room ${roomId}`)
  } catch (error) {
    socket.emit('room:error:join', { message: error.message })
    logger.error(`Player failed to join room: ${error.message}`)
  }
}

const leaveRoom = (socket: Socket, io: Server, roomId: string): void => {
  try {
    const room = roomService.removePlayerFromRoom(socket.id, roomId)
    socket.leave(room.id)
    socket.emit('room:left', null)
    io.to(room.id).emit('room:left', room)
    logger.info(`Player ${socket.id} left room ${roomId}`)
    if (room.isGameInProgress == true) {
      room.isGameInProgress = false
      io.to(room.id).emit('game:aborted')
      logger.info(`Game aborted in room ${roomId}`)
    }
  } catch (error) {
    socket.emit('room:error', { message: 'Failed to leave room' })
    logger.error(`Failed to leave room: ${error.message}`)
  }
}

const leaveAllRooms = (socket: Socket, io: Server): void => {
  const roomIds = roomService.getRoomIds()
  roomIds.forEach(roomId => {
    leaveRoom(socket, io, roomId)
  })
}

const setReady = (socket: Socket, io: Server, roomId: string, ready: boolean): void => {
  try {
    const room = roomService.setReady(socket.id, roomId, ready)

    const allPlayersReady = Object.values(room.ready).every(r => r)
    const roomIsFull = room.playerIds.length === 2

    if (allPlayersReady && roomIsFull) {
      startGame(socket, io, roomId)
    }
  } catch (error) {
    io.emit('room:error', { message: 'failed to set ready' })
    logger.error(`Failed to set ready: ${error.message}`)
  }
}

const startGame = (socket: Socket, io: Server, roomId: string) => {
  try {
    const room = roomService.getRoom(roomId)
    room.isGameInProgress = true
    io.to(roomId).emit('game:start', room.playerIds)
    logger.info(`Game started in room ${roomId}`)

    setTimeout(async () => {
      if (room.isGameInProgress == false) return
      const result = roomService.determineWinner(roomId)
      room.isGameInProgress = false
      io.to(roomId).emit('game:result', result)
      roomService.resetMoves(roomId)
      logger.info(`Game result in room ${roomId}: ${JSON.stringify(result)}`)
    }, 5000)
  } catch (error) {
    io.emit('room:error', { message: 'failed to start game' })
    logger.error(`Failed to start game: ${error.message}`)
  }
}

const makeMove = (socket: Socket, io: Server, roomId: string, move: Move) => {
  try {
    roomService.playerMove(socket.id, roomId, move)
    io.to(roomId).emit('game:move', { playerId: socket.id, move })
    logger.info(`Player ${socket.id} made a move: ${move}`)
  } catch (error) {
    io.emit('room:error', { message: 'failed to make a move' })
    logger.error(`Failed to make a move: ${error.message}`)
  }
}


const roomController = (socket: Socket, io: Server): void => {
  socket.on('room:create', () => {
    createRoom(socket, io)
  })

  socket.on('room:join', (roomId: string) => {
    joinRoom(socket, io, roomId)
  })

  socket.on('room:leave', (roomId: string) => {
    leaveRoom(socket, io, roomId)
  })

  socket.on('disconnect', () => {
    leaveAllRooms(socket, io)
  })

  socket.on('room:ready', (roomId: string, ready: boolean) => {
    setReady(socket, io, roomId, ready)
  })

  socket.on('game:move', (move: Move, roomId: string) => {
    makeMove(socket, io, roomId, move)
  })
}

export default roomController