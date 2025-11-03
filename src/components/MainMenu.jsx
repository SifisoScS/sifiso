import { useState } from 'react';
import useGameStore from '../store/gameStore';
import './MainMenu.css';

/**
 * MainMenu Component
 * Title screen with Start/Continue/Quit options
 */
const MainMenu = ({ onStartGame, onContinueGame }) => {
  const [showAbout, setShowAbout] = useState(false);
  const resetGame = useGameStore((state) => state.resetGame);

  // Check if there's a saved game
  const hasSavedGame = () => {
    try {
      const saved = localStorage.getItem('sifiso-game-storage');
      return saved !== null;
    } catch {
      return false;
    }
  };

  const handleNewGame = () => {
    if (hasSavedGame()) {
      if (confirm('Starting a new game will erase your current progress. Continue?')) {
        resetGame();
        onStartGame();
      }
    } else {
      resetGame();
      onStartGame();
    }
  };

  const handleContinue = () => {
    if (hasSavedGame()) {
      onContinueGame();
    }
  };

  const handleQuit = () => {
    if (confirm('Are you sure you want to quit?')) {
      window.close();
    }
  };

  return (
    <div className="main-menu">
      <div className="menu-background">
        <div className="animated-bg"></div>
      </div>

      <div className="menu-content">
        {/* Title */}
        <div className="game-title-screen">
          <h1 className="title-main">Sifiso</h1>
          <p className="title-subtitle">The Heart of the Island</p>
          <div className="title-decoration">🌴 ⭐ 🌊</div>
        </div>

        {/* Menu Buttons */}
        {!showAbout ? (
          <div className="menu-buttons">
            <button className="menu-btn menu-btn-primary" onClick={handleNewGame}>
              <span className="btn-icon">🎮</span>
              New Game
            </button>

            {hasSavedGame() && (
              <button className="menu-btn menu-btn-continue" onClick={handleContinue}>
                <span className="btn-icon">💾</span>
                Continue
              </button>
            )}

            <button className="menu-btn menu-btn-secondary" onClick={() => setShowAbout(true)}>
              <span className="btn-icon">📖</span>
              About
            </button>

            <button className="menu-btn menu-btn-danger" onClick={handleQuit}>
              <span className="btn-icon">🚪</span>
              Quit
            </button>
          </div>
        ) : (
          <div className="about-section">
            <h2>About the Game</h2>
            <p>
              <strong>Sifiso: The Heart of the Island</strong> is a 2D adventure-strategy game where you protect
              an island community through wisdom, courage, and compassion.
            </p>
            <div className="about-features">
              <div className="feature">✨ Build relationships with villagers</div>
              <div className="feature">🌾 Gather resources and craft items</div>
              <div className="feature">📜 Complete quests and missions</div>
              <div className="feature">⚠️ Respond to crises and challenges</div>
              <div className="feature">🏝️ Explore the island wilderness</div>
            </div>
            <h3>Controls</h3>
            <div className="controls-list">
              <div><kbd>WASD</kbd> / <kbd>Arrows</kbd> - Move</div>
              <div><kbd>E</kbd> - Interact</div>
              <div><kbd>I</kbd> - Inventory</div>
              <div><kbd>Esc</kbd> - Pause/Close</div>
            </div>
            <button className="menu-btn menu-btn-secondary" onClick={() => setShowAbout(false)}>
              Back
            </button>
          </div>
        )}

        {/* Credits */}
        <div className="menu-credits">
          <p>Built with React + Phaser 3</p>
          <p className="version">v0.1.0</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
