import { useState, useEffect } from 'react';
import PhaserGame from './components/PhaserGame';
import GameHUD from './components/GameHUD';
import DialogueBox from './components/DialogueBox';
import InventoryPanel from './components/InventoryPanel';
import MainMenu from './components/MainMenu';
import PauseMenu from './components/PauseMenu';
import SettingsMenu from './components/SettingsMenu';
import useGameStore from './store/gameStore';
import audioManager from './utils/AudioManager';
import villagersData from './data/villagers.json';
import './App.css';

/**
 * Main App Component
 * Orchestrates the game UI and Phaser integration
 */
function App() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused
  const [showDialogue, setShowDialogue] = useState(false);
  const [currentVillager, setCurrentVillager] = useState(null);
  const [interactionPrompt, setInteractionPrompt] = useState(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const setVillagers = useGameStore((state) => state.setVillagers);
  const activePanel = useGameStore((state) => state.ui.activePanel);
  const setActivePanel = useGameStore((state) => state.setActivePanel);

  // Initialize game data on mount
  useEffect(() => {
    // Load villagers into store
    setVillagers(villagersData);
  }, [setVillagers]);

  // Start playing background music when game starts
  useEffect(() => {
    if (gameState === 'playing') {
      audioManager.playMusic('village');
    } else if (gameState === 'menu') {
      audioManager.stopMusic();
    }
  }, [gameState]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle game controls when playing
      if (gameState !== 'playing') return;

      // Toggle inventory with I key
      if (e.key === 'i' || e.key === 'I') {
        if (!showDialogue && gameState === 'playing') {
          audioManager.playSfx('click');
          setShowInventory(!showInventory);
          setActivePanel(showInventory ? null : 'inventory');
        }
      }

      // Pause/Resume with Escape
      if (e.key === 'Escape') {
        audioManager.playSfx('click');

        // Close open menus first
        if (showDialogue) {
          setShowDialogue(false);
        } else if (showInventory) {
          setShowInventory(false);
          setActivePanel(null);
        } else if (showSettings) {
          setShowSettings(false);
        } else {
          // Toggle pause
          setGameState(gameState === 'playing' ? 'paused' : 'playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, showInventory, showDialogue, showSettings, setActivePanel]);

  // Handle Phaser scene events
  const handleSceneEvent = (event) => {
    switch (event.type) {
      case 'startDialogue':
        audioManager.playSfx('interact');
        setCurrentVillager(event.data);
        setShowDialogue(true);
        break;

      case 'nearbyInteractableChanged':
        if (event.interactable) {
          const type = event.interactable.getData?.('type');
          if (type === 'villager') {
            setInteractionPrompt(event.interactable.villagerName);
          } else if (type === 'resource') {
            setInteractionPrompt(event.interactable.resourceName);
          } else if (event.interactable.label) {
            setInteractionPrompt(event.interactable.label);
          }
        } else {
          setInteractionPrompt(null);
        }
        break;

      case 'buildingInteraction':
        audioManager.playSfx('interact');
        console.log('Building interaction:', event.data);
        break;

      case 'resourceGathered':
        audioManager.playSfx('gather');
        break;

      default:
        break;
    }
  };

  // Menu handlers
  const handleStartGame = () => {
    audioManager.playSfx('click');
    setGameState('playing');
  };

  const handleContinueGame = () => {
    audioManager.playSfx('click');
    setGameState('playing');
  };

  const handleResumeGame = () => {
    audioManager.playSfx('click');
    setGameState('playing');
  };

  const handleQuitToMenu = () => {
    audioManager.playSfx('click');
    setGameState('menu');
    setShowDialogue(false);
    setShowInventory(false);
    setShowSettings(false);
  };

  const handleOpenSettings = () => {
    audioManager.playSfx('click');
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    audioManager.playSfx('click');
    setShowSettings(false);
  };

  return (
    <div className="app">
      {/* Main Menu */}
      {gameState === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          onContinueGame={handleContinueGame}
        />
      )}

      {/* Game Screen */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          {/* Game Title */}
          <div className="game-title">
            <h1>Sifiso: The Heart of the Island</h1>
          </div>

          {/* Game Container */}
          <div className="game-container">
            {/* Phaser Game Canvas */}
            <PhaserGame onSceneEvent={handleSceneEvent} />

            {/* React UI Overlays */}
            <div className="ui-overlay">
              <GameHUD interactionPrompt={interactionPrompt} />

              {/* Dialogue Box */}
              {showDialogue && currentVillager && (
                <DialogueBox
                  villagerData={currentVillager}
                  onClose={() => {
                    audioManager.playSfx('click');
                    setShowDialogue(false);
                  }}
                />
              )}

              {/* Inventory Panel */}
              {showInventory && (
                <InventoryPanel onClose={() => {
                  audioManager.playSfx('click');
                  setShowInventory(false);
                  setActivePanel(null);
                }} />
              )}

              {/* Pause Menu */}
              {gameState === 'paused' && (
                <PauseMenu
                  onResume={handleResumeGame}
                  onSettings={handleOpenSettings}
                  onQuit={handleQuitToMenu}
                />
              )}

              {/* Settings Menu */}
              {showSettings && (
                <SettingsMenu onClose={handleCloseSettings} />
              )}
            </div>
          </div>

          {/* Controls Guide */}
          <div className="controls-guide">
            <h3>Controls</h3>
            <div className="controls-grid">
              <div className="control-item">
                <kbd>WASD</kbd> or <kbd>Arrow Keys</kbd> - Move
              </div>
              <div className="control-item">
                <kbd>E</kbd> - Interact
              </div>
              <div className="control-item">
                <kbd>I</kbd> - Inventory
              </div>
              <div className="control-item">
                <kbd>Esc</kbd> - Pause/Close
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
