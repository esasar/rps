import React, { useState, useEffect } from "react";
import { useAppContext } from '../../hooks/useAppContext';
import './GameControls.css';
import { useRoomSocket } from "../../hooks/useRoomSocket";

export const GameControls: React.FC = () => {
  const { socket, room, setRoom, setResult, setIsGame } = useAppContext();
  const { leaveRoom } = useRoomSocket();
  const [move, setMove] = useState('');

  const makeMoveButtonHandler = (move: string) => {
    setMove(move);
    socket?.emit('game:move', move, room?.id);
  };

  const leaveRoomButtonHandler = () => {
    setRoom(undefined);
    setResult(undefined);
    leaveRoom(room?.id);
  };

  useEffect(() => {
    socket?.on('game:result', (result: any) => {
      setMove('');
      setResult(result);
      setIsGame(false);
    })
  }, []);

  return (
    <div className='game-controls'>
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
      <div className='leave-room'>
        <div className='room-id'>Room ID: {room?.id}</div>
        <button className='leave-room-button' onClick={leaveRoomButtonHandler}>Leave room</button>
      </div>
    </div>
  )
}