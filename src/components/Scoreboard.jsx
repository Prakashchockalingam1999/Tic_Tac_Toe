// Running tally across games. Resets only when the page is reloaded.
function Scoreboard({ scores, names }) {
  return (
    <div className="scoreboard" aria-label="Scoreboard">
      <div className="score score--X"><span>{names.X}</span><strong>{scores.X}</strong></div>
      <div className="score"><span>Draws</span><strong>{scores.draws}</strong></div>
      <div className="score score--O"><span>{names.O}</span><strong>{scores.O}</strong></div>
    </div>
  );
}

export default Scoreboard;
