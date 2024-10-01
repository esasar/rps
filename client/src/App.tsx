import { io, Socket } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import './App.css'

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
  const [result, setResult] = useState();
  const [move, setMove] = useState('');

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

    socket.current.on('game:result', (result: any) => {
      setMove('');
      setResult(result);
    })

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

  const makeMoveButtonHandler = (move: Move) => {
    if (socket.current) {
      setMove(move);
      socket.current.emit('game:move', move, room?.id);
    }
  }

  return (
    <main>
      <div className='section'>
        {/* display room info and leave room button if user is in a room */}
        {room && (
          <div>
            <div>Room ID: {room.id}</div>
            <button onClick={leaveRoomButtonHandler}>Leave room</button>
            <div>
              <button 
                className={`move ${(move ?? '') === 'rock' ? '' : ' grayscale'}`}
                onClick={() => makeMoveButtonHandler('rock')}
              >
                {'\u270A'}
              </button>
              <button 
                className={`move ${(move ?? '') === 'paper' ? '' : ' grayscale'}`}
                onClick={() => makeMoveButtonHandler('paper')}
              >
                {'\u270B'}
              </button>
              <button 
                className={`move ${(move ?? '') === 'scissors' ? '' : ' grayscale'}`}
                onClick={() => makeMoveButtonHandler('scissors')}
              >
                {'\u270C\uFE0F'}
              </button>
            </div>
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
      </div>
      
      <div className='section'>
        {(result) ? (
          result?.winner === 'draw' ? 'Draw!' : result?.winner === playerId ? 'You win!' : 'You lost!'
        ) : (!room) ? (
          'Join or create a room!' 
        ) : (room?.playerIds.length === 2) ? (
          'Game ends when both have chosen xd'
        ) : (
          'Waiting for opponent'
        )}
      </div>
      
    </main>
  )
}

export default App;
