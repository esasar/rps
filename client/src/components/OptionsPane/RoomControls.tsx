import React, { useState } from 'react';
import { useRoomSocket } from '../../hooks/useRoomSocket';
import './RoomControls.css'
import { useAppContext } from '../../hooks/useAppContext';

export const RoomControls: React.FC = () => {
  const { createRoom, joinRoom } = useRoomSocket();
  const { errorMessage } = useAppContext();
  const [joinRoomIdField, setJoinRoomIdField] = useState('');

  const createRoomButtonHandler = () => {
    createRoom();
  };

  const joinRoomButtonHandler = () => {
    joinRoom(joinRoomIdField);
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/[^a-z0-9]/gi, '');
    setJoinRoomIdField(inputValue.toUpperCase());
  }

  return (
    <div className='room-controls'>
      <button onClick={createRoomButtonHandler}>Create Room</button>
      <div className={`${errorMessage ? 'input-error' : ''}`}>
        <input
          value={joinRoomIdField}
          onChange={inputChangeHandler}
          type='text'
          placeholder='room id'
          maxLength={4}
        />
        <button className='join-room-button' onClick={joinRoomButtonHandler}>Join room</button>
      </div>
    </div>
  )
};