import React from 'react';
import { GameControls } from './GameControls';
import { RoomControls } from './RoomControls';
import { useAppContext } from '../hooks/useAppContext'

export const Left: React.FC = () => {
  const { room } = useAppContext();
  return (
    <div className='section'>
      {/* display room info and leave room button if user is in a room */}
      {room && (
        <GameControls />
      )} 

      {/* display room creation and joining options if user is not in a room */}
      {!room && (
        <RoomControls />
      )}      
    </div>
  )
}