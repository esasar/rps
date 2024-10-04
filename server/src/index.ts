import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import roomController from './controllers/roomController';
import gameController from './controllers/gameController';
import { setupCli } from './utils/cli'
import logger from './utils/logger';

const PORT = process.env.PORT || 8080;

const cors = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: cors,
});

app.get('/', (request: Request, response: Response) => {
  response.send('Hello world!');
});

io.on('connection', (socket) => {
  logger.info(`User ${socket.id} connected`);

  roomController(socket, io);

  gameController(socket, io);

  socket.on('disconnect', () => {
    logger.info(`User ${socket.id} disconnected`);

    // we also need to remove the disconnected user from rooms they are in
  });
});

server.listen(PORT, () => {
  logger.info(`server listening on port http://localhost:${PORT}`);
});

setupCli();
