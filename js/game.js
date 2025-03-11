import * as CANNON from "../../libs/cannon/build/cannon.min.js";
window.CANNON = CANNON;

import { ManannanSystem } from './systems/manannan-system.js';
import { ModelBuilder } from './builders/model-builder.js';
import { InteractionSystem } from './systems/interaction-system.js';
import { RoomBuilder } from './builders/room-builder.js';
import { NavigationSystem } from './systems/navigation-system.js';
import { InventorySystem } from './systems/inventory-system.js';
import { CatSystem } from './systems/cat-system.js';
import { VRMovementSystem } from './systems/vr-movement-system.js';
import { ItemBuilder } from './builders/item-builder.js';

class Game {
    constructor() {
        this.systems = [];
        this.init().catch(this.handleError);
    }

    handleError(error) {
        console.error("Game error:", error);
        document.body.innerHTML = `<div style="color:white;background:rgba(0,0,0,0.7);padding:20px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">
            <h2>An error occurred</h2>
            <p>${error.message || error}</p>
            <button onclick="location.reload()">Reload</button>
        </div>`;
    }

    async init() {
        try {
            this.canvas = document.getElementById("renderCanvas");
            this.engine = new BABYLON.Engine(this.canvas, true, { 
                stencil: true,
                adaptToDeviceRatio: true,
                powerPreference: "high-performance"
            });
            
            this.scene = await this.createScene();
            
            this.engine.runRenderLoop(() => this.scene.render());
            window.addEventListener("resize", () => this.engine.resize());
            window.addEventListener("beforeunload", () => this.cleanup());
        } catch (error) {
            this.handleError(error);
        }
    }

    async createScene() {
        const scene = new BABYLON.Scene(this.engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
        
        // TEMPORARILY DISABLED PHYSICS
        // const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
        // const physicsPlugin = new BABYLON.CannonJSPlugin(true, 10);
        // scene.enablePhysics(gravityVector, physicsPlugin);
        
        const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 1.6, 0), scene);
        camera.attachControl(this.canvas, true);
        camera.speed = 0.15;
        camera.keysUp    = [87,38];
        camera.keysDown  = [83,40];
        camera.keysLeft  = [65,37];
        camera.keysRight = [68,39];
        camera.checkCollisions = true;
        camera.ellipsoid = new BABYLON.Vector3(0.5, 0.9, 0.5);
        
        scene.collisionsEnabled = true;
        scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0,1,0), scene);
        
        // Initialize WebXR first
        const xrHelper = await this.setupVR(scene);
        
        // Initialize builders and systems
        this.modelBuilder = new ModelBuilder(scene);
        scene.modelBuilder = this.modelBuilder;
        
        // Add item builder for KQ3 items (no physics)
        this.itemBuilder = new ItemBuilder(scene);
        scene.itemBuilder = this.itemBuilder;

        // Create rooms and systems
        await RoomBuilder.createRoom(scene);
        
        // Add systems and store references for cleanup
        this.addSystem(new InteractionSystem(scene, xrHelper));
        this.addSystem(new InventorySystem(scene));
        this.addSystem(new CatSystem(scene, this.modelBuilder));
        this.addSystem(new NavigationSystem(scene, camera));
        this.addSystem(new VRMovementSystem(scene, xrHelper));
        this.addSystem(new ManannanSystem(scene, this.modelBuilder));
            
        return scene;
    }
    
    addSystem(system) {
        if(system) { this.systems.push(system); }
    }

    async setupVR(scene) {
        try {
            const xrHelper = await scene.createDefaultXRExperienceAsync({
                floorMeshes: [scene.getMeshByName("mainHall_floor")],
                uiOptions: { sessionMode: 'immersive-vr', referenceSpaceType: 'local-floor' },
                optionalFeatures: true
            });
            
            if(xrHelper && xrHelper.baseExperience) {
                xrHelper.baseExperience.onStateChangedObservable.add((state) => {
                    if(state === BABYLON.WebXRState.NOT_IN_XR){
                        console.log("XR session ended");
                    }
                });
            }
            
            return xrHelper;
        } catch(error) {
            console.warn("WebXR initialization failed:", error);
            return null;
        }
    }
    
    cleanup() {
        this.systems.forEach(system => { if(system && typeof system.dispose === 'function') system.dispose(); });
        this.systems = [];
        
        if(this.scene) this.scene.dispose();
        if(this.engine) this.engine.dispose();
    }
}

window.addEventListener('DOMContentLoaded', ()=> new Game());
