import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Room } from '../App.d';

export const RoomControls: React.FC = () => {
  const { socket, setRoom } = useAppContext();
  const [joinRoomIdField, setJoinRoomIdField] = useState('');
  const [error, setError] = useState<boolean>(false);

  const createRoomButtonHandler = () => {
    socket?.emit('room:create');
  };

  const joinRoomButtonHandler = () => {
    socket?.emit('room:join', joinRoomIdField);
  };

  useEffect(() => {
    socket?.on('room:joined', (room: Room) => {
      setRoom(room);
    });

    socket?.on('room:created', (room: Room) => {
      setRoom(room);
    });

    socket?.on('room:left', (room: Room) => { 
      setRoom(room);
    });

    socket?.on('room:error:join', () => {
      setError(true);
      setTimeout(() => {
        setError(false)
      }, 500)
    });

    return () => {
      socket?.off('room:error:join');
    };
  }, [socket]);

  return (
    <div className='room-controls'>
      <button onClick={createRoomButtonHandler}>Create Room</button>
      <div className={`${error ? 'error' : ''}`}>
        <input
          value={joinRoomIdField}
          onChange={(e) => setJoinRoomIdField(e.target.value)}
          type='text'
          placeholder={error ? 'bad id' : 'room id'}
          className='bottom'
        />
        <button className='bottom-right' onClick={joinRoomButtonHandler}>Join room</button>
      </div>
    </div>
  )
};