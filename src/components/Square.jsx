// A single cell. Clicks on a filled cell are still reported so the app can reject them.
function Square({ value, onClick, isWinning, locked }) {
  const taken = value !== null;
  const classes = ['square', value && `square--${value}`, isWinning && 'square--winning']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      aria-disabled={taken || locked}
      aria-label={taken ? `Cell taken by ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}

export default Square;
