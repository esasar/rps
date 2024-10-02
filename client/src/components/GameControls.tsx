import React, { useState, useEffect } from "react";
import { useAppContext } from '../hooks/useAppContext'

export const GameControls: React.FC = () => {
  const { socket, room, setResult } = useAppContext();
  const [move, setMove] = useState('');

  const makeMoveButtonHandler = (move: string) => {
    setMove(move);
    socket?.emit('game:move', move, room?.id);
  };

  const leaveRoomButtonHandler = () => {
    socket?.emit('room:leave', room?.id);
  };

  useEffect(() => {
    socket?.on('game:result', (result: any) => {
      setMove('');
      setResult(result);
    })
  }, []);

  return (
    <div className='room-controls'>
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
      <div>
        <span className='bottom'>Room ID: {room?.id}</span>
        <button className='bottom-right' onClick={leaveRoomButtonHandler}>Leave room</button>
      </div>
    </div>
  )
}