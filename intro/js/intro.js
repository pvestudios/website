// Main intro application

import * as THREE from './three.module.min.js';
import { GLTFLoader } from './loaders/GLTFLoader.js';
import { DRACOLoader } from './loaders/DRACOLoader.js';
import { PortalShader, WhiteFlashShader } from './portal-shader.js';
import { ParticleSystem } from './particles.js';
import { IntroAudio } from './audio.js';
import { createSoldier, updateSoldier, createWoundedSoldier, createRifle } from './soldier.js';
import { 
    DeviceCapabilities, 
    AssetLoader, 
    MathUtils, 
    SplineUtils, 
    PerformanceMonitor,
    IntroEvents,
    AccessibilityUtils,
    MemoryManager
} from './utils.js';

class IntroApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        this.mixer = null;
        
        // Character and movement
        this.soldier = null;
        this.spline = null;
        this.t = 0;
        this.moving = false;
        this.speed = 6.0; // meters per second
        this._curveLength = 0;
        this._frameCount = 0;
        this._ray = null;
        this._groundMeshes = [];
        
        // Portal
        this.portal = null;
        this.portalTrigger = null;
        this.portalReached = false;
        
        // Systems
        this.particleSystem = null;
        this.audio = new IntroAudio();
        this.performanceMonitor = new PerformanceMonitor();
        
        // UI elements
        this.progressBar = null;
        this.skipButton = null;
        this.upButton = null;
        this.muteButton = null;
        this.whiteFlash = null;
        this.loadingScreen = null;
        this.fallbackScreen = null;
        
        // State
        this.isInitialized = false;
        this.isFinished = false;
        this.assetsLoaded = false;
        
        // Performance
        this.deviceTier = DeviceCapabilities.getDeviceTier();
        this.particleLimits = DeviceCapabilities.getParticleLimits();
        
        // Resource tracking for cleanup
        this._intervals = [];
        this._timeouts = [];
        this._eventListeners = [];
        this._disposables = [];
        
        // Error handling
        this._errorCount = 0;
        this._maxRetries = 3;
        
        // Check if we should skip the intro
        if (AccessibilityUtils.shouldSkipIntro()) {
            this.showFallback();
            this._addTimeout(() => IntroEvents.dispatchComplete(), 100);
            return;
        }
        
        this.init();
    }
    
    async init() {
        try {
            await this._initializeWithRetry();
        } catch (error) {
            console.error('Failed to initialize intro after retries:', error);
            this._handleInitializationError(error);
        }
    }
    
    async _initializeWithRetry() {
        for (let attempt = 1; attempt <= this._maxRetries; attempt++) {
            try {
                await this._performInitialization();
                return; // Success
            } catch (error) {
                console.warn(`Initialization attempt ${attempt} failed:`, error);
                this._errorCount++;
                
                if (attempt === this._maxRetries) {
                    throw error;
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }
    
    async _performInitialization() {
        this.setupUI();
        this.setupRenderer();
        this.setupScene();
        this.setupCamera();
        this.setupLighting();
        
        await this.loadAssets();
        this.createEnvironment();
        this.createSoldierCharacter();
        this.createPortal();
        await this.setupParticleSystem();
        
        // Initialize audio in background (non-blocking)
        this.audio.init().catch(error => {
            console.warn('Audio initialization failed, continuing without audio:', error);
        });
        
        this.bindInputs();
        this.setupEventListeners();
        
        this.hideLoadingScreen();
        this.isInitialized = true;
        
        console.log('Intro initialized successfully');
        
        // Start some initial effects
        this._addTimeout(() => {
            this.startInitialEffects();
        }, 1000);
        
        this.animate();
    }
    
    _handleInitializationError(error) {
        this.showFallback();
        // Dispatch error event for analytics
        IntroEvents.dispatchError('initialization_failed', error.message);
    }
    
    setupUI() {
        this.progressBar = document.querySelector('.progress-fill');
        this.skipButton = document.getElementById('intro-skip');
        this.upButton = document.getElementById('intro-up');
        this.muteButton = document.getElementById('intro-mute');
        this.whiteFlash = document.getElementById('white-flash');
        this.loadingScreen = document.getElementById('loading-screen');
        this.fallbackScreen = document.getElementById('fallback-screen');
        this.progressText = document.querySelector('.progress-text');
        
        // Validate critical UI elements
        if (!this.loadingScreen) {
            console.warn('Loading screen element not found');
        }
        if (!this.fallbackScreen) {
            console.warn('Fallback screen element not found');
        }
    }
    
    setupRenderer() {
        const canvas = document.getElementById('intro');
        if (!canvas) {
            throw new Error('Canvas element with id "intro" not found');
        }
        
        try {
            this.renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: this.deviceTier === 'desktop',
                alpha: true,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false
            });
        } catch (error) {
            console.error('Failed to create WebGL renderer:', error);
            throw new Error('WebGL not supported or failed to initialize');
        }
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        // Enable shadow mapping
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Enable bloom on desktop
        if (DeviceCapabilities.shouldEnableBloom()) {
            // Simple bloom effect using post-processing
            this.renderer.toneMappingExposure = 1.1;
        }
        
        // Add to disposables for cleanup
        this._disposables.push(this.renderer);
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
        this.scene.fog = new THREE.Fog(0x000011, 50, 200);
    }
    
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const fov = window.innerWidth < 768 ? 70 : 60;
        
        this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 200);
        // Start camera behind and above character
        this.camera.position.set(0, 3.2, 8);
        this.camera.lookAt(0, 1.2, 0);
    }
    
    setupLighting() {
        // Ambient light - much brighter
        const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
        this.scene.add(ambientLight);
        
        // Directional light (moonlight) - much brighter
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
        directionalLight.position.set(10, 20, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        this.scene.add(directionalLight);
        
        // Additional fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
        fillLight.position.set(-10, 10, -5);
        this.scene.add(fillLight);
        
        // Point lights for fires
        this.createFireLights();
    }
    
    createFireLights() {
        const firePositions = [
            new THREE.Vector3(-5, 0, -20),
            new THREE.Vector3(8, 0, -35),
            new THREE.Vector3(-3, 0, -50),
            new THREE.Vector3(6, 0, -70)
        ];
        
        this.fireLights = []; // Track for cleanup
        firePositions.forEach(pos => {
            const light = new THREE.PointLight(0xff6600, 0.5, 10);
            light.position.copy(pos);
            light.castShadow = true;
            this.scene.add(light);
            this.fireLights.push(light);
        });
    }
    
    async loadAssets() {
        try {
            // Create procedural assets for demo
            await this.createProceduralAssets();
            this.assetsLoaded = true;
        } catch (error) {
            console.error('Failed to load assets:', error);
            throw error;
        }
    }
    
    async createProceduralAssets() {
        // Create starfield texture
        this.starfieldTexture = this.createStarfieldTexture();
        
        // Create ground texture
        this.groundTexture = this.createGroundTexture();
        
        // Create wall texture
        this.wallTexture = this.createWallTexture();
    }
    
    createStarfieldTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
        gradient.addColorStop(0, '#000011');
        gradient.addColorStop(1, '#000033');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 2048, 1024);
        
        // Add stars
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * 2048;
            const y = Math.random() * 1024;
            const size = Math.random() * 2;
            ctx.fillRect(x, y, size, size);
        }
        
        // Add nebula
        const nebulaGradient = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 800);
        nebulaGradient.addColorStop(0, 'rgba(136, 0, 255, 0.1)');
        nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebulaGradient;
        ctx.fillRect(0, 0, 2048, 1024);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
    
    createGroundTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Create mud texture
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#2d1b0e');
        gradient.addColorStop(0.5, '#3d2b1e');
        gradient.addColorStop(1, '#2d1b0e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add noise
        const imageData = ctx.getImageData(0, 0, 512, 512);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 0.3;
            data[i] = Math.min(255, data[i] + noise * 255);
            data[i + 1] = Math.min(255, data[i + 1] + noise * 200);
            data[i + 2] = Math.min(255, data[i + 2] + noise * 100);
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        return texture;
    }
    
    createWallTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Create wall texture
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(0.5, '#2a2a2a');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add brick pattern
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        for (let y = 0; y < 512; y += 32) {
            for (let x = 0; x < 512; x += 64) {
                ctx.strokeRect(x, y, 64, 32);
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        return texture;
    }
    
    createStraightPath(length = 100, segments = 50) {
        const points = [];
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = 0; // Keep X at 0 for straight line
            const y = 0; // Ground level
            const z = -t * length; // Forward movement (negative Z)
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        return SplineUtils.createCatmullRomSpline(points);
    }
    
    createEnvironment() {
        // Create straight path for character movement
        this.spline = this.createStraightPath(100, 50);
        
        // Precompute curve length for distance-based movement
        this._curveLength = this.spline.getLength();
        
        // Create ground
        this.createGround();
        
        // Create walls
        this.createWalls();
        
        // Create sandbags
        this.createSandbags();
        
        // Create wounded soldiers
        this.createWoundedSoldiers();
        
        // Create war debris
        this.createWarDebris();
        
        // Start particle effects immediately
        this.startWarEffects();
        
        // Pause effects when tab is not visible
        this.setupVisibilityHandling();
    }
    
    createGround() {
        const geometry = new THREE.PlaneGeometry(200, 100);
        const material = new THREE.MeshLambertMaterial({
            map: this.groundTexture,
            color: 0x2c3e50,
            emissive: 0x111122,
            side: THREE.DoubleSide
        });
        
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Store ground mesh for raycasting
        this._groundMeshes.push(ground);
        
        // Store for cleanup
        this._disposables.push({ geometry, material });
    }
    
    createWalls() {
        const wallHeight = 3;
        const wallLength = 100;
        const wallThickness = 0.5;
        
        // Left wall
        const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, wallLength);
        const leftWallMaterial = new THREE.MeshLambertMaterial({
            map: this.wallTexture,
            color: 0x444444,
            emissive: 0x111111
        });
        const leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
        leftWall.position.set(-8, wallHeight / 2, -wallLength / 2);
        leftWall.castShadow = true;
        this.scene.add(leftWall);
        
        // Right wall
        const rightWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
        rightWall.position.set(8, wallHeight / 2, -wallLength / 2);
        rightWall.castShadow = true;
        this.scene.add(rightWall);
        
        // Store for cleanup
        this._disposables.push({ geometry: leftWallGeometry, material: leftWallMaterial });
    }
    
    createSandbags() {
        const sandbagGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.4);
        const sandbagMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        
        this.sandbags = []; // Track for cleanup
        
        // Create sandbag barriers along the trench
        for (let i = 0; i < 20; i++) {
            const sandbag = new THREE.Mesh(sandbagGeometry, sandbagMaterial);
            const t = i / 20;
            const point = this.spline.getPoint(t);
            sandbag.position.copy(point);
            sandbag.position.y = 0.2;
            sandbag.position.x += MathUtils.randomRange(-1, 1);
            sandbag.rotation.y = Math.random() * Math.PI;
            sandbag.castShadow = true;
            this.scene.add(sandbag);
            this.sandbags.push(sandbag);
        }
        
        // Store for cleanup
        this._disposables.push({ geometry: sandbagGeometry, material: sandbagMaterial });
    }
    
    createWoundedSoldiers() {
        this.woundedSoldiers = []; // Track for cleanup
        
        // Create wounded soldier representations using the soldier module
        for (let i = 0; i < 3; i++) {
            const woundedSoldier = createWoundedSoldier({
                scale: 1,
                helmetColor: 0x8B4513, // Brown helmet for wounded
                uniformColor: 0x654321  // Darker uniform
            });
            
            const t = 0.2 + (i * 0.25);
            const point = this.spline.getPoint(t);
            woundedSoldier.group.position.copy(point);
            woundedSoldier.group.position.y = 0;
            woundedSoldier.group.position.x += MathUtils.randomRange(-2, 2);
            woundedSoldier.group.rotation.y = Math.random() * Math.PI;
            this.scene.add(woundedSoldier.group);
            this.woundedSoldiers.push(woundedSoldier);
        }
    }
    
    createWarDebris() {
        this.warDebris = []; // Track for cleanup
        
        // Create scattered debris along the trench
        for (let i = 0; i < 15; i++) {
            const t = Math.random();
            const point = this.spline.getPoint(t);
            
            // Random debris type
            const debrisType = Math.random();
            let geometry, material;
            
            if (debrisType < 0.3) {
                // Metal scrap
                geometry = new THREE.BoxGeometry(0.5, 0.2, 0.8);
                material = new THREE.MeshLambertMaterial({ color: 0x666666 });
            } else if (debrisType < 0.6) {
                // Wooden planks
                geometry = new THREE.BoxGeometry(1, 0.1, 0.3);
                material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            } else {
                // Rocks
                geometry = new THREE.SphereGeometry(0.3, 6, 4);
                material = new THREE.MeshLambertMaterial({ color: 0x444444 });
            }
            
            const debris = new THREE.Mesh(geometry, material);
            debris.position.copy(point);
            debris.position.y = 0.1;
            debris.position.x += MathUtils.randomRange(-3, 3);
            debris.rotation.y = Math.random() * Math.PI * 2;
            debris.castShadow = true;
            this.scene.add(debris);
            this.warDebris.push({ mesh: debris, geometry, material });
        }
    }
    
    startWarEffects() {
        // Start continuous war effects with performance optimization
        const warEffectInterval = setInterval(() => {
            if (this.particleSystem && !this.isFinished) {
                // Throttle effects based on performance
                const shouldEmit = this.performanceMonitor.getFPS() > 30;
                if (!shouldEmit) return;
                
                // Random explosions
                if (Math.random() < 0.2) {
                    const explosionPos = new THREE.Vector3(
                        MathUtils.randomRange(-15, 15),
                        0,
                        MathUtils.randomRange(-50, 50)
                    );
                    this.particleSystem.emitExplosion(explosionPos, 0.8);
                }
                
                // Random smoke
                if (Math.random() < 0.3) {
                    const smokePos = new THREE.Vector3(
                        MathUtils.randomRange(-10, 10),
                        0,
                        MathUtils.randomRange(-50, 50)
                    );
                    this.particleSystem.emitSmoke(smokePos, 3);
                }
                
                // Random fire
                if (Math.random() < 0.15) {
                    const firePos = new THREE.Vector3(
                        MathUtils.randomRange(-8, 8),
                        0,
                        MathUtils.randomRange(-50, 50)
                    );
                    this.particleSystem.emitFire(firePos, 2);
                }
            }
        }, 3000); // Reduced frequency for better performance
        
        this._addInterval(warEffectInterval);
    }
    
    startInitialEffects() {
        if (!this.particleSystem) return;
        
        // Create some initial war atmosphere
        for (let i = 0; i < 5; i++) {
            const smokePos = new THREE.Vector3(
                MathUtils.randomRange(-8, 8),
                0,
                MathUtils.randomRange(-30, -10)
            );
            this.particleSystem.emitSmoke(smokePos, 2);
        }
        
        for (let i = 0; i < 3; i++) {
            const firePos = new THREE.Vector3(
                MathUtils.randomRange(-6, 6),
                0,
                MathUtils.randomRange(-25, -5)
            );
            this.particleSystem.emitFire(firePos, 1);
        }
    }
    
    
    createSoldierCharacter() {
        try {
            // Create the main soldier character using the soldier module
            this.soldier = createSoldier({
                scale: 1,
                helmetColor: 0x2ecc71, // Green helmet
                uniformColor: 0x4169E1, // Blue uniform
                skinColor: 0xffdbac,
                bootColor: 0x2c3e50
            });
            
            if (!this.soldier || !this.soldier.group) {
                throw new Error('Failed to create soldier character');
            }
            
            // Position soldier at start of path
            const startPoint = this.spline.getPoint(0);
            this.soldier.group.position.copy(startPoint);
            this.soldier.group.position.y = 0;
            this.scene.add(this.soldier.group);
            
            // Add a rifle
            const rifle = createRifle({ scale: 1 });
            if (rifle) {
                rifle.position.set(0.3, 0.5, 0);
                rifle.rotation.z = -0.2;
                this.soldier.group.add(rifle);
            }
            
            console.log('Soldier created at position:', this.soldier.group.position);
        } catch (error) {
            console.error('Failed to create soldier character:', error);
            throw error;
        }
    }
    
    createPortal() {
        try {
            // Create portal group
            const portalGroup = new THREE.Group();
            
            // Main portal ring (torus) with shader
            const portalGeometry = new THREE.TorusGeometry(3, 0.4, 32, 128);
            this.portalMaterial = new THREE.ShaderMaterial({
                ...PortalShader,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            // Set the starfield texture with null check
            if (this.portalMaterial.uniforms && this.portalMaterial.uniforms.starfieldTexture) {
                this.portalMaterial.uniforms.starfieldTexture.value = this.starfieldTexture;
            }
            
            const portalRing = new THREE.Mesh(portalGeometry, this.portalMaterial);
            portalGroup.add(portalRing);
            
            // Inner portal area with starfield
            const innerGeometry = new THREE.CircleGeometry(2.5, 32);
            const innerMaterial = new THREE.MeshBasicMaterial({
                map: this.starfieldTexture,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide
            });
            const innerPortal = new THREE.Mesh(innerGeometry, innerMaterial);
            innerPortal.rotation.x = Math.PI / 2; // Face forward
            portalGroup.add(innerPortal);
            
            // Glowing effect around portal
            const glowGeometry = new THREE.TorusGeometry(3.5, 0.2, 8, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x8800ff,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            portalGroup.add(glow);
            
            // Add some sparkles around the portal
            this.portalSparkles = []; // Track for cleanup
            for (let i = 0; i < 20; i++) {
                const sparkleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
                const sparkleMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8
                });
                const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
                
                const angle = (i / 20) * Math.PI * 2;
                const radius = 4 + Math.random() * 2;
                sparkle.position.set(
                    Math.cos(angle) * radius,
                    Math.random() * 2 - 1,
                    Math.sin(angle) * radius
                );
                portalGroup.add(sparkle);
                this.portalSparkles.push({ geometry: sparkleGeometry, material: sparkleMaterial });
            }
            
            this.portal = portalGroup;
            
            // Position portal at end of path
            const endPoint = this.spline.getPoint(1);
            this.portal.position.copy(endPoint);
            this.portal.position.y = 2;
            this.scene.add(this.portal);
            
            // Create invisible trigger sphere
            const triggerGeometry = new THREE.SphereGeometry(4, 8, 6);
            const triggerMaterial = new THREE.MeshBasicMaterial({ 
                visible: false,
                transparent: true,
                opacity: 0
            });
            this.portalTrigger = new THREE.Mesh(triggerGeometry, triggerMaterial);
            this.portalTrigger.position.copy(this.portal.position);
            this.scene.add(this.portalTrigger);
            
            // Store for cleanup
            this._disposables.push({ 
                geometry: portalGeometry, 
                material: this.portalMaterial,
                innerGeometry,
                innerMaterial,
                glowGeometry,
                glowMaterial,
                triggerGeometry,
                triggerMaterial
            });
            
            console.log('Portal created at position:', this.portal.position);
        } catch (error) {
            console.error('Failed to create portal:', error);
            throw error;
        }
    }
    
    async setupParticleSystem() {
        console.log('Setting up particle system...');
        this.particleSystem = new ParticleSystem(this.scene, this.particleLimits);
        await this.particleSystem.init();
        console.log('Particle system initialized');
    }
    
    bindInputs() {
        // Mobile touch controls with null safety
        if (this.upButton) {
            const upStartHandler = () => this.startMoving();
            const upStopHandler = () => this.stopMoving();
            const touchStartHandler = (e) => {
                e.preventDefault();
                this.startMoving();
            };
            const touchEndHandler = (e) => {
                e.preventDefault();
                this.stopMoving();
            };
            const touchCancelHandler = (e) => {
                e.preventDefault();
                this.stopMoving();
            };
            
            this.upButton.addEventListener('pointerdown', upStartHandler);
            this.upButton.addEventListener('pointerup', upStopHandler);
            this.upButton.addEventListener('touchstart', touchStartHandler, { passive: false });
            this.upButton.addEventListener('touchend', touchEndHandler, { passive: false });
            this.upButton.addEventListener('touchcancel', touchCancelHandler, { passive: false });
            
            // Track for cleanup
            this._eventListeners.push({ element: this.upButton, event: 'pointerdown', handler: upStartHandler });
            this._eventListeners.push({ element: this.upButton, event: 'pointerup', handler: upStopHandler });
            this._eventListeners.push({ element: this.upButton, event: 'touchstart', handler: touchStartHandler });
            this._eventListeners.push({ element: this.upButton, event: 'touchend', handler: touchEndHandler });
            this._eventListeners.push({ element: this.upButton, event: 'touchcancel', handler: touchCancelHandler });
        }
        
        // Skip button
        if (this.skipButton) {
            const skipHandler = () => this.finishIntro();
            this.skipButton.addEventListener('click', skipHandler);
            this._eventListeners.push({ element: this.skipButton, event: 'click', handler: skipHandler });
        }
        
        // Mute button
        if (this.muteButton) {
            const muteHandler = () => {
                if (this.audio && this.audio.audioManager) {
                    this.audio.setMuted(!this.audio.audioManager.muted);
                }
            };
            this.muteButton.addEventListener('click', muteHandler);
            this._eventListeners.push({ element: this.muteButton, event: 'click', handler: muteHandler });
        }
    }
    
    setupEventListeners() {
        // Store bound functions for proper cleanup
        this._onResize = () => this.onWindowResize();
        this._onKeyDown = (event) => {
            if (event.code === 'ArrowUp' || event.code === 'KeyW') {
                this.startMoving();
            }
            if (event.code === 'Enter' || event.code === 'Space') {
                if (document.activeElement === this.skipButton) {
                    this.finishIntro();
                }
            }
            // Accessibility: Escape key to skip
            if (event.code === 'Escape') {
                this.finishIntro();
            }
        };
        this._onKeyUp = (event) => {
            if (event.code === 'ArrowUp' || event.code === 'KeyW') {
                this.stopMoving();
            }
        };
        this._onContextMenu = (e) => e.preventDefault();
        
        // Add event listeners with tracking
        this._addEventListener(window, 'resize', this._onResize);
        this._addEventListener(document, 'contextmenu', this._onContextMenu);
        this._addEventListener(document, 'keydown', this._onKeyDown);
        this._addEventListener(document, 'keyup', this._onKeyUp);
        
        // Add accessibility features
        this._setupAccessibility();
    }
    
    _addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this._eventListeners.push({ element, event, handler });
    }
    
    _addInterval(interval) {
        this._intervals.push(interval);
    }
    
    _addTimeout(timeout) {
        this._timeouts.push(timeout);
    }
    
    _setupAccessibility() {
        // Add ARIA labels
        if (this.skipButton) {
            this.skipButton.setAttribute('aria-label', 'Skip intro animation');
        }
        if (this.upButton) {
            this.upButton.setAttribute('aria-label', 'Move forward');
        }
        if (this.muteButton) {
            this.muteButton.setAttribute('aria-label', 'Toggle audio');
        }
        
        // Add role attributes
        if (this.progressBar) {
            this.progressBar.setAttribute('role', 'progressbar');
            this.progressBar.setAttribute('aria-valuemin', '0');
            this.progressBar.setAttribute('aria-valuemax', '100');
        }
    }
    
    startMoving() {
        if (this.isFinished || !this.isInitialized) return;
        console.log('Starting movement, t:', this.t, 'moving:', this.moving);
        this.moving = true;
        if (this.audio && typeof this.audio.onCharacterStart === 'function') {
            this.audio.onCharacterStart();
        }
    }
    
    stopMoving() {
        this.moving = false;
    }
    
    update(deltaTime) {
        if (!this.isInitialized || this.isFinished) return;
        
        // Validate deltaTime
        if (!deltaTime || deltaTime <= 0) {
            deltaTime = 16; // Default to 60fps
        }
        
        // Update character movement with distance-based calculation
        if (this.moving && this.t < 1 && this.soldier && this.soldier.group) {
            const metersPerSec = this.speed;
            const dist = metersPerSec * (deltaTime / 1000);
            const dt = dist / this._curveLength;
            this.t = Math.min(1, this.t + dt);
            
            // Update soldier position and animation
            const point = this.spline.getPoint(this.t);
            this.soldier.group.position.copy(point);
            
            // Ground snapping with raycast (every 3 frames for performance)
            if ((this._frameCount++ % 3) === 0) {
                this._ray ||= new THREE.Raycaster();
                this._ray.set(
                    new THREE.Vector3(this.soldier.group.position.x, 10, this.soldier.group.position.z),
                    new THREE.Vector3(0, -1, 0)
                );
                const hits = this._ray.intersectObjects(this._groundMeshes, true);
                if (hits[0]) {
                    this.soldier.group.position.y = hits[0].point.y;
                } else {
                    this.soldier.group.position.y = 0;
                }
            } else {
                this.soldier.group.position.y = 0;
            }
            
            // Keep soldier facing forward (straight ahead)
            this.soldier.group.rotation.y = 0;
            
            // Update soldier animation
            if (typeof updateSoldier === 'function') {
                updateSoldier(this.soldier, deltaTime / 1000, {
                    speed: this.speed,
                    moving: this.moving
                });
            }
            
            // Update camera to follow character
            this.updateCamera();
            
            // Update progress bar
            this.updateProgressBar();
            
            // Emit particles along the path (throttled for performance)
            if (this._frameCount % 3 === 0 && Math.random() < 0.2) {
                this.emitParticlesAlongPath();
            }
            
            // Check for portal collision
            this.checkPortalCollision();
            
            // Debug log every 60 frames (only in development)
            if (process.env.NODE_ENV !== 'production' && Math.floor(this.clock.getElapsedTime() * 60) % 60 === 0) {
                console.log('Soldier position:', this.soldier.group.position, 't:', this.t);
            }
        }
        
        // Update systems
        if (this.particleSystem && typeof this.particleSystem.update === 'function') {
            this.particleSystem.update(deltaTime);
        }
        
        if (this.performanceMonitor && typeof this.performanceMonitor.update === 'function') {
            this.performanceMonitor.update();
        }
        
        // Update portal shader
        if (this.portalMaterial && this.portalMaterial.uniforms && this.portalMaterial.uniforms.time) {
            this.portalMaterial.uniforms.time.value = this.clock.getElapsedTime();
        }
    }
    
    updateCamera() {
        // Follow the soldier character
        if (!this.soldier) return;
        
        // Position camera straight behind character
        const backOffset = new THREE.Vector3(0, 0, 8); // 8 units behind
        const upOffset = new THREE.Vector3(0, 3.2, 0); // 3.2 units up
        
        // Calculate camera position
        const targetPosition = this.soldier.group.position.clone()
            .add(backOffset)
            .add(upOffset);
        
        // Smooth camera follow
        this.camera.position.lerp(targetPosition, 0.1);
        
        // Look at character with slight downward angle
        const lookTarget = this.soldier.group.position.clone();
        lookTarget.y += 1.2; // Look at character's head level
        this.camera.lookAt(lookTarget);
    }
    
    updateProgressBar() {
        if (this.progressBar) {
            const progress = this.t * 100;
            this.progressBar.style.width = `${progress}%`;
            
            // Cache progress text element
            if (!this.progressText) {
                this.progressText = document.querySelector('.progress-text');
            }
            if (this.progressText) {
                this.progressText.textContent = `${Math.round(progress)}%`;
            }
        }
    }
    
    emitParticlesAlongPath() {
        if (!this.particleSystem || !this.soldier || !this.soldier.group) return;
        
        // Emit smoke and fire particles occasionally
        if (Math.random() < 0.1) {
            const point = this.spline.getPoint(this.t);
            if (this.particleSystem.emitSmoke) {
                this.particleSystem.emitSmoke(point, 2);
            }
        }
        
        if (Math.random() < 0.05) {
            const point = this.spline.getPoint(this.t);
            if (this.particleSystem.emitFire) {
                this.particleSystem.emitFire(point, 1);
            }
        }
        
        // Emit bullets overhead
        if (Math.random() < 0.3) {
            const startPos = new THREE.Vector3(
                MathUtils.randomRange(-10, 10),
                MathUtils.randomRange(5, 15),
                this.soldier.group.position.z - 20
            );
            const endPos = new THREE.Vector3(
                MathUtils.randomRange(-10, 10),
                MathUtils.randomRange(5, 15),
                this.soldier.group.position.z + 20
            );
            if (this.particleSystem.emitBullet) {
                this.particleSystem.emitBullet(startPos, endPos);
            }
            if (this.audio && typeof this.audio.onBulletFire === 'function') {
                this.audio.onBulletFire();
            }
        }
        
        // Random explosions (reduced frequency for performance)
        if (Math.random() < 0.01) {
            const explosionPos = new THREE.Vector3(
                MathUtils.randomRange(-15, 15),
                0,
                this.soldier.group.position.z + MathUtils.randomRange(-30, 30)
            );
            if (this.particleSystem.emitExplosion) {
                this.particleSystem.emitExplosion(explosionPos, 0.5);
            }
            if (this.audio && typeof this.audio.onExplosion === 'function') {
                this.audio.onExplosion();
            }
        }
    }
    
    checkPortalCollision() {
        if (!this.portalTrigger || this.portalReached || !this.soldier) return;
        
        const distance = this.soldier.group.position.distanceTo(this.portalTrigger.position);
        if (distance < 3) {
            this.portalReached = true;
            this.onPortalReached();
        }
    }
    
    onPortalReached() {
        if (this.audio && typeof this.audio.onPortalReached === 'function') {
            this.audio.onPortalReached();
        }
        this.finishIntro();
    }
    
    finishIntro() {
        if (this.isFinished) return;
        this.isFinished = true;
        
        // Stop movement
        this.moving = false;
        
        // Play portal sound
        if (this.audio && typeof this.audio.onPortalReached === 'function') {
            this.audio.onPortalReached();
        }
        
        // Start white flash sequence
        this.startWhiteFlashSequence();
    }
    
    startWhiteFlashSequence() {
        // Brighten portal
        if (this.portalMaterial && this.portalMaterial.uniforms && this.portalMaterial.uniforms.intensity) {
            this.portalMaterial.uniforms.intensity.value = 2.0;
        }
        
        // White flash
        const timeout1 = setTimeout(() => {
            if (this.whiteFlash) {
                this.whiteFlash.style.opacity = '1';
            }
            
            const timeout2 = setTimeout(() => {
                if (this.whiteFlash) {
                    this.whiteFlash.style.opacity = '0';
                }
                
                // Clean up and dispatch event
                const timeout3 = setTimeout(() => {
                    this.cleanup();
                    if (typeof IntroEvents.dispatchComplete === 'function') {
                        IntroEvents.dispatchComplete();
                    }
                }, 500);
                this._addTimeout(timeout3);
            }, 300);
            this._addTimeout(timeout2);
        }, 500);
        this._addTimeout(timeout1);
    }
    
    cleanup() {
        // Stop animation loop
        this.isInitialized = false;
        
        // Clear all intervals and timeouts
        this._intervals.forEach(interval => clearInterval(interval));
        this._timeouts.forEach(timeout => clearTimeout(timeout));
        this._intervals = [];
        this._timeouts = [];
        
        // Dispose of Three.js objects
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            MemoryManager.disposeObject(this.scene);
        }
        
        // Dispose of renderer
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.forceContextLoss();
        }
        
        // Clean up audio
        if (this.audio) {
            this.audio.dispose();
        }
        
        // Clean up particle system
        if (this.particleSystem) {
            this.particleSystem.dispose();
        }
        
        // Remove all event listeners
        this._eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this._eventListeners = [];
        
        // Dispose of custom resources
        this._disposables.forEach(disposable => {
            if (typeof disposable.dispose === 'function') {
                disposable.dispose();
            }
        });
        this._disposables = [];
        
        // Clear references
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.soldier = null;
        this.portal = null;
        this.particleSystem = null;
    }
    
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        const aspect = window.innerWidth / window.innerHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size with device pixel ratio
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(pixelRatio);
    }
    
    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'none';
        }
    }
    
    showFallback() {
        if (this.fallbackScreen) {
            this.fallbackScreen.style.display = 'flex';
        }
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'none';
        }
    }
    
    animate() {
        if (!this.isInitialized) return;
        
        try {
            const deltaTime = this.clock.getDelta() * 1000; // Convert to milliseconds
            this.update(deltaTime);
            
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        } catch (error) {
            console.error('Animation loop error:', error);
            this.showFallback();
            return;
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    setupVisibilityHandling() {
        this._onVisibilityChange = () => {
            if (document.hidden) {
                // Pause war effects when tab is not visible
                this._pauseWarEffects();
            } else {
                // Resume war effects when tab becomes visible
                if (!this.isFinished) {
                    this.startWarEffects();
                }
            }
        };
        this._addEventListener(document, 'visibilitychange', this._onVisibilityChange);
    }
    
    _pauseWarEffects() {
        // Clear existing war effects
        this._intervals.forEach(interval => clearInterval(interval));
        this._intervals = [];
    }
}

// Initialize the intro when the page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        new IntroApp();
    } catch (error) {
        console.error('Failed to initialize IntroApp:', error);
        // Show fallback screen if available
        const fallbackScreen = document.getElementById('fallback-screen');
        if (fallbackScreen) {
            fallbackScreen.style.display = 'flex';
        }
        // Hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
});
