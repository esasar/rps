import { useAppContext } from '../../hooks/useAppContext'
import { useState, useEffect } from 'react'
import './RightPane.css'

const choices = ['rock', 'paper', 'scissors'] as const

const stringToEmoji = (str: string) => {
  if (str === 'rock') return '\u270A'
  if (str === 'paper') return '\u270B';
  if (str === 'scissors') return '\u270C\uFE0F';
  return 'N/A';
}

export const RightPane: React.FC = () => {
  const { result, setResult, room, playerId, socket, isGame, move } = useAppContext();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [opponentAnimation, setOpponentAnimation] = useState<typeof choices[number]>(choices[0])

  const GameResult: React.FC<{ playerId: string, result: Record<string, any> }> = ({ playerId, result }) => {
    return (
      <div>
        {result.winner === playerId ? 'You win! 😀' : result.winner === 'tie' ? 'It\'s a tie! 😐' : 'You lose! 😢'}
      </div>
    );
  };

  // Function to find the opponent's ID
  const getOpponentId = (id: string) => {
    return Object.keys(result).find(key => key !== id && key !== 'winner') || '';
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

  useEffect(() => {
    // Function to cycle through the choices
    const cycleChoices = () => {
      setOpponentAnimation((prevChoice) => {
        const currentIndex = choices.indexOf(prevChoice)
        const nextIndex = (currentIndex + 1) % choices.length
        return choices[nextIndex];
      })
    }

    const intervalId = setInterval(cycleChoices, 300)

    return () => clearInterval(intervalId)
  }, [setOpponentAnimation])

  return (
    <div className='pane'>
      {room ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}>
            <div className={result ? 'playerMove' : 'playerMove-animated'}>
              {(move === 'rock') ? '\u270A' : (move === 'paper') ? '\u270B' : '\u270C\uFE0F'}
            </div>
            <div className={result ? 'opponentMove' : 'opponentMove-animated'}>
              {result ? stringToEmoji(result[getOpponentId(playerId)] || '') : stringToEmoji(opponentAnimation)}
            </div>
          </div>
          <div className='game-result'>
            {result ? (
              <GameResult playerId={playerId!} result={result} />
            ) : (
              countdown ? (
                <div>Game ending in {countdown}...</div>
              ) : (
                <div>Make your move!</div>
              )
            )}
          </div>
        </>
      ) : (
        <span>Create or join a room</span>
      )}
    </div>
  )
}