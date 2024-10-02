import React, { useState } from 'react';
import { useRoomSocket } from '../hooks/useRoomSocket';

export const RoomControls: React.FC = () => {
  const { createRoom, joinRoom, error } = useRoomSocket();
  const [joinRoomIdField, setJoinRoomIdField] = useState('');

  const createRoomButtonHandler = () => {
    createRoom();
  };

  const joinRoomButtonHandler = () => {
    joinRoom(joinRoomIdField);
  };

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