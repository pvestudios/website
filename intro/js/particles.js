// Particle systems for smoke, fire, bullets, and explosions

import * as THREE from './three.module.min.js';
import { ParticleShader } from './portal-shader.js';
import { MathUtils, DeviceCapabilities } from './utils.js';

export class ParticleSystem {
    constructor(scene, limits) {
        this.scene = scene;
        this.limits = limits;
        this.particles = new Map();
        this.textures = new Map();
        this.clock = new THREE.Clock();
    }
    
    async init() {
        await this.loadTextures();
        this.createSmokeSystem();
        this.createFireSystem();
        this.createBulletSystem();
        this.createExplosionSystem();
    }
    
    async loadTextures() {
        try {
            // Create procedural textures for particles
            this.textures.set('smoke', this.createSmokeTexture());
            this.textures.set('fire', this.createFireTexture());
            this.textures.set('bullet', this.createBulletTexture());
        } catch (error) {
            console.warn('Failed to load particle textures:', error);
        }
    }
    
    createSmokeTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create radial gradient for smoke
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.3, 'rgba(200, 200, 200, 0.6)');
        gradient.addColorStop(0.7, 'rgba(150, 150, 150, 0.3)');
        gradient.addColorStop(1, 'rgba(100, 100, 100, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        // Add noise
        const imageData = ctx.getImageData(0, 0, 256, 256);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 0.3;
            data[i] = Math.min(255, data[i] + noise * 255);
            data[i + 1] = Math.min(255, data[i + 1] + noise * 255);
            data[i + 2] = Math.min(255, data[i + 2] + noise * 255);
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    createFireTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create fire gradient
        const gradient = ctx.createLinearGradient(0, 256, 0, 0);
        gradient.addColorStop(0, 'rgba(255, 100, 0, 0)');
        gradient.addColorStop(0.3, 'rgba(255, 150, 0, 0.8)');
        gradient.addColorStop(0.6, 'rgba(255, 200, 0, 0.9)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        
        // Add flame-like noise
        const imageData = ctx.getImageData(0, 0, 256, 256);
        const data = imageData.data;
        
        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 256; x++) {
                const i = (y * 256 + x) * 4;
                const noise = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.3;
                const flame = Math.sin((x + y) * 0.2) * 0.2;
                
                data[i] = Math.min(255, data[i] + noise * 255 + flame * 255);
                data[i + 1] = Math.min(255, data[i + 1] + noise * 200 + flame * 200);
                data[i + 2] = Math.min(255, data[i + 2] + noise * 100 + flame * 100);
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    createBulletTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Create bullet streak
        const gradient = ctx.createLinearGradient(0, 0, 64, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 0, 0)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 0, 0.8)');
        gradient.addColorStop(0.7, 'rgba(255, 200, 0, 1)');
        gradient.addColorStop(1, 'rgba(255, 150, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    createSmokeSystem() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.limits.smoke * 3);
        const sizes = new Float32Array(this.limits.smoke);
        const alphas = new Float32Array(this.limits.smoke);
        const rotations = new Float32Array(this.limits.smoke);
        const velocities = new Float32Array(this.limits.smoke * 3);
        const lifetimes = new Float32Array(this.limits.smoke);
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                texture: { value: this.textures.get('smoke') },
                time: { value: 0.0 }
            },
            vertexShader: ParticleShader.vertexShader,
            fragmentShader: ParticleShader.fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending
        });
        
        const smoke = new THREE.Points(geometry, material);
        smoke.userData = {
            type: 'smoke',
            velocities,
            lifetimes,
            activeCount: 0
        };
        
        this.particles.set('smoke', smoke);
        this.scene.add(smoke);
    }
    
    createFireSystem() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.limits.fire * 3);
        const sizes = new Float32Array(this.limits.fire);
        const alphas = new Float32Array(this.limits.fire);
        const rotations = new Float32Array(this.limits.fire);
        const velocities = new Float32Array(this.limits.fire * 3);
        const lifetimes = new Float32Array(this.limits.fire);
        const colors = new Float32Array(this.limits.fire * 3);
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                texture: { value: this.textures.get('fire') },
                time: { value: 0.0 }
            },
            vertexShader: ParticleShader.vertexShader,
            fragmentShader: ParticleShader.fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });
        
        const fire = new THREE.Points(geometry, material);
        fire.userData = {
            type: 'fire',
            velocities,
            lifetimes,
            colors,
            activeCount: 0
        };
        
        this.particles.set('fire', fire);
        this.scene.add(fire);
    }
    
    createBulletSystem() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.limits.bullets * 3);
        const sizes = new Float32Array(this.limits.bullets);
        const alphas = new Float32Array(this.limits.bullets);
        const rotations = new Float32Array(this.limits.bullets);
        const velocities = new Float32Array(this.limits.bullets * 3);
        const lifetimes = new Float32Array(this.limits.bullets);
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                texture: { value: this.textures.get('bullet') },
                time: { value: 0.0 }
            },
            vertexShader: ParticleShader.vertexShader,
            fragmentShader: ParticleShader.fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        const bullets = new THREE.Points(geometry, material);
        bullets.userData = {
            type: 'bullets',
            velocities,
            lifetimes,
            activeCount: 0
        };
        
        this.particles.set('bullets', bullets);
        this.scene.add(bullets);
    }
    
    createExplosionSystem() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.limits.explosions * 3);
        const sizes = new Float32Array(this.limits.explosions);
        const alphas = new Float32Array(this.limits.explosions);
        const rotations = new Float32Array(this.limits.explosions);
        const velocities = new Float32Array(this.limits.explosions * 3);
        const lifetimes = new Float32Array(this.limits.explosions);
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                texture: { value: this.textures.get('fire') },
                time: { value: 0.0 }
            },
            vertexShader: ParticleShader.vertexShader,
            fragmentShader: ParticleShader.fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        const explosions = new THREE.Points(geometry, material);
        explosions.userData = {
            type: 'explosions',
            velocities,
            lifetimes,
            activeCount: 0
        };
        
        this.particles.set('explosions', explosions);
        this.scene.add(explosions);
    }
    
    emitSmoke(position, count = 5) {
        const smoke = this.particles.get('smoke');
        const userData = smoke.userData;
        
        for (let i = 0; i < count && userData.activeCount < this.limits.smoke; i++) {
            const index = userData.activeCount;
            const positions = smoke.geometry.attributes.position.array;
            const sizes = smoke.geometry.attributes.size.array;
            const alphas = smoke.geometry.attributes.alpha.array;
            const rotations = smoke.geometry.attributes.rotation.array;
            const velocities = userData.velocities;
            const lifetimes = userData.lifetimes;
            
            // Position with some randomness
            positions[index * 3] = position.x + MathUtils.randomRange(-1, 1);
            positions[index * 3 + 1] = position.y + MathUtils.randomRange(0, 2);
            positions[index * 3 + 2] = position.z + MathUtils.randomRange(-1, 1);
            
            // Size and properties
            sizes[index] = MathUtils.randomRange(1, 2.4);
            alphas[index] = 0.8;
            rotations[index] = Math.random() * Math.PI * 2;
            
            // Velocity (upward with some drift)
            velocities[index * 3] = MathUtils.randomRange(-0.5, 0.5);
            velocities[index * 3 + 1] = MathUtils.randomRange(0.5, 1.5);
            velocities[index * 3 + 2] = MathUtils.randomRange(-0.5, 0.5);
            
            // Lifetime
            lifetimes[index] = MathUtils.randomRange(2, 4);
            
            userData.activeCount++;
        }
        
        smoke.geometry.attributes.position.needsUpdate = true;
        smoke.geometry.attributes.size.needsUpdate = true;
        smoke.geometry.attributes.alpha.needsUpdate = true;
        smoke.geometry.attributes.rotation.needsUpdate = true;
    }
    
    emitFire(position, count = 3) {
        const fire = this.particles.get('fire');
        const userData = fire.userData;
        
        for (let i = 0; i < count && userData.activeCount < this.limits.fire; i++) {
            const index = userData.activeCount;
            const positions = fire.geometry.attributes.position.array;
            const sizes = fire.geometry.attributes.size.array;
            const alphas = fire.geometry.attributes.alpha.array;
            const rotations = fire.geometry.attributes.rotation.array;
            const colors = userData.colors;
            const velocities = userData.velocities;
            const lifetimes = userData.lifetimes;
            
            // Position
            positions[index * 3] = position.x + MathUtils.randomRange(-0.5, 0.5);
            positions[index * 3 + 1] = position.y;
            positions[index * 3 + 2] = position.z + MathUtils.randomRange(-0.5, 0.5);
            
            // Size and properties
            sizes[index] = MathUtils.randomRange(0.5, 1.5);
            alphas[index] = 1.0;
            rotations[index] = Math.random() * Math.PI * 2;
            
            // Color (fire colors)
            const colorMix = Math.random();
            colors[index * 3] = 1.0; // Red
            colors[index * 3 + 1] = 0.3 + colorMix * 0.7; // Green
            colors[index * 3 + 2] = colorMix * 0.3; // Blue
            
            // Velocity (upward with some randomness)
            velocities[index * 3] = MathUtils.randomRange(-0.2, 0.2);
            velocities[index * 3 + 1] = MathUtils.randomRange(0.8, 1.5);
            velocities[index * 3 + 2] = MathUtils.randomRange(-0.2, 0.2);
            
            // Lifetime
            lifetimes[index] = MathUtils.randomRange(1, 2);
            
            userData.activeCount++;
        }
        
        fire.geometry.attributes.position.needsUpdate = true;
        fire.geometry.attributes.size.needsUpdate = true;
        fire.geometry.attributes.alpha.needsUpdate = true;
        fire.geometry.attributes.rotation.needsUpdate = true;
        fire.geometry.attributes.color.needsUpdate = true;
    }
    
    emitBullet(startPos, endPos, speed = 20) {
        const bullets = this.particles.get('bullets');
        const userData = bullets.userData;
        
        if (userData.activeCount >= this.limits.bullets) return;
        
        const index = userData.activeCount;
        const positions = bullets.geometry.attributes.position.array;
        const sizes = bullets.geometry.attributes.size.array;
        const alphas = bullets.geometry.attributes.alpha.array;
        const rotations = bullets.geometry.attributes.rotation.array;
        const velocities = userData.velocities;
        const lifetimes = userData.lifetimes;
        
        // Position
        positions[index * 3] = startPos.x;
        positions[index * 3 + 1] = startPos.y;
        positions[index * 3 + 2] = startPos.z;
        
        // Size and properties
        sizes[index] = 0.5;
        alphas[index] = 1.0;
        rotations[index] = Math.atan2(endPos.z - startPos.z, endPos.x - startPos.x);
        
        // Velocity
        const direction = new THREE.Vector3().subVectors(endPos, startPos).normalize();
        velocities[index * 3] = direction.x * speed;
        velocities[index * 3 + 1] = direction.y * speed;
        velocities[index * 3 + 2] = direction.z * speed;
        
        // Lifetime
        lifetimes[index] = 1.0;
        
        userData.activeCount++;
        
        bullets.geometry.attributes.position.needsUpdate = true;
        bullets.geometry.attributes.size.needsUpdate = true;
        bullets.geometry.attributes.alpha.needsUpdate = true;
        bullets.geometry.attributes.rotation.needsUpdate = true;
    }
    
    emitExplosion(position, intensity = 1.0) {
        const explosions = this.particles.get('explosions');
        const userData = explosions.userData;
        const count = Math.floor(intensity * 10);
        
        for (let i = 0; i < count && userData.activeCount < this.limits.explosions; i++) {
            const index = userData.activeCount;
            const positions = explosions.geometry.attributes.position.array;
            const sizes = explosions.geometry.attributes.size.array;
            const alphas = explosions.geometry.attributes.alpha.array;
            const rotations = explosions.geometry.attributes.rotation.array;
            const velocities = userData.velocities;
            const lifetimes = userData.lifetimes;
            
            // Position with random spread
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 3 * intensity;
            positions[index * 3] = position.x + Math.cos(angle) * distance;
            positions[index * 3 + 1] = position.y + Math.random() * 2 * intensity;
            positions[index * 3 + 2] = position.z + Math.sin(angle) * distance;
            
            // Size and properties
            sizes[index] = MathUtils.randomRange(0.5, 2.0) * intensity;
            alphas[index] = 1.0;
            rotations[index] = Math.random() * Math.PI * 2;
            
            // Velocity (outward explosion)
            const direction = new THREE.Vector3(
                Math.cos(angle),
                Math.random() * 0.5 + 0.5,
                Math.sin(angle)
            ).normalize();
            const speed = MathUtils.randomRange(5, 15) * intensity;
            velocities[index * 3] = direction.x * speed;
            velocities[index * 3 + 1] = direction.y * speed;
            velocities[index * 3 + 2] = direction.z * speed;
            
            // Lifetime
            lifetimes[index] = MathUtils.randomRange(0.5, 1.5) / intensity;
            
            userData.activeCount++;
        }
        
        explosions.geometry.attributes.position.needsUpdate = true;
        explosions.geometry.attributes.size.needsUpdate = true;
        explosions.geometry.attributes.alpha.needsUpdate = true;
        explosions.geometry.attributes.rotation.needsUpdate = true;
    }
    
    update(deltaTime) {
        const time = this.clock.getElapsedTime();
        
        // Update all particle systems
        this.particles.forEach((particleSystem, type) => {
            const userData = particleSystem.userData;
            const positions = particleSystem.geometry.attributes.position.array;
            const alphas = particleSystem.geometry.attributes.alpha.array;
            const rotations = particleSystem.geometry.attributes.rotation.array;
            const velocities = userData.velocities;
            const lifetimes = userData.lifetimes;
            
            let activeCount = 0;
            
            for (let i = 0; i < userData.activeCount; i++) {
                // Update lifetime
                lifetimes[i] -= deltaTime;
                
                if (lifetimes[i] <= 0) {
                    continue; // Skip this particle
                }
                
                // Update position
                positions[i * 3] += velocities[i * 3] * deltaTime;
                positions[i * 3 + 1] += velocities[i * 3 + 1] * deltaTime;
                positions[i * 3 + 2] += velocities[i * 3 + 2] * deltaTime;
                
                // Update alpha based on lifetime
                const lifeRatio = lifetimes[i] / (type === 'smoke' ? 3 : 1.5);
                alphas[i] = MathUtils.clamp(lifeRatio, 0, 1);
                
                // Update rotation
                rotations[i] += deltaTime * 2;
                
                // Apply gravity to some particles
                if (type === 'smoke' || type === 'fire') {
                    velocities[i * 3 + 1] -= 2 * deltaTime; // Gravity
                }
                
                // Move active particle to current position
                if (activeCount !== i) {
                    positions[activeCount * 3] = positions[i * 3];
                    positions[activeCount * 3 + 1] = positions[i * 3 + 1];
                    positions[activeCount * 3 + 2] = positions[i * 3 + 2];
                    alphas[activeCount] = alphas[i];
                    rotations[activeCount] = rotations[i];
                    velocities[activeCount * 3] = velocities[i * 3];
                    velocities[activeCount * 3 + 1] = velocities[i * 3 + 1];
                    velocities[activeCount * 3 + 2] = velocities[i * 3 + 2];
                    lifetimes[activeCount] = lifetimes[i];
                }
                
                activeCount++;
            }
            
            userData.activeCount = activeCount;
            
            // Update geometry
            particleSystem.geometry.attributes.position.needsUpdate = true;
            particleSystem.geometry.attributes.alpha.needsUpdate = true;
            particleSystem.geometry.attributes.rotation.needsUpdate = true;
        });
        
        // Update shader uniforms
        this.particles.forEach(particleSystem => {
            if (particleSystem.material.uniforms.time) {
                particleSystem.material.uniforms.time.value = time;
            }
        });
    }
    
    dispose() {
        this.particles.forEach(particleSystem => {
            this.scene.remove(particleSystem);
            particleSystem.geometry.dispose();
            particleSystem.material.dispose();
        });
        
        this.textures.forEach(texture => {
            texture.dispose();
        });
        
        this.particles.clear();
        this.textures.clear();
    }
}
