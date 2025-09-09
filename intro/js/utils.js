// Utility functions for the interactive intro
import * as THREE from './three.module.min.js';

/**
 * Device capability detection and performance optimization
 */
export class DeviceCapabilities {
    static getDeviceTier() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return 'none';
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
        
        // Basic mobile detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;
        
        if (isMobile || isLowEnd) {
            return 'mobile';
        }
        
        return 'desktop';
    }
    
    static getParticleLimits() {
        const tier = this.getDeviceTier();
        
        switch (tier) {
            case 'mobile':
                return {
                    smoke: 50,
                    fire: 30,
                    bullets: 20,
                    explosions: 5
                };
            case 'desktop':
                return {
                    smoke: 100,
                    fire: 60,
                    bullets: 40,
                    explosions: 10
                };
            default:
                return {
                    smoke: 0,
                    fire: 0,
                    bullets: 0,
                    explosions: 0
                };
        }
    }
    
    static shouldEnableBloom() {
        return this.getDeviceTier() === 'desktop';
    }
    
    static getMaxTextureSize() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return 512;
        
        return Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), 2048);
    }
}

/**
 * Asset loading utilities
 */
export class AssetLoader {
    static async loadTexture(url, options = {}) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            const texture = loader.load(
                url,
                (texture) => {
                    if (options.flipY !== false) texture.flipY = false;
                    if (options.wrapS) texture.wrapS = options.wrapS;
                    if (options.wrapT) texture.wrapT = options.wrapT;
                    resolve(texture);
                },
                undefined,
                reject
            );
        });
    }
    
    static async loadAudio(url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.crossOrigin = 'anonymous';
            
            audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
            audio.addEventListener('error', reject, { once: true });
            
            audio.src = url;
        });
    }
    
    static async loadGLTF(url, dracoLoader = null) {
        return new Promise((resolve, reject) => {
            // Import GLTFLoader dynamically to avoid module issues
            import('./js/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
                const loader = new GLTFLoader();
                
                if (dracoLoader) {
                    loader.setDRACOLoader(dracoLoader);
                }
                
                loader.load(url, resolve, undefined, reject);
            }).catch(reject);
        });
    }
}

/**
 * Math utilities
 */
export class MathUtils {
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }
    
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    static smoothstep(edge0, edge1, x) {
        const t = this.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
        return t * t * (3.0 - 2.0 * t);
    }
    
    static randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    static degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    
    static radToDeg(radians) {
        return radians * 180 / Math.PI;
    }
}

/**
 * Catmull-Rom spline utilities
 */
export class SplineUtils {
    static createCatmullRomSpline(points, closed = false) {
        const curve = new THREE.CatmullRomCurve3(points, closed);
        return curve;
    }
    
    static generateTrenchPath(length = 100, segments = 20) {
        const points = [];
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = Math.sin(t * Math.PI * 2) * 2; // Slight curve
            const y = 0; // Ground level
            const z = -t * length; // Forward movement
            
            // Add some noise for natural trench path
            const noise = Math.sin(t * Math.PI * 8) * 0.5;
            points.push(new THREE.Vector3(x + noise, y, z));
        }
        
        return this.createCatmullRomSpline(points);
    }
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.frameTime = 16.67;
    }
    
    update() {
        this.frameCount++;
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        
        if (this.frameCount % 60 === 0) {
            this.fps = Math.round(1000 / (deltaTime / 60));
            this.frameTime = deltaTime / 60;
        }
        
        this.lastTime = currentTime;
    }
    
    getStats() {
        return {
            fps: this.fps,
            frameTime: this.frameTime,
            frameCount: this.frameCount
        };
    }
}

/**
 * Audio context management
 */
export class AudioManager {
    constructor() {
        this.context = null;
        this.sounds = new Map();
        this.muted = true;
        this.initialized = false;
    }
    
    async init() {
        if (this.initialized) return;
        
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            
            // Don't try to resume immediately - wait for user interaction
            this.initialized = true;
        } catch (error) {
            console.warn('Audio context initialization failed:', error);
            this.initialized = false;
        }
    }
    
    async loadSound(url, name) {
        try {
            const audio = await AssetLoader.loadAudio(url);
            this.sounds.set(name, audio);
            return audio;
        } catch (error) {
            console.warn(`Failed to load sound ${name}:`, error);
            return null;
        }
    }
    
    playSound(name, volume = 1.0, loop = false) {
        if (this.muted || !this.initialized) return;
        
        const sound = this.sounds.get(name);
        if (sound) {
            sound.volume = volume;
            sound.loop = loop;
            sound.currentTime = 0;
            sound.play().catch(console.warn);
        }
    }
    
    setMuted(muted) {
        this.muted = muted;
        this.sounds.forEach(sound => {
            sound.muted = muted;
        });
    }
}

/**
 * Event system for intro completion
 */
export class IntroEvents {
    static dispatchComplete() {
        // Dispatch custom event
        const event = new CustomEvent('intro:complete', {
            detail: {
                timestamp: Date.now(),
                duration: performance.now()
            }
        });
        
        window.dispatchEvent(event);
        
        // Call callback if defined
        if (typeof window.onIntroComplete === 'function') {
            window.onIntroComplete();
        }
    }
}

/**
 * Accessibility utilities
 */
export class AccessibilityUtils {
    static checkReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    static checkHighContrast() {
        return window.matchMedia('(prefers-contrast: high)').matches;
    }
    
    static checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }
    
    static shouldSkipIntro() {
        return !this.checkWebGLSupport() || this.checkReducedMotion();
    }
}

/**
 * Memory management
 */
export class MemoryManager {
    static disposeObject(object) {
        if (!object) return;
        
        if (object.geometry) {
            object.geometry.dispose();
        }
        
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(material => this.disposeMaterial(material));
            } else {
                this.disposeMaterial(object.material);
            }
        }
        
        if (object.children) {
            object.children.forEach(child => this.disposeObject(child));
        }
    }
    
    static disposeMaterial(material) {
        if (!material) return;
        
        if (material.map) material.map.dispose();
        if (material.normalMap) material.normalMap.dispose();
        if (material.roughnessMap) material.roughnessMap.dispose();
        if (material.metalnessMap) material.metalnessMap.dispose();
        if (material.emissiveMap) material.emissiveMap.dispose();
        if (material.aoMap) material.aoMap.dispose();
        if (material.displacementMap) material.displacementMap.dispose();
        if (material.alphaMap) material.alphaMap.dispose();
        if (material.envMap) material.envMap.dispose();
        
        material.dispose();
    }
    
    static disposeTexture(texture) {
        if (texture) {
            texture.dispose();
        }
    }
}
