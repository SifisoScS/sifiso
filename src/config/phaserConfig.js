import Phaser from 'phaser';

/**
 * Phaser game configuration
 * Defines the game settings, scenes, and rendering options
 */
export const phaserConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-game',
  backgroundColor: '#2d4a3e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false // Set to true for debugging collision boxes
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  pixelArt: true, // For crisp pixel art rendering
  scene: [] // Scenes will be added dynamically
};

export default phaserConfig;
