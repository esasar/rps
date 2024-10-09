import React, { createContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Room } from '../App.d';

interface AppContextType {
  socket: Socket | undefined;
  room: Room | undefined;
  setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
  result: any;
  setResult: React.Dispatch<React.SetStateAction<any>>;
  playerId: string | undefined;
  setPlayerId: React.Dispatch<React.SetStateAction<string | undefined>>;
  errorMessage: string | undefined;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  isGame: boolean | undefined;
  setIsGame: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  move: string;
  setMove: React.Dispatch<React.SetStateAction<string>>;
}

const URL = 'http://localhost:8080';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [result, setResult] = useState<any | undefined>(undefined);
  const [playerId, setPlayerId] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [isGame, setIsGame] = useState<boolean | undefined>(undefined);
  const [move, setMove] = useState('');
  const socket = useRef<Socket | undefined>(undefined);

  useEffect(() => {
    // initialize socket on mount
    socket.current = io(URL);

    socket.current.on('connect', () => {
      setPlayerId(socket.current?.id);
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
