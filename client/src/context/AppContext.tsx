import React, { createContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Room, Move } from '../App.d';

interface AppContextType {
  socket: Socket | undefined;
  room: Room | undefined;
  setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
  result: any;
  setResult: React.Dispatch<React.SetStateAction<any>>;
  playerId: string;
  setPlayerId: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string | undefined;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  isGame: boolean;
  setIsGame: React.Dispatch<React.SetStateAction<boolean>>;
  move: Move;
  setMove: React.Dispatch<React.SetStateAction<Move>>;
}

const URL = 'http://localhost:8080';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [result, setResult] = useState<any | undefined>(undefined);
  const [playerId, setPlayerId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [isGame, setIsGame] = useState<boolean>(false);
  const [move, setMove] = useState<Move>('rock');
  const socket = useRef<Socket | undefined>(undefined);

  useEffect(() => {
    // initialize socket on mount
    socket.current = io(URL);

    socket.current.on('connect', () => {
      setPlayerId(socket.current?.id || '');
    });

    // disconnect socket on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [URL]);

  return (
    <AppContext.Provider value={{ 
      socket: socket.current, 
      room, 
      setRoom, 
      result, 
      setResult, 
      playerId, 
      setPlayerId, 
      errorMessage,
      setErrorMessage,
      isGame,
      setIsGame,
      move,
      setMove
    }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
