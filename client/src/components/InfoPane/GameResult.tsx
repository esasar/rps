export const GameResult = ({ result, playerId, isGame, countdown}) => {
  return (
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
  )
}