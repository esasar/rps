import { useAppContext } from '../../hooks/useAppContext'
import './RightPane.css'

export const RightPane: React.FC = () => {
  const { result, room, playerId } = useAppContext();

  return (
    <div className='pane'>
      {(result) ? (
        <>
          <div>{result?.winner === 'draw' ? 'Draw!' : result?.winner === playerId ? 'You win!' : 'You lost!'}</div>
          <div>Choose a new move!</div>
        </>
      ) : (!room) ? (
        <>
          <div>Create a new room and share your room ID</div>
          <div>or enter an existing one and join! </div>
        </>
      ) : (room?.playerIds.length === 2) ? (
        <>
          <div>Opponent connected!</div>
          <div>Game ends when both have chosen a move.</div>
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