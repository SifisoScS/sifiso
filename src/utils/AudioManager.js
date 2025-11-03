/**
 * AudioManager - Centralized audio management using Web Audio API
 * Handles background music and sound effects
 */
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.musicGainNode = null;
    this.sfxGainNode = null;
    this.currentMusicSource = null;
    this.currentMusicOscillator = null;
    this.musicVolume = 0.1; // Much quieter default
    this.sfxVolume = 0.5;
    this.isMusicMuted = true; // Start with music muted by default
    this.isSfxMuted = false;

    // Load audio settings from localStorage
    this.loadSettings();

    // Initialize Web Audio API
    this.initializeAudio();
  }

  /**
   * Initialize Web Audio API
   */
  initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Create gain nodes for volume control
      this.musicGainNode = this.audioContext.createGain();
      this.musicGainNode.connect(this.audioContext.destination);
      this.musicGainNode.gain.value = this.isMusicMuted ? 0 : this.musicVolume;

      this.sfxGainNode = this.audioContext.createGain();
      this.sfxGainNode.connect(this.audioContext.destination);
      this.sfxGainNode.gain.value = this.isSfxMuted ? 0 : this.sfxVolume;

      console.log('✅ Audio Manager initialized');
    } catch (e) {
      console.warn('❌ Web Audio API not supported', e);
    }
  }

  /**
   * Resume audio context (required for user interaction)
   */
  async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
      console.log('🔊 Audio context resumed');
    }
  }

  /**
   * Play background music
   */
  async playMusic(key) {
    if (!this.audioContext) return;

    await this.resumeAudioContext();

    // Stop current music
    this.stopMusic();

    // Music frequencies for different scenes
    const musicFrequencies = {
      village: [261.63, 329.63, 392.00], // C Major chord
      exploration: [293.66, 369.99, 440.00], // D Major chord
      crisis: [246.94, 311.13, 369.99] // B Minor chord
    };

    const frequencies = musicFrequencies[key] || musicFrequencies.village;

    // Create oscillators for a simple chord
    this.currentMusicOscillator = frequencies.map((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      gainNode.gain.value = 0.05; // Very soft volume for each note

      oscillator.connect(gainNode);
      gainNode.connect(this.musicGainNode);

      oscillator.start();

      return { oscillator, gainNode };
    });

    console.log(`🎵 Playing ${key} music (${this.isMusicMuted ? 'muted' : 'playing'})`);
  }

  /**
   * Stop current music
   */
  stopMusic() {
    if (this.currentMusicOscillator) {
      this.currentMusicOscillator.forEach(({ oscillator }) => {
        try {
          oscillator.stop();
        } catch (e) {
          // Already stopped
        }
      });
      this.currentMusicOscillator = null;
    }
  }

  /**
   * Play a sound effect
   */
  async playSfx(key) {
    if (!this.audioContext) return;

    await this.resumeAudioContext();

    // Sound effect parameters
    const sfxParams = {
      click: { frequency: 800, duration: 0.08, type: 'square' },
      interact: { frequency: 600, duration: 0.15, type: 'sine' },
      gather: { frequency: 700, duration: 0.2, type: 'triangle' },
      notification: { frequency: 900, duration: 0.15, type: 'sine' },
      questComplete: { frequency: 1000, duration: 0.3, type: 'sine' },
      footstep: { frequency: 200, duration: 0.05, type: 'square' }
    };

    const params = sfxParams[key];
    if (!params) return;

    // Create oscillator for sound effect
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = params.type;
    oscillator.frequency.value = params.frequency;

    // Attack-Decay envelope
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + params.duration); // Decay

    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGainNode);

    oscillator.start(now);
    oscillator.stop(now + params.duration);

    console.log(`🔊 Playing ${key} sound`);
  }

  /**
   * Set music volume
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.isMusicMuted ? 0 : this.musicVolume;
    }
    this.saveSettings();
    console.log(`🎵 Music volume: ${Math.round(this.musicVolume * 100)}%`);
  }

  /**
   * Set SFX volume
   */
  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = this.isSfxMuted ? 0 : this.sfxVolume;
    }
    this.saveSettings();
    console.log(`🔊 SFX volume: ${Math.round(this.sfxVolume * 100)}%`);
  }

  /**
   * Toggle music mute
   */
  toggleMusicMute() {
    this.isMusicMuted = !this.isMusicMuted;
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.isMusicMuted ? 0 : this.musicVolume;
    }
    this.saveSettings();
    console.log(`🎵 Music ${this.isMusicMuted ? 'muted' : 'unmuted'}`);
    return this.isMusicMuted;
  }

  /**
   * Toggle SFX mute
   */
  toggleSfxMute() {
    this.isSfxMuted = !this.isSfxMuted;
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = this.isSfxMuted ? 0 : this.sfxVolume;
    }
    this.saveSettings();
    console.log(`🔊 SFX ${this.isSfxMuted ? 'muted' : 'unmuted'}`);
    return this.isSfxMuted;
  }

  /**
   * Save audio settings to localStorage
   */
  saveSettings() {
    const settings = {
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      isMusicMuted: this.isMusicMuted,
      isSfxMuted: this.isSfxMuted
    };
    localStorage.setItem('sifiso-audio-settings', JSON.stringify(settings));
  }

  /**
   * Load audio settings from localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('sifiso-audio-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.musicVolume = settings.musicVolume ?? 0.1;
        this.sfxVolume = settings.sfxVolume ?? 0.5;
        this.isMusicMuted = settings.isMusicMuted ?? true; // Default muted
        this.isSfxMuted = settings.isSfxMuted ?? false;
        console.log('🔧 Loaded audio settings from storage');
      }
    } catch (e) {
      console.warn('Could not load audio settings', e);
    }
  }

  /**
   * Get current settings
   */
  getSettings() {
    return {
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      isMusicMuted: this.isMusicMuted,
      isSfxMuted: this.isSfxMuted
    };
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;
