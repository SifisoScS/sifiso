import { useEffect } from 'react';
import useGameStore from '../store/gameStore';
import './GameHUD.css';

/**
 * GameHUD Component
 * Displays player stats, village metrics, time, and notifications
 */
const GameHUD = ({ interactionPrompt }) => {
  const player = useGameStore((state) => state.player);
  const village = useGameStore((state) => state.village);
  const time = useGameStore((state) => state.time);
  const quests = useGameStore((state) => state.quests);
  const crisis = useGameStore((state) => state.crisis);
  const notifications = useGameStore((state) => state.ui.notifications);
  const removeNotification = useGameStore((state) => state.removeNotification);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        removeNotification(notifications[0].id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications, removeNotification]);

  // Get time of day emoji
  const getTimeEmoji = () => {
    switch (time.timeOfDay) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌆';
      case 'night': return '🌙';
      default: return '⏰';
    }
  };

  // Get active quest summary
  const activeQuest = quests.active[0];

  return (
    <div className="game-hud">
      {/* Top Bar - Player Stats */}
      <div className="hud-top">
        <div className="hud-section player-stats">
          <h3>Sifiso</h3>

          <div className="stat-bar">
            <label>Health</label>
            <div className="bar-container">
              <div
                className="bar health-bar"
                style={{ width: `${player.health}%` }}
              />
              <span className="bar-text">{Math.round(player.health)}</span>
            </div>
          </div>

          <div className="stat-bar">
            <label>Stamina</label>
            <div className="bar-container">
              <div
                className="bar stamina-bar"
                style={{ width: `${player.stamina}%` }}
              />
              <span className="bar-text">{Math.round(player.stamina)}</span>
            </div>
          </div>

          <div className="stat-row">
            <span>💡 Knowledge: {player.knowledgePoints}</span>
            <span>⭐ Influence: {Math.round(player.influence)}</span>
          </div>
        </div>

        {/* Time Display */}
        <div className="hud-section time-display">
          <div className="day-counter">Day {time.day}</div>
          <div className="time-of-day">
            {getTimeEmoji()} {time.timeOfDay}
          </div>
        </div>

        {/* Village Metrics */}
        <div className="hud-section village-stats">
          <h3>Village</h3>
          <div className="village-grid">
            <div className="village-stat">
              <span className="icon">😊</span>
              <span>{Math.round(village.happiness)}</span>
            </div>
            <div className="village-stat">
              <span className="icon">🌾</span>
              <span>{Math.round(village.foodSupply)}</span>
            </div>
            <div className="village-stat">
              <span className="icon">❤️</span>
              <span>{Math.round(village.health)}</span>
            </div>
            <div className="village-stat">
              <span className="icon">🛡️</span>
              <span>{Math.round(village.security)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Quest Tracker */}
      {activeQuest && (
        <div className="hud-quest-tracker">
          <div className="quest-title">📜 {activeQuest.title}</div>
          {activeQuest.objectives && activeQuest.objectives[0] && (
            <div className="quest-objective">
              → {activeQuest.objectives[0].description}
            </div>
          )}
        </div>
      )}

      {/* Crisis Alert */}
      {crisis.active && (
        <div className="hud-crisis-alert">
          <div className="crisis-banner">
            ⚠️ CRISIS: {crisis.active.title} ⚠️
          </div>
        </div>
      )}

      {/* Interaction Prompt */}
      {interactionPrompt && (
        <div className="interaction-prompt">
          Press [E] to interact with {interactionPrompt}
        </div>
      )}

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification notification-${notification.type}`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="notification-close"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Inventory Count */}
      <div className="hud-inventory-count">
        🎒 {player.inventory.length}/{player.maxInventorySize}
      </div>
    </div>
  );
};

export default GameHUD;
