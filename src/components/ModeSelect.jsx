const MODES = [
  { id: 'two-player', label: 'Two Player' },
  { id: 'computer', label: 'vs Computer' },
];

// Switching mode starts a fresh game (handled in App).
function ModeSelect({ mode, onChange }) {
  return (
    <div className="modes" role="group" aria-label="Game mode">
      {MODES.map(({ id, label }) => (
        <button
          key={id}
          className={`mode ${mode === id ? 'mode--active' : ''}`}
          aria-pressed={mode === id}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default ModeSelect;
