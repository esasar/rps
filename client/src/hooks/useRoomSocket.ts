import { useEffect, useState } from 'react';
import { useAppContext } from './useAppContext';
import { Room } from '../App.d';

export const useRoomSocket = () => {
  const { socket, setRoom } = useAppContext();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const handleRoomJoined = (room: Room) => setRoom(room);
    const handleRoomCreated = (room: Room) => setRoom(room);
    const handleRoomLeft = (room: Room) => setRoom(room);
    const handleRoomErrorJoin = () => {
      setError(true);
      setTimeout(() => setError(false), 500);
    };

    socket?.on('room:joined', handleRoomJoined);
    socket?.on('room:created', handleRoomCreated);
    socket?.on('room:left', handleRoomLeft);
    socket?.on('room:error:join', handleRoomErrorJoin);
  
    return () => {
      socket?.off('room:joined', handleRoomJoined);
      socket?.off('room:created', handleRoomCreated);
      socket?.off('room:left', handleRoomLeft);
      socket?.off('room:error:join', handleRoomErrorJoin);
    };
  }, [socket, setRoom]);
  
  const createRoom = () => socket?.emit('room:create');
  const joinRoom = (roomId: string) => socket?.emit('room:join', roomId);
  const leaveRoom = (roomId: string | undefined) => socket?.emit('room:leave', roomId);

  return { createRoom, joinRoom, leaveRoom, error };
};