// Shows both players and highlights whose turn it is.
function TurnIndicator({ currentPlayer }) {
  return (
    <div className="turns" aria-live="polite">
      {['X', 'O'].map((player) => (
        <div
          key={player}
          className={`player player--${player} ${currentPlayer === player ? 'player--active' : ''}`}
        >
          Player {player}
          {currentPlayer === player && <span className="player__tag">Your turn</span>}
        </div>
      ))}
    </div>
  );
}

export default TurnIndicator;
