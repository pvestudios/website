// Audio system for the interactive intro - HTMLAudio only

import { AudioManager } from './utils.js';

export class IntroAudio {
    constructor() {
        this.audioManager = new AudioManager();
        this.isInitialized = false;
        this.volume = 0.7;
    }
    
    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.audioManager.init();
            await this.loadSounds();
            this.setupEventListeners();
            this.isInitialized = true;
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            // Don't fail the entire intro if audio fails
            this.isInitialized = true;
        }
    }
    
    async loadSounds() {
        // Load audio files using AudioManager (HTMLAudio)
        try {
            // Ambient sounds - these will loop
            await this.audioManager.loadSound('./assets/sfx/distant_fire.mp3', 'distant_fire');
            await this.audioManager.loadSound('./assets/sfx/rumble.mp3', 'rumble');
            
            // SFX - one-shots
            await this.audioManager.loadSound('./assets/sfx/whoosh_portal.mp3', 'whoosh_portal');
            await this.audioManager.loadSound('./assets/sfx/explosion.mp3', 'explosion');
            await this.audioManager.loadSound('./assets/sfx/bullet_whiz.mp3', 'bullet_whiz');
            
        } catch (error) {
            console.warn('Failed to load audio files:', error);
        }
    }
    
    // Simple HTMLAudio methods - no more WebAudio BufferSource
    
    setupEventListeners() {
        // Listen for user interaction to enable audio
        const enableAudio = async () => {
            if (!this.isInitialized) return;
            
            try {
                this.audioManager.setMuted(false);
                this.startAmbientSounds();
            } catch (error) {
                console.warn('Failed to enable audio:', error);
            }
            
            // Remove listeners after first interaction
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
        };
        
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
    }
    
    startAmbientSounds() {
        if (!this.isInitialized) return;
        
        // Start ambient sounds using AudioManager
        this.audioManager.playSound('distant_fire', 0.3, true);
        this.audioManager.playSound('rumble', 0.3, true);
    }
    
    playSound(name, volume = 1.0, loop = false) {
        if (!this.isInitialized || this.audioManager.muted) return;
        
        this.audioManager.playSound(name, volume * this.volume, loop);
    }
    
    playAmbientSound(name, volume = 1.0) {
        this.playSound(name, volume, true);
    }
    
    stopAmbientSound(name) {
        // HTMLAudio doesn't have a direct stop method, so we set volume to 0
        const sound = this.audioManager.sounds.get(name);
        if (sound) {
            sound.volume = 0;
        }
    }
    
    setMuted(muted) {
        this.audioManager.setMuted(muted);
        
        // Update UI
        const muteButton = document.getElementById('intro-mute');
        if (muteButton) {
            muteButton.textContent = muted ? '🔇' : '🔊';
            muteButton.classList.toggle('muted', muted);
            muteButton.setAttribute('aria-pressed', muted.toString());
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Update all sounds in AudioManager
        this.audioManager.sounds.forEach(sound => {
            sound.volume = this.volume;
        });
    }
    
    // Event handlers for specific game events
    onCharacterStart() {
        this.playSound('distant_fire', 0.3, true);
        this.playSound('rumble', 0.3, true);
    }
    
    onBulletFire() {
        this.playSound('bullet_whiz', 0.8, false);
    }
    
    onExplosion() {
        this.playSound('explosion', 0.8, false);
    }
    
    onPortalReached() {
        this.playSound('whoosh_portal', 0.8, false);
        
        // Fade out ambient sounds
        this.stopAmbientSound('distant_fire');
        this.stopAmbientSound('rumble');
    }
    
    dispose() {
        // Stop all sounds by setting volume to 0
        this.audioManager.sounds.forEach(sound => {
            sound.volume = 0;
            sound.pause();
        });
        
        // Clear AudioManager sounds
        this.audioManager.sounds.clear();
    }
}
