import { useEffect } from 'react';
import { useAppContext } from './useAppContext';
import { Room } from '../App.d';

export const useRoomSocket = () => {
  const { socket, setRoom, setErrorMessage, setResult, setIsGame } = useAppContext();

  useEffect(() => {
    const handleRoomJoined = (room: Room) => setRoom(room);
    const handleRoomCreated = (room: Room) => setRoom(room);
    const handleRoomLeft = (room: Room) => {
      // maybe set info box that opponent disconnected
      setResult(undefined);
      setRoom(room);
    };
    const handleRoomErrorJoin = (error: { message: string }) => {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(undefined), 1000);
    };
    const handleGameStart = () => setIsGame(true);

    socket?.on('room:joined', handleRoomJoined);
    socket?.on('room:created', handleRoomCreated);
    socket?.on('room:left', handleRoomLeft);
    socket?.on('room:error:join', handleRoomErrorJoin);
    socket?.on('game:start', handleGameStart);
  
    return () => {
      socket?.off('room:joined', handleRoomJoined);
      socket?.off('room:created', handleRoomCreated);
      socket?.off('room:left', handleRoomLeft);
      socket?.off('room:error:join', handleRoomErrorJoin);
    };
  }, [socket, setRoom, setErrorMessage]);
  
  const createRoom = () => socket?.emit('room:create');
  const joinRoom = (roomId: string) => socket?.emit('room:join', roomId);
  const leaveRoom = (roomId: string | undefined) => socket?.emit('room:leave', roomId);

  return { createRoom, joinRoom, leaveRoom };
};