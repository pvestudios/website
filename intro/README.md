# PVE Studios - Interactive Intro

A lightweight, production-ready, mobile-aware interactive WebGL intro built with Three.js.

## Features

- **Third-person character** running through a trench under fire
- **Luminescent interdimensional portal** with custom shaders
- **Particle systems** for smoke, fire, bullets, and explosions
- **Mobile-aware controls** with touch support
- **Gesture-gated audio** with ambient sounds and SFX
- **Accessibility support** with reduced motion fallbacks
- **Performance optimization** for desktop and mobile

## Quick Start

1. **Start the server:**
   ```bash
   python3 server.py
   ```

2. **Open your browser:**
   ```
   http://localhost:8000
   ```

3. **Controls:**
   - **Desktop:** Hold ↑ or W to move forward
   - **Mobile:** Tap and hold the ↑ button
   - **Skip:** Click "Skip Intro" or press Enter/Space when focused

## File Structure

```
intro/
├── index.html              # Main HTML file
├── css/
│   ├── base.css            # Base styles and UI
│   └── intro.css           # Intro-specific animations
├── js/
│   ├── three.module.min.js # Three.js library
│   ├── loaders/            # GLTF and DRACO loaders
│   ├── intro.js            # Main application
│   ├── particles.js        # Particle systems
│   ├── portal-shader.js    # Custom shaders
│   ├── audio.js            # Audio management
│   └── utils.js            # Utility functions
├── assets/
│   ├── models/             # 3D models (GLB files)
│   ├── textures/           # Textures and sprites
│   ├── sfx/                # Audio files
│   └── ui/                 # UI assets
└── server.py               # Development server
```

## Integration

The intro dispatches a custom event when complete:

```javascript
window.addEventListener('intro:complete', () => {
    // Your code here
    console.log('Intro completed!');
});

// Or use the callback
window.onIntroComplete = () => {
    console.log('Intro completed via callback!');
};
```

## Performance

- **Desktop:** 55-60 FPS target
- **Mobile:** 28-35 FPS target
- **Bundle size:** < 4.5 MB gzipped
- **Memory:** Stable, no leaks

## Browser Support

- **WebGL 1.0** required
- **ES6 modules** required
- **AudioContext** for sound
- **Touch events** for mobile

## Accessibility

- **Reduced motion** support
- **Keyboard navigation**
- **Screen reader** friendly
- **High contrast** mode support

## Development

The intro uses procedural assets for demo purposes. In production, replace with:

- **Character models:** Mixamo GLB files
- **Environment:** Custom trench models
- **Textures:** High-quality PBR textures
- **Audio:** Professional SFX library

## License

Built for PVE Studios. All rights reserved.
