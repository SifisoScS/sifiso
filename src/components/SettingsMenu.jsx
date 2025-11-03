import { useState, useEffect } from 'react';
import audioManager from '../utils/AudioManager';
import './SettingsMenu.css';

/**
 * SettingsMenu Component
 * Audio and game settings controls
 */
const SettingsMenu = ({ onClose }) => {
  const [audioSettings, setAudioSettings] = useState(audioManager.getSettings());

  useEffect(() => {
    setAudioSettings(audioManager.getSettings());
  }, []);

  const handleMusicVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    audioManager.setMusicVolume(volume);
    setAudioSettings(audioManager.getSettings());
  };

  const handleSfxVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    audioManager.setSfxVolume(volume);
    setAudioSettings(audioManager.getSettings());
  };

  const handleMusicMuteToggle = () => {
    audioManager.toggleMusicMute();
    setAudioSettings(audioManager.getSettings());
  };

  const handleSfxMuteToggle = () => {
    audioManager.toggleSfxMute();
    setAudioSettings(audioManager.getSettings());
  };

  const testSound = () => {
    audioManager.playSfx('notification');
  };

  return (
    <div className="settings-overlay">
      <div className="settings-menu">
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          {/* Music Settings */}
          <div className="settings-section">
            <h3>🎵 Music</h3>

            <div className="setting-item">
              <label>Volume</label>
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audioSettings.musicVolume}
                  onChange={handleMusicVolumeChange}
                  disabled={audioSettings.isMusicMuted}
                />
                <span className="volume-value">
                  {Math.round(audioSettings.musicVolume * 100)}%
                </span>
              </div>
            </div>

            <div className="setting-item">
              <label>Mute Music</label>
              <button
                className={`toggle-btn ${audioSettings.isMusicMuted ? 'active' : ''}`}
                onClick={handleMusicMuteToggle}
              >
                {audioSettings.isMusicMuted ? '🔇 Muted' : '🔊 On'}
              </button>
            </div>
          </div>

          {/* Sound Effects Settings */}
          <div className="settings-section">
            <h3>🔊 Sound Effects</h3>

            <div className="setting-item">
              <label>Volume</label>
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audioSettings.sfxVolume}
                  onChange={handleSfxVolumeChange}
                  disabled={audioSettings.isSfxMuted}
                />
                <span className="volume-value">
                  {Math.round(audioSettings.sfxVolume * 100)}%
                </span>
              </div>
            </div>

            <div className="setting-item">
              <label>Mute SFX</label>
              <button
                className={`toggle-btn ${audioSettings.isSfxMuted ? 'active' : ''}`}
                onClick={handleSfxMuteToggle}
              >
                {audioSettings.isSfxMuted ? '🔇 Muted' : '🔊 On'}
              </button>
            </div>

            <div className="setting-item">
              <button className="test-btn" onClick={testSound}>
                Test Sound
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="settings-info">
            <p>Note: Audio uses simple placeholder tones. Replace with actual audio files in production.</p>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
