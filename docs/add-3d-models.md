## 📸 **Placeholder Images Location:**

### **Landing Page Images:**
- **`/public/logo-glow.png`** - Main logo (512×512 recommended)
- **`/public/og-image.png`** - Social media preview image (1200×630 recommended)

### **Intro Assets:**
- **`/intro/assets/ui/logo-glow.png`** - Logo used in the intro
- **`/intro/assets/models/`** - **EMPTY** - This is where you add 3D models
- **`/intro/assets/textures/`** - **EMPTY** - This is where you add textures
- **`/intro/assets/sfx/`** - **EMPTY** - This is where you add sound effects

## �� **Adding Custom 3D Objects to the Intro:**

The intro currently uses **procedural geometry** (created in code) rather than loaded 3D models. Here's how to add your custom 3D objects:

### **1. Supported 3D Model Formats:**
- **`.glb`** (recommended - single file, compressed)
- **`.gltf`** (JSON + separate files)

### **2. Where to Place Your Models:**
```
intro/assets/models/
├── your-character.glb
├── environment.glb
├── weapons.glb
└── props.glb
```

### **3. How to Load Custom Models:**

The intro has an `AssetLoader` utility ready to use. Here's how to load your custom 3D models:

**Example in `intro/js/intro.js` or create a new file:**

```javascript
import { AssetLoader } from './utils.js';

// Load a custom character model
async function loadCustomCharacter() {
    try {
        const gltf = await AssetLoader.loadGLTF('./assets/models/your-character.glb');
        const character = gltf.scene;
        
        // Scale and position the model
        character.scale.set(1, 1, 1);
        character.position.set(0, 0, 0);
        
        // Add to your scene
        scene.add(character);
        
        return character;
    } catch (error) {
        console.error('Failed to load character model:', error);
        // Fallback to procedural soldier
        return createSoldier();
    }
}

// Load environment models
async function loadEnvironment() {
    try {
        const gltf = await AssetLoader.loadGLTF('./assets/models/trench-environment.glb');
        const environment = gltf.scene;
        environment.position.set(0, 0, 0);
        scene.add(environment);
        return environment;
    } catch (error) {
        console.error('Failed to load environment:', error);
    }
}
```

### **4. Integration Points:**

**Replace the procedural soldier** in `intro/js/soldier.js`:
- Currently creates soldiers using basic geometry
- You can replace `createSoldier()` calls with your custom model loader

**Add environment models** in `intro/js/intro.js`:
- Look for the scene setup section
- Add your environment models after the basic scene is created

### **5. Model Optimization Tips:**

- **Keep poly count low** for mobile performance
- **Use compressed textures** (WebP, KTX2)
- **Enable DRACO compression** for geometry
- **Test on mobile devices** for performance

### **6. Current Asset Structure:**
```
intro/assets/
├── models/          ← Add your .glb/.gltf files here
├── textures/        ← Add custom textures here  
├── sfx/            ← Add sound effects here
└── ui/             ← UI elements (logo, etc.)
```

The intro is designed to be **mobile-first** and **performance-optimized**, so make sure your 3D models are optimized for web delivery! 🚀