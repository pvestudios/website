// Low-poly foot soldier module
// Uses only primitives for minimal polycount and no texture dependencies

import * as THREE from './three.module.min.js';

export function createSoldier(options = {}) {
    const {
        scale = 1,
        helmetColor = 0x2ecc71,
        uniformColor = 0x4169E1,
        skinColor = 0xffdbac,
        bootColor = 0x2c3e50
    } = options;

    const group = new THREE.Group();
    const parts = {};

    // Body (main capsule)
    const bodyGeometry = new THREE.CapsuleGeometry(0.3 * scale, 1.2 * scale, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: uniformColor,
        metalness: 0.1,
        roughness: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6 * scale;
    body.castShadow = true;
    group.add(body);
    parts.body = body;

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25 * scale, 8, 6);
    const headMaterial = new THREE.MeshStandardMaterial({ 
        color: skinColor,
        metalness: 0.05,
        roughness: 0.9
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.4 * scale;
    head.castShadow = true;
    group.add(head);
    parts.head = head;

    // Helmet (cap + rim)
    const helmetCapGeometry = new THREE.SphereGeometry(0.28 * scale, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    const helmetCapMaterial = new THREE.MeshStandardMaterial({ 
        color: helmetColor,
        metalness: 0.3,
        roughness: 0.4
    });
    const helmetCap = new THREE.Mesh(helmetCapGeometry, helmetCapMaterial);
    helmetCap.position.y = 1.45 * scale;
    helmetCap.castShadow = true;
    group.add(helmetCap);
    parts.helmetCap = helmetCap;

    // Helmet rim
    const helmetRimGeometry = new THREE.TorusGeometry(0.3 * scale, 0.05 * scale, 4, 8, Math.PI);
    const helmetRimMaterial = new THREE.MeshStandardMaterial({ 
        color: helmetColor,
        metalness: 0.3,
        roughness: 0.4
    });
    const helmetRim = new THREE.Mesh(helmetRimGeometry, helmetRimMaterial);
    helmetRim.position.y = 1.35 * scale;
    helmetRim.rotation.x = Math.PI / 2;
    helmetRim.castShadow = true;
    group.add(helmetRim);
    parts.helmetRim = helmetRim;

    // Arms with proper joint groups
    const armGeometry = new THREE.CapsuleGeometry(0.1 * scale, 0.8 * scale, 4, 6);
    const armMaterial = new THREE.MeshStandardMaterial({ 
        color: skinColor,
        metalness: 0.1,
        roughness: 0.8
    });
    
    // Left arm group (shoulder joint)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.4 * scale, 0.8 * scale, 0);
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(0, -0.4 * scale, 0); // Offset within group
    leftArm.castShadow = true;
    leftArmGroup.add(leftArm);
    group.add(leftArmGroup);
    parts.leftArm = leftArmGroup;
    parts.leftArmMesh = leftArm;
    
    // Right arm group (shoulder joint)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.4 * scale, 0.8 * scale, 0);
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0, -0.4 * scale, 0); // Offset within group
    rightArm.castShadow = true;
    rightArmGroup.add(rightArm);
    group.add(rightArmGroup);
    parts.rightArm = rightArmGroup;
    parts.rightArmMesh = rightArm;

    // Legs with proper joint groups
    const legGeometry = new THREE.CapsuleGeometry(0.12 * scale, 0.8 * scale, 4, 6);
    const legMaterial = new THREE.MeshStandardMaterial({ 
        color: uniformColor,
        metalness: 0.2,
        roughness: 0.7
    });
    
    // Left leg group (hip joint)
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.15 * scale, -0.2 * scale, 0);
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(0, -0.4 * scale, 0); // Offset within group
    leftLeg.castShadow = true;
    leftLegGroup.add(leftLeg);
    group.add(leftLegGroup);
    parts.leftLeg = leftLegGroup;
    parts.leftLegMesh = leftLeg;
    
    // Right leg group (hip joint)
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.15 * scale, -0.2 * scale, 0);
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0, -0.4 * scale, 0); // Offset within group
    rightLeg.castShadow = true;
    rightLegGroup.add(rightLeg);
    group.add(rightLegGroup);
    parts.rightLeg = rightLegGroup;
    parts.rightLegMesh = rightLeg;

    // Boots
    const bootGeometry = new THREE.BoxGeometry(0.25 * scale, 0.15 * scale, 0.4 * scale);
    const bootMaterial = new THREE.MeshStandardMaterial({ 
        color: bootColor,
        metalness: 0.4,
        roughness: 0.6
    });
    
    const leftBoot = new THREE.Mesh(bootGeometry, bootMaterial);
    leftBoot.position.set(-0.15 * scale, -0.5 * scale, 0.1 * scale);
    leftBoot.castShadow = true;
    group.add(leftBoot);
    parts.leftBoot = leftBoot;
    
    const rightBoot = new THREE.Mesh(bootGeometry, bootMaterial);
    rightBoot.position.set(0.15 * scale, -0.5 * scale, 0.1 * scale);
    rightBoot.castShadow = true;
    group.add(rightBoot);
    parts.rightBoot = rightBoot;

    // Animation state
    const animationState = {
        time: 0,
        isMoving: false,
        speed: 0
    };

    return {
        group,
        parts,
        animationState,
        scale
    };
}

export function updateSoldier(soldier, deltaTimeSeconds, options = {}) {
    const { speed = 0, moving = false } = options;
    
    soldier.animationState.isMoving = moving;
    soldier.animationState.speed = speed;
    soldier.animationState.time += deltaTimeSeconds;

    if (moving && speed > 0) {
        // Walking/running animation using sine waves
        const walkCycle = Math.sin(soldier.animationState.time * 8) * 0.3;
        const armSwing = Math.sin(soldier.animationState.time * 8) * 0.4;
        const legLift = Math.sin(soldier.animationState.time * 8 + Math.PI) * 0.2;
        
        // Body bobbing
        soldier.parts.body.position.y = 0.6 * soldier.scale + walkCycle * 0.1;
        
        // Arm swinging (opposite to legs) - animate the joint groups
        soldier.parts.leftArm.rotation.z = armSwing;
        soldier.parts.rightArm.rotation.z = -armSwing;
        
        // Leg movement - animate the joint groups
        soldier.parts.leftLeg.rotation.x = legLift;
        soldier.parts.rightLeg.rotation.x = -legLift;
        
        // Head bobbing (subtle)
        soldier.parts.head.position.y = 1.4 * soldier.scale + walkCycle * 0.05;
        soldier.parts.helmetCap.position.y = 1.45 * soldier.scale + walkCycle * 0.05;
        soldier.parts.helmetRim.position.y = 1.35 * soldier.scale + walkCycle * 0.05;
    } else {
        // Idle pose - reset to default positions
        soldier.parts.body.position.y = 0.6 * soldier.scale;
        soldier.parts.leftArm.rotation.z = 0.3;
        soldier.parts.rightArm.rotation.z = -0.3;
        soldier.parts.leftLeg.rotation.x = 0;
        soldier.parts.rightLeg.rotation.x = 0;
        soldier.parts.head.position.y = 1.4 * soldier.scale;
        soldier.parts.helmetCap.position.y = 1.45 * soldier.scale;
        soldier.parts.helmetRim.position.y = 1.35 * soldier.scale;
    }
}

// Create a wounded soldier variant (static pose)
export function createWoundedSoldier(options = {}) {
    const soldier = createSoldier({
        ...options,
        helmetColor: 0x8B4513, // Brown helmet for wounded
        uniformColor: 0x654321  // Darker uniform
    });
    
    // Position in wounded pose - animate the joint groups
    soldier.parts.body.rotation.x = 0.2; // Slight lean
    soldier.parts.leftArm.rotation.z = -0.5; // Arm down
    soldier.parts.rightArm.rotation.z = 0.5; // Other arm up
    soldier.parts.leftLeg.rotation.x = 0.3; // Leg bent
    soldier.parts.rightLeg.rotation.x = -0.2; // Other leg straight
    
    return soldier;
}

// Create a simple rifle prop
export function createRifle(options = {}) {
    const { scale = 1, color = 0x444444 } = options;
    
    const group = new THREE.Group();
    
    // Rifle body
    const bodyGeometry = new THREE.BoxGeometry(0.05 * scale, 0.05 * scale, 0.8 * scale);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color,
        metalness: 0.8,
        roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.z = 0.4 * scale;
    body.castShadow = true;
    group.add(body);
    
    // Rifle stock
    const stockGeometry = new THREE.BoxGeometry(0.08 * scale, 0.06 * scale, 0.2 * scale);
    const stockMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        metalness: 0.1,
        roughness: 0.8
    });
    const stock = new THREE.Mesh(stockGeometry, stockMaterial);
    stock.position.z = -0.3 * scale;
    stock.castShadow = true;
    group.add(stock);
    
    // Rifle barrel
    const barrelGeometry = new THREE.CylinderGeometry(0.02 * scale, 0.02 * scale, 0.6 * scale, 6);
    const barrelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x666666,
        metalness: 0.9,
        roughness: 0.1
    });
    const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
    barrel.position.z = 0.7 * scale;
    barrel.rotation.x = Math.PI / 2;
    barrel.castShadow = true;
    group.add(barrel);
    
    return group;
}
