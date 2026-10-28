import { useEffect, useState } from 'react';
import Board from './components/Board';
import TurnIndicator from './components/TurnIndicator';
import Scoreboard from './components/Scoreboard';
import MoveHistory from './components/MoveHistory';
import ModeSelect from './components/ModeSelect';
import { calculateWinner, isDraw, getComputerMove } from './utils/gameLogic';

function App() {
  // The move history is the single source of truth for the current game.
  // Each entry: { player: 'X' | 'O', cell: 0-8 }
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [undoUsed, setUndoUsed] = useState(false); // one undo per game
  const [mode, setMode] = useState('two-player'); // 'two-player' | 'computer'
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  // Everything below is derived from history, so a reset only has to clear it.
  const squares = Array(9).fill(null);
  history.forEach(({ player, cell }) => { squares[cell] = player; });
  const currentPlayer = history.length % 2 === 0 ? 'X' : 'O';
  const result = calculateWinner(squares);
  const gameOver = Boolean(result) || isDraw(squares);

  // In computer mode the human is X and the computer is O.
  const vsComputer = mode === 'computer';
  const computerTurn = vsComputer && currentPlayer === 'O' && !gameOver;
  const names = { X: 'Player X', O: vsComputer ? 'Computer' : 'Player O' };

  function handleSquareClick(index) {
    if (gameOver || computerTurn) return; // frozen after the game, or while the computer thinks

    // Invalid move: cell already taken. Turn stays with the same player.
    if (squares[index]) {
      setMessage('That cell is already taken. Pick an empty one.');
      return;
    }
    playMove(index);
  }

  // Applies a valid move for the current player and updates the scoreboard.
  function playMove(index) {
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

  // Computer replies shortly after the human move. If the history changes
  // meanwhile (undo / reset), the cleanup cancels the pending move.
  useEffect(() => {
    if (!computerTurn) return;
    const timer = setTimeout(() => playMove(getComputerMove(squares, 'O')), 500);
    return () => clearTimeout(timer);
  });

  // Undo the latest move. Board, turn, win/draw status and the move list all
  // follow automatically because they are derived from history.
  function handleUndo() {
    if (history.length === 0 || undoUsed) return;
    setUndoUsed(true);

    // If that move ended the game, take back the point it earned,
    // otherwise replaying the move would count it twice.
    if (result) {
      setScores((prev) => ({ ...prev, [result.winner]: prev[result.winner] - 1 }));
    } else if (gameOver) {
      setScores((prev) => ({ ...prev, draws: prev.draws - 1 }));
    }

    // Two Player: remove only the latest move.
    // Computer: remove the computer's move and the human move before it, so it
    // is the human's turn again. If the human's own move ended the game the
    // computer never replied, so only that one move goes.
    let remaining = history.length - 1;
    if (vsComputer && remaining % 2 === 1) remaining -= 1;

    setHistory(history.slice(0, remaining));
    setMessage('');
  }

  function handleModeChange(newMode) {
    if (newMode === mode) return;
    setMode(newMode);
    setHistory([]);
    setUndoUsed(false); // a different opponent means a fresh game
    setMessage('');
  }

  // Fresh game: board, history, result and turn all reset. Scores are untouched.
  function handleReset() {
    setHistory([]);
    setUndoUsed(false);
    setMessage('');
  }

  return (
    <main className="app">
      <h1>Tic Tac Toe</h1>
      <ModeSelect mode={mode} onChange={handleModeChange} />
      <Scoreboard scores={scores} names={names} />
      {gameOver ? (
        <p className={`result ${result ? `result--${result.winner}` : ''}`} role="status">
          {result ? `${names[result.winner]} wins!` : "It's a draw!"}
        </p>
      ) : (
        <TurnIndicator currentPlayer={currentPlayer} names={names} />
      )}
      <p className="message" role="alert">{message}</p>
      <Board
        squares={squares}
        onSquareClick={handleSquareClick}
        winningLine={result?.line ?? []}
        disabled={gameOver}
      />
      <div className="actions">
        <button className="undo" onClick={handleUndo} disabled={history.length === 0 || undoUsed}>
          Undo Last Move
        </button>
        <button className="reset" onClick={handleReset}>Reset Game</button>
      </div>
      <MoveHistory history={history} names={names} />
    </main>
  );
}

export default App;
