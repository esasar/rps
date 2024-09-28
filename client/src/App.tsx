import { io, Socket } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';

const URL = 'http://localhost:8080';

function App() {
  const [playerId, setPlayerId] = useState<string>(''); 
  
  const socket = useRef<Socket>();

  useEffect(() => {
    socket.current = io(URL);

    socket.current.on('connect', () => {
      setPlayerId(socket.current?.id ?? '');
    })

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    }
  }, []);

  return (
    <main>
      <div>{playerId}</div>
    </main>
  )
}

export default App;
