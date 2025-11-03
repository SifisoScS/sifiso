import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import phaserConfig from '../config/phaserConfig';
import VillageScene from '../scenes/VillageScene';
import useGameStore from '../store/gameStore';

/**
 * PhaserGame Component
 * Manages the Phaser game instance and provides event bridge to React
 */
const PhaserGame = ({ onSceneEvent }) => {
  const gameRef = useRef(null);
  const containerRef = useRef(null);
  const [isGameReady, setIsGameReady] = useState(false);
  const gameStore = useGameStore();

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // Configure game with scenes
    const config = {
      ...phaserConfig,
      parent: containerRef.current,
      scene: [VillageScene]
    };

    // Create game instance
    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Wait for game to be ready
    game.events.once('ready', () => {
      setIsGameReady(true);

      // Get the current scene
      const scene = game.scene.getScene('VillageScene');

      // Pass game store to scene
      scene.scene.restart({ gameStore: useGameStore });

      // Listen to scene events and forward to React
      scene.events.on('sceneReady', () => {
        onSceneEvent?.({ type: 'sceneReady', scene: 'VillageScene' });
      });

      scene.events.on('startDialogue', (data) => {
        onSceneEvent?.({ type: 'startDialogue', data });
      });

      scene.events.on('nearbyInteractableChanged', (interactable) => {
        onSceneEvent?.({ type: 'nearbyInteractableChanged', interactable });
      });

      scene.events.on('buildingInteraction', (data) => {
        onSceneEvent?.({ type: 'buildingInteraction', data });
      });

      scene.events.on('showNotification', (data) => {
        gameStore.addNotification(data.message, data.type);
      });

      scene.events.on('resourceGathered', (data) => {
        onSceneEvent?.({ type: 'resourceGathered', data });
      });
    });

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="phaser-game"
      style={{
        width: '800px',
        height: '600px',
        margin: '0 auto',
        position: 'relative'
      }}
    />
  );
};

export default PhaserGame;
