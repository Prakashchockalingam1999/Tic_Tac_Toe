// Lists every valid move of the current game, in order.
function MoveHistory({ history }) {
  return (
    <section className="history">
      <h2>Move history</h2>
      {history.length === 0 ? (
        <p className="history__empty">No moves yet.</p>
      ) : (
        <ol>
          {history.map(({ player, cell }, i) => (
            <li key={i} className={`history__item history__item--${player}`}>
              Player {player} → row {Math.floor(cell / 3) + 1}, col {(cell % 3) + 1}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default MoveHistory;
