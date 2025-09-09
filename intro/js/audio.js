// Audio system for the interactive intro

import { AudioManager } from './utils.js';

export class IntroAudio {
    constructor() {
        this.audioManager = new AudioManager();
        this.sounds = new Map();
        this.ambientSounds = new Map();
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
        // Create procedural audio for demo purposes
        // In production, these would be loaded from actual audio files
        
        try {
            // Ambient sounds
            this.ambientSounds.set('distant_fire', this.createDistantFireSound());
            this.ambientSounds.set('rumble', this.createRumbleSound());
            
            // SFX
            this.sounds.set('whoosh_portal', this.createPortalWhooshSound());
            this.sounds.set('explosion', this.createExplosionSound());
            this.sounds.set('bullet_whiz', this.createBulletWhizSound());
            
            // Set up ambient loops - sounds are already configured with proper API
            this.ambientSounds.forEach((sound, name) => {
                // Sounds are already configured with proper gain and loop settings
            });
            
        } catch (error) {
            console.warn('Failed to load audio files:', error);
        }
    }
    
    createDistantFireSound() {
        const audioContext = this.audioManager.context;
        if (!audioContext) return null;
        
        const bufferSize = audioContext.sampleRate * 2; // 2 seconds
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create low-frequency rumble with occasional crackles
        for (let i = 0; i < bufferSize; i++) {
            const time = i / audioContext.sampleRate;
            const rumble = Math.sin(time * 60) * 0.1; // Low frequency rumble
            const crackle = Math.random() < 0.01 ? Math.random() * 0.3 : 0; // Occasional crackles
            data[i] = rumble + crackle;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true; // Set loop on the source
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.3; // Set initial gain
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        return { 
            source, 
            gainNode, 
            play: () => source.start(),
            setGain: (value) => gainNode.gain.value = value,
            stop: () => {
                try { source.stop(); } catch(e) {}
            }
        };
    }
    
    createRumbleSound() {
        const audioContext = this.audioManager.context;
        if (!audioContext) return null;
        
        const bufferSize = audioContext.sampleRate * 4; // 4 seconds
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create deep rumble with variation
        for (let i = 0; i < bufferSize; i++) {
            const time = i / audioContext.sampleRate;
            const rumble = Math.sin(time * 30) * 0.05; // Very low frequency
            const variation = Math.sin(time * 0.5) * 0.02; // Slow variation
            data[i] = rumble + variation;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true; // Set loop on the source
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.3; // Set initial gain
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        return { 
            source, 
            gainNode, 
            play: () => source.start(),
            setGain: (value) => gainNode.gain.value = value,
            stop: () => {
                try { source.stop(); } catch(e) {}
            }
        };
    }
    
    createPortalWhooshSound() {
        const audioContext = this.audioManager.context;
        if (!audioContext) return null;
        
        const bufferSize = audioContext.sampleRate * 1; // 1 second
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create whoosh with frequency sweep
        for (let i = 0; i < bufferSize; i++) {
            const time = i / audioContext.sampleRate;
            const frequency = 200 + (800 * time); // Sweep from 200Hz to 1000Hz
            const whoosh = Math.sin(time * frequency * Math.PI * 2) * Math.exp(-time * 2);
            data[i] = whoosh * 0.5;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.5; // Set initial gain
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        return { 
            source, 
            gainNode, 
            play: () => source.start(),
            setGain: (value) => gainNode.gain.value = value,
            stop: () => {
                try { source.stop(); } catch(e) {}
            }
        };
    }
    
    createExplosionSound() {
        const audioContext = this.audioManager.context;
        if (!audioContext) return null;
        
        const bufferSize = audioContext.sampleRate * 0.5; // 0.5 seconds
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create explosion with noise and low frequency
        for (let i = 0; i < bufferSize; i++) {
            const time = i / audioContext.sampleRate;
            const noise = (Math.random() * 2 - 1) * 0.3;
            const boom = Math.sin(time * 100) * Math.exp(-time * 8) * 0.2;
            data[i] = noise + boom;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.8; // Set initial gain
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        return { 
            source, 
            gainNode, 
            play: () => source.start(),
            setGain: (value) => gainNode.gain.value = value,
            stop: () => {
                try { source.stop(); } catch(e) {}
            }
        };
    }
    
    createBulletWhizSound() {
        const audioContext = this.audioManager.context;
        if (!audioContext) return null;
        
        const bufferSize = audioContext.sampleRate * 0.2; // 0.2 seconds
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Create bullet whiz with frequency sweep
        for (let i = 0; i < bufferSize; i++) {
            const time = i / audioContext.sampleRate;
            const frequency = 1000 + (2000 * time); // Quick sweep
            const whiz = Math.sin(time * frequency * Math.PI * 2) * Math.exp(-time * 10);
            data[i] = whiz * 0.3;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.6; // Set initial gain
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        return { 
            source, 
            gainNode, 
            play: () => source.start(),
            setGain: (value) => gainNode.gain.value = value,
            stop: () => {
                try { source.stop(); } catch(e) {}
            }
        };
    }
    
    setupEventListeners() {
        // Listen for user interaction to enable audio
        const enableAudio = async () => {
            if (!this.isInitialized) return;
            
            try {
                // Resume audio context if suspended
                if (this.audioManager.context && this.audioManager.context.state === 'suspended') {
                    await this.audioManager.context.resume();
                }
                
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
        
        // Start distant fire sound
        const distantFire = this.ambientSounds.get('distant_fire');
        if (distantFire) {
            distantFire.setGain(0.3);
            distantFire.play();
        }
        
        // Start rumble sound
        const rumble = this.ambientSounds.get('rumble');
        if (rumble) {
            rumble.setGain(0.3);
            rumble.play();
        }
    }
    
    playSound(name, volume = 1.0) {
        if (!this.isInitialized || this.audioManager.muted) return;
        
        const sound = this.sounds.get(name);
        if (sound) {
            sound.setGain(volume * this.volume);
            sound.play();
        }
    }
    
    playAmbientSound(name, volume = 1.0) {
        if (!this.isInitialized || this.audioManager.muted) return;
        
        const sound = this.ambientSounds.get(name);
        if (sound) {
            sound.setGain(volume * this.volume);
            sound.play();
        }
    }
    
    stopAmbientSound(name) {
        const sound = this.ambientSounds.get(name);
        if (sound) {
            sound.setGain(0);
            sound.stop();
        }
    }
    
    setMuted(muted) {
        this.audioManager.setMuted(muted);
        
        // Update UI
        const muteButton = document.getElementById('intro-mute');
        if (muteButton) {
            muteButton.textContent = muted ? '🔇' : '🔊';
            muteButton.classList.toggle('muted', muted);
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Update all sounds
        this.sounds.forEach(sound => {
            if (sound.setGain) {
                sound.setGain(this.volume);
            }
        });
        
        this.ambientSounds.forEach(sound => {
            if (sound.setGain) {
                sound.setGain(this.volume * 0.3);
            }
        });
    }
    
    // Event handlers for specific game events
    onCharacterStart() {
        this.playAmbientSound('distant_fire', 0.5);
        this.playAmbientSound('rumble', 0.3);
    }
    
    onBulletFire() {
        this.playSound('bullet_whiz', 0.6);
    }
    
    onExplosion() {
        this.playSound('explosion', 0.8);
    }
    
    onPortalReached() {
        this.playSound('whoosh_portal', 1.0);
        
        // Fade out ambient sounds
        this.stopAmbientSound('distant_fire');
        this.stopAmbientSound('rumble');
    }
    
    dispose() {
        // Stop all sounds
        this.sounds.forEach(sound => {
            if (sound.stop) {
                sound.stop();
            }
        });
        
        this.ambientSounds.forEach(sound => {
            if (sound.stop) {
                sound.stop();
            }
        });
        
        // Clear maps
        this.sounds.clear();
        this.ambientSounds.clear();
        
        // Dispose audio context
        if (this.audioManager.context && this.audioManager.context.state !== 'closed') {
            this.audioManager.context.close();
        }
    }
}
