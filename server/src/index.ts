import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import roomController from './controllers/roomController';
import { setupCli } from './utils/cli'

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
  console.log(`User ${socket.id} connected`);

  roomController(socket, io);

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);

    // we also need to remove the disconnected user from rooms they are in
  });
});

server.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});

setupCli();
