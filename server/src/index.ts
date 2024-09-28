import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';

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
 
  // handle room events
  // roomController(socket, io);

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`server linstening on port http://localhost:${PORT}`);
});
