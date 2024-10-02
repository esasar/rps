import { useAppContext } from '../hooks/useAppContext'


export const Right: React.FC = () => {
  const { result, room, playerId } = useAppContext();

  return (
    <div className='section'>
      {(result) ? (
        result?.winner === 'draw' ? 'Draw!' : result?.winner === playerId ? 'You win!' : 'You lost!'
      ) : (!room) ? (
        'Join or create a room!' 
      ) : (room?.playerIds.length === 2) ? (
        'Game ends when both have chosen xd'
      ) : (
        'Waiting for opponent'
      )}
    </div>
  )
}