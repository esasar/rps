import { useAppContext } from '../../hooks/useAppContext'
import { useState, useEffect } from 'react'
import './InfoPane.css'
import { RoomInfo } from './RoomInfo'
import { PlayerMove } from './PlayerMove'
import { OpponentMove } from './OpponentMove'



export const InfoPane: React.FC = () => {
  const { result, setResult, room, playerId, isGame, move } = useAppContext();
  const [countdown, setCountdown] = useState<number | null>(null);

  const GameResult: React.FC<{ playerId: string, result: Record<string, any> }> = ({ playerId, result }) => {
    return (
      <div>
        {result.winner === playerId ? 'You win! 😀' : result.winner === 'tie' ? 'It\'s a tie! 😐' : 'You lose! 😢'}
      </div>
    );
  };

  useEffect(() => {
    if (isGame) {
      setResult('');
      setCountdown(5);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            clearInterval(interval);
            return null;
          }
          return prev! - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isGame]);


  return (
    <div className='pane'>
      {room ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}>
            <PlayerMove move={move} isGame={isGame}/> 
            <OpponentMove isGame={isGame} result={result} playerId={playerId} />
          </div>
          <div className='game-result'>
            {result ? (
              <GameResult playerId={playerId!} result={result} />
            ) : (
              isGame ? (
                <div>Game ending in {countdown}...</div>
              ) : (
                <div>Make your move!</div>
              )
            )}
          </div>
        </>
      ) : (
        <RoomInfo />
      )}
    </div>
  )
}