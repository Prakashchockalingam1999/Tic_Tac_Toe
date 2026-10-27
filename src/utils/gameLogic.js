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

// Cell where `player` would complete a line, or null.
function findCompletingCell(squares, player) {
  for (const line of WIN_LINES) {
    const marks = line.map((i) => squares[i]);
    if (marks.filter((m) => m === player).length === 2 && marks.includes(null)) {
      return line[marks.indexOf(null)];
    }
  }
  return null;
}

// Simple computer opponent: win if possible, else block, else centre, corner, any.
export function getComputerMove(squares, player) {
  const opponent = player === 'X' ? 'O' : 'X';
  const win = findCompletingCell(squares, player);
  if (win !== null) return win;
  const block = findCompletingCell(squares, opponent);
  if (block !== null) return block;

  const empty = (i) => squares[i] === null;
  if (empty(4)) return 4;
  const corners = [0, 2, 6, 8].filter(empty);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  const rest = squares.map((_, i) => i).filter(empty);
  return rest[Math.floor(Math.random() * rest.length)];
}
