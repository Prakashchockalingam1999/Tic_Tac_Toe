import { useState } from 'react';
import Board from './components/Board';
import TurnIndicator from './components/TurnIndicator';
import Scoreboard from './components/Scoreboard';
import MoveHistory from './components/MoveHistory';
import { calculateWinner, isDraw } from './utils/gameLogic';

function App() {
  // The move history is the single source of truth for the current game.
  // Each entry: { player: 'X' | 'O', cell: 0-8 }
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  // Everything below is derived from history, so a reset only has to clear it.
  const squares = Array(9).fill(null);
  history.forEach(({ player, cell }) => { squares[cell] = player; });
  const currentPlayer = history.length % 2 === 0 ? 'X' : 'O';
  const result = calculateWinner(squares);
  const gameOver = Boolean(result) || isDraw(squares);

  function handleSquareClick(index) {
    if (gameOver) return; // board is frozen once the game has ended

    // Invalid move: cell already taken. Turn stays with the same player.
    if (squares[index]) {
      setMessage('That cell is already taken. Pick an empty one.');
      return;
    }

    const next = squares.slice(); // never mutate state directly
    next[index] = currentPlayer;
    setHistory([...history, { player: currentPlayer, cell: index }]);
    setMessage('');

    // Update the scoreboard exactly once, at the moment the game ends.
    const outcome = calculateWinner(next);
    if (outcome) {
      setScores((prev) => ({ ...prev, [outcome.winner]: prev[outcome.winner] + 1 }));
    } else if (isDraw(next)) {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
  }

  // Fresh game: board, history, result and turn all reset. Scores are untouched.
  function handleReset() {
    setHistory([]);
    setMessage('');
  }

  return (
    <main className="app">
      <h1>Tic Tac Toe</h1>
      <Scoreboard scores={scores} />
      {gameOver ? (
        <p className={`result ${result ? `result--${result.winner}` : ''}`} role="status">
          {result ? `Player ${result.winner} wins!` : "It's a draw!"}
        </p>
      ) : (
        <TurnIndicator currentPlayer={currentPlayer} />
      )}
      <p className="message" role="alert">{message}</p>
      <Board
        squares={squares}
        onSquareClick={handleSquareClick}
        winningLine={result?.line ?? []}
        disabled={gameOver}
      />
      <button className="reset" onClick={handleReset}>Reset Game</button>
      <MoveHistory history={history} />
    </main>
  );
}

export default App;
