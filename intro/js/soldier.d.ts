// TypeScript declarations for soldier.js module

import * as THREE from 'three';

export interface SoldierOptions {
    scale?: number;
    helmetColor?: number;
    uniformColor?: number;
    skinColor?: number;
    bootColor?: number;
}

export interface SoldierAnimationOptions {
    speed?: number;
    moving?: boolean;
}

export interface SoldierParts {
    body: THREE.Mesh;
    head: THREE.Mesh;
    helmetCap: THREE.Mesh;
    helmetRim: THREE.Mesh;
    leftArm: THREE.Mesh;
    rightArm: THREE.Mesh;
    leftLeg: THREE.Mesh;
    rightLeg: THREE.Mesh;
    leftBoot: THREE.Mesh;
    rightBoot: THREE.Mesh;
}

export interface SoldierAnimationState {
    time: number;
    isMoving: boolean;
    speed: number;
}

export interface Soldier {
    group: THREE.Group;
    parts: SoldierParts;
    animationState: SoldierAnimationState;
    scale: number;
}

export interface RifleOptions {
    scale?: number;
    color?: number;
}

export function createSoldier(options?: SoldierOptions): Soldier;
export function updateSoldier(soldier: Soldier, deltaTimeSeconds: number, options?: SoldierAnimationOptions): void;
export function createWoundedSoldier(options?: SoldierOptions): Soldier;
export function createRifle(options?: RifleOptions): THREE.Group;
