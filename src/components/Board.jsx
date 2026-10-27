import Square from './Square';

// Renders the 3x3 grid from a flat array of 9 cells (null | 'X' | 'O').
function Board({ squares, onSquareClick, winningLine, disabled }) {
  return (
    <div className="board">
      {squares.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinning={winningLine.includes(index)}
          locked={disabled}
        />
      ))}
    </div>
  );
}

export default Board;
