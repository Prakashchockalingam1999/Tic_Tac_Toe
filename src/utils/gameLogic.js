const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

// Returns { winner: 'X' | 'O', line: [a, b, c] } or null.
export function calculateWinner(squares) {
  for (const [a, b, c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export function isDraw(squares) {
  return squares.every(Boolean) && !calculateWinner(squares);
}

// Scores a position from `player`'s point of view via minimax.
// Prefers faster wins and slower losses.
function minimax(squares, turn, player, depth) {
  const result = calculateWinner(squares);
  if (result) return result.winner === player ? 10 - depth : depth - 10;
  if (squares.every(Boolean)) return 0;

  const next = turn === 'X' ? 'O' : 'X';
  const scores = [];
  squares.forEach((cell, i) => {
    if (cell) return;
    const copy = squares.slice();
    copy[i] = turn;
    scores.push(minimax(copy, next, player, depth + 1));
  });
  return turn === player ? Math.max(...scores) : Math.min(...scores);
}

// Returns the index of the best square for `player`, or null if the board is full.
export function getComputerMove(squares, player = 'O') {
  const opponent = player === 'X' ? 'O' : 'X';
  let bestScore = -Infinity;
  let bestMoves = [];

  squares.forEach((cell, i) => {
    if (cell) return;
    const copy = squares.slice();
    copy[i] = player;
    const score = minimax(copy, opponent, player, 1);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [i];
    } else if (score === bestScore) {
      bestMoves.push(i);
    }
  });

  if (bestMoves.length === 0) return null;
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}
