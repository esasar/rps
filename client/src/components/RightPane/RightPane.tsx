import { useAppContext } from '../../hooks/useAppContext'
import './RightPane.css'

export const RightPane: React.FC = () => {
  const { result, room, playerId, socket, isGame } = useAppContext();

  const GameResult: React.FC<{ playerId: string, result: Record<string, any> }> = ({ playerId, result }) => {
    // Function to find the opponent's ID
    const getOpponentId = (id: string) => {
      return Object.keys(result).find(key => key !== id && key !== 'winner');
    };

    // Determine the opponent's ID
    const opponentId = getOpponentId(playerId);

    return (
      <div>
        Your move: {result[playerId]} Opponent move: {result[opponentId]}
      </div>
    );
  };

  const handleReadyClick = () => {
    socket?.emit('room:ready', room?.id, true);
  }

  return (
    <div className='pane'>
      {(isGame) ? (
        <>
          <div>Game is on!!!</div>
        </>
      ) : (result) ? (
        <>
          <div>{result?.winner === 'draw' ? 'Draw!' : result?.winner === playerId ? 'You win!' : 'You lost!'}</div>
          <GameResult playerId={playerId} result={result} />
          <button onClick={handleReadyClick}>Go agane</button>
        </>
      ) : (!room) ? (
        <>
          <div>Create a new room and share your room ID</div>
          <div>or enter an existing one and join! </div>
        </>
      ) : (room?.playerIds.length === 2) ? (
        <>
          <button onClick={handleReadyClick}>Ready </button>
        </>
      ) : (
        <>
          <div style={{fontSize: '20px'}}>Waiting for opponent..</div>
          <div>Tip: Share your room ID with a friend!</div>
        </>
      )}
    </div>
  )
}