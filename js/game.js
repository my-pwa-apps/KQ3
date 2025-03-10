import { ManannanSystem } from './systems/manannan-system.js';
import { ModelBuilder } from './builders/model-builder.js';
import { InteractionSystem } from './systems/interaction-system.js';
import { RoomBuilder } from './builders/room-builder.js';

class Game {
    constructor() {
        this.init().catch(console.error);
    }

    async init() {
        try {
            this.canvas = document.getElementById("renderCanvas");
            this.engine = new BABYLON.Engine(this.canvas, true);
            this.scene = await this.createScene();
            
            this.engine.runRenderLoop(() => this.scene.render());
            window.addEventListener("resize", () => this.engine.resize());
        } catch (error) {
            console.error("Failed to initialize game:", error);
        }
    }

    async createScene() {
        const scene = new BABYLON.Scene(this.engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

        try {
            // Basic scene setup
            const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 1.6, 0), scene);
            camera.attachControl(this.canvas, true);
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
            
            // Initialize XR first
            const xrHelper = await this.setupVR(scene);
            
            // Initialize systems after XR
            this.modelBuilder = new ModelBuilder(scene);
            this.interactionSystem = new InteractionSystem(scene, xrHelper);
            this.manannanSystem = new ManannanSystem(scene, this.modelBuilder);
            
            await RoomBuilder.createRoom(scene);
            
            return scene;
        } catch (error) {
            console.error("Failed to create scene:", error);
            throw error;
        }
    }

    async setupVR(scene) {
        try {
            const xrHelper = await scene.createDefaultXRExperienceAsync({
                floorMeshes: [scene.getMeshByName("floor")],
                optionalFeatures: true
            });

            return xrHelper;
        } catch (error) {
            console.warn("WebXR not available:", error);
            return null;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => new Game());
