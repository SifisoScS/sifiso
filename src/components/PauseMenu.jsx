import './PauseMenu.css';

/**
 * PauseMenu Component
 * In-game pause menu with Resume/Settings/Save/Quit options
 */
const PauseMenu = ({ onResume, onSettings, onQuit }) => {
  const handleSaveGame = () => {
    // Game state is auto-saved to localStorage via Zustand persist
    alert('Game saved successfully!');
  };

  const handleQuit = () => {
    if (confirm('Are you sure you want to quit to main menu? Your progress will be saved.')) {
      onQuit();
    }
  };

  return (
    <div className="pause-overlay">
      <div className="pause-menu">
        <h1 className="pause-title">⏸️ Paused</h1>

        <div className="pause-buttons">
          <button className="pause-btn pause-btn-primary" onClick={onResume}>
            <span className="btn-icon">▶️</span>
            Resume
          </button>

          <button className="pause-btn pause-btn-secondary" onClick={handleSaveGame}>
            <span className="btn-icon">💾</span>
            Save Game
          </button>

          <button className="pause-btn pause-btn-secondary" onClick={onSettings}>
            <span className="btn-icon">⚙️</span>
            Settings
          </button>

          <button className="pause-btn pause-btn-danger" onClick={handleQuit}>
            <span className="btn-icon">🚪</span>
            Quit to Menu
          </button>
        </div>

        <div className="pause-hint">
          <small>Press ESC to resume</small>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
