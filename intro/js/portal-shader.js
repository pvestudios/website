// Portal shader with radial swirl and starfield
import * as THREE from './three.module.min.js';

export const PortalShader = {
    uniforms: {
        time: { value: 0.0 },
        intensity: { value: 1.0 },
        starfieldTexture: { value: null },
        color1: { value: new THREE.Color(0x00ff88) }, // Neon green
        color2: { value: new THREE.Color(0x00ffff) }, // Cyan
        color3: { value: new THREE.Color(0x8800ff) }, // Purple
        innerRadius: { value: 0.3 },
        outerRadius: { value: 0.5 }
    },
    
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    
    fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform sampler2D starfieldTexture;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float innerRadius;
        uniform float outerRadius;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        // Noise function
        float noise(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        // Fractal Brownian Motion
        float fbm(vec2 st) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 0.0;
            
            for (int i = 0; i < 6; i++) {
                value += amplitude * noise(st);
                st *= 2.0;
                amplitude *= 0.5;
            }
            return value;
        }
        
        // Rotate function
        vec2 rotate(vec2 v, float angle) {
            float s = sin(angle);
            float c = cos(angle);
            mat2 m = mat2(c, -s, s, c);
            return m * v;
        }
        
        void main() {
            vec2 uv = vUv;
            
            // Center UV coordinates
            vec2 centeredUv = uv - 0.5;
            float dist = length(centeredUv);
            
            // Check if we're within the portal ring
            if (dist < innerRadius || dist > outerRadius) {
                discard;
            }
            
            // Create radial swirl effect
            float angle = atan(centeredUv.y, centeredUv.x) + time * 2.0;
            vec2 rotatedUv = rotate(centeredUv, angle * 0.5);
            
            // Generate noise pattern
            float noiseValue = fbm(rotatedUv * 3.0 + time * 0.5);
            float swirl = fbm(rotatedUv * 2.0 + time * 1.0);
            
            // Fresnel effect
            vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
            float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDirection), 0.0), 3.0);
            
            // Radial gradient
            float radialGradient = 1.0 - smoothstep(innerRadius, outerRadius, dist);
            
            // Combine effects
            float finalNoise = mix(noiseValue, swirl, 0.5) * radialGradient;
            float finalFresnel = fresnel * radialGradient;
            
            // Color mixing based on noise and time
            float colorMix = sin(time * 2.0 + finalNoise * 10.0) * 0.5 + 0.5;
            vec3 baseColor = mix(color1, color2, colorMix);
            baseColor = mix(baseColor, color3, sin(time * 1.5 + finalNoise * 8.0) * 0.5 + 0.5);
            
            // Sample starfield texture for inner area
            vec2 starfieldUv = centeredUv * 2.0 + 0.5;
            starfieldUv = mod(starfieldUv + time * 0.1, 1.0);
            vec3 starfield = texture2D(starfieldTexture, starfieldUv).rgb;
            
            // Mix starfield with portal colors
            float starfieldMix = smoothstep(innerRadius, innerRadius + 0.1, dist);
            baseColor = mix(starfield, baseColor, starfieldMix);
            
            // Apply fresnel and noise
            baseColor *= (finalFresnel + finalNoise * 0.5);
            
            // Add rim lighting
            float rim = 1.0 - smoothstep(outerRadius - 0.1, outerRadius, dist);
            baseColor += rim * color2 * 0.5;
            
            // Apply intensity
            baseColor *= intensity;
            
            // Add some sparkle
            float sparkle = step(0.95, noise(centeredUv * 20.0 + time * 5.0));
            baseColor += sparkle * vec3(1.0) * 0.3;
            
            gl_FragColor = vec4(baseColor, 1.0);
        }
    `,
    
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
};

// White flash shader for the finish effect
export const WhiteFlashShader = {
    vertex: `
        varying vec2 vUv;
        
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    
    fragment: `
        uniform float opacity;
        uniform float intensity;
        
        varying vec2 vUv;
        
        void main() {
            // Create a radial gradient from center
            vec2 centeredUv = vUv - 0.5;
            float dist = length(centeredUv);
            float radial = 1.0 - smoothstep(0.0, 0.7, dist);
            
            // Add some noise for organic feel
            float noise = fract(sin(dot(centeredUv, vec2(12.9898, 78.233))) * 43758.5453123);
            radial *= (0.8 + noise * 0.2);
            
            vec3 color = vec3(1.0) * radial * intensity;
            gl_FragColor = vec4(color, opacity);
        }
    `,
    
    uniforms: {
        opacity: { value: 0.0 },
        intensity: { value: 1.0 }
    }
};

// Particle shader for smoke and fire effects
export const ParticleShader = {
    vertex: `
        attribute float size;
        attribute float alpha;
        attribute float rotation;
        
        varying float vAlpha;
        varying float vRotation;
        
        void main() {
            vAlpha = alpha;
            vRotation = rotation;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    
    fragment: `
        uniform sampler2D texture;
        uniform float time;
        
        varying float vAlpha;
        varying float vRotation;
        
        void main() {
            vec2 uv = gl_PointCoord;
            
            // Rotate UV coordinates
            float c = cos(vRotation);
            float s = sin(vRotation);
            uv = vec2(
                c * (uv.x - 0.5) - s * (uv.y - 0.5) + 0.5,
                s * (uv.x - 0.5) + c * (uv.y - 0.5) + 0.5
            );
            
            // Sample texture
            vec4 texColor = texture2D(texture, uv);
            
            // Apply circular mask
            float dist = length(uv - 0.5);
            float mask = 1.0 - smoothstep(0.4, 0.5, dist);
            
            // Apply alpha
            float finalAlpha = texColor.a * vAlpha * mask;
            
            gl_FragColor = vec4(texColor.rgb, finalAlpha);
        }
    `,
    
    uniforms: {
        texture: { value: null },
        time: { value: 0.0 }
    }
};
