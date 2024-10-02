import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
      setPlayerId 
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};

export { AppProvider, useAppContext };
