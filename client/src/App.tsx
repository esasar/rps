import { io, Socket } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';

const URL = 'http://localhost:8080';

type Move = 'rock' | 'paper' | 'scissors';

interface Room {
  id: string;
  playerIds: string[];
  moves?: { [playerId: string]: Move };
};

function App() {
  const [playerId, setPlayerId] = useState<string>(''); 
  const [room, setRoom] = useState<Room>();
  const [joinRoomIdField, setJoinRoomIdField] = useState<string>('');
  
  const socket = useRef<Socket>();

  useEffect(() => {
    socket.current = io(URL);

    socket.current.on('connect', () => {
      setPlayerId(socket.current?.id ?? '');
    });

    socket.current.on('room:created', (room: Room) => {
      setRoom(room);
    });

    socket.current.on('room:left', (room: Room) => { 
      setRoom(room);
    });

    socket.current.on('room:joined', (room: Room) => {
      setRoom(room);
    });

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    }
  }, []);

  const createRoomButtonHandler = () => {
    if (socket.current) {
      socket.current.emit('room:create');
    }
  };

  const leaveRoomButtonHandler = () => {
    if (socket.current) {
      socket.current.emit('room:leave', room?.id);
    }
  };

  const joinRoomButtonHandler = () => {
    if (socket.current) {
      socket.current.emit('room:join', joinRoomIdField);
    }
  };

  return (
    <main>
      {/* display users id */}
      <div>{playerId}</div>

      {/* display room info and leave room button if user is in a room */}
      {room && (
        <div>
          <div>Room ID: {room.id}</div>
          <div>Players: {room.playerIds.join(', ')}</div>
          <button onClick={leaveRoomButtonHandler}>Leave room</button>
        </div>
      )} 
      
      {/* display room creation and joining options if user is not in a room */}
      {!room && (
        <div>
          <button onClick={createRoomButtonHandler}>Create Room</button>
          <div>
            <input 
              value={joinRoomIdField}
              onChange={(e) => setJoinRoomIdField(e.target.value)}
              type='text'
              placeholder='room id'
            />
            <button onClick={joinRoomButtonHandler}>Join room</button>
          </div>
        </div>
      )}
    </main>
  )
}

export default App;
