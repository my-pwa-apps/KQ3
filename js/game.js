import { ManannanSystem } from './systems/manannan-system.js';
import { ModelBuilder } from './builders/model-builder.js';
import { InteractionSystem } from './systems/interaction-system.js';

class Game {
    constructor() {
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = this.createScene();
        
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    createScene() {
        const scene = new BABYLON.Scene(this.engine);
        
        // Camera
        const camera = new BABYLON.WebXRCamera("camera", scene);
        
        // Lighting
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        
        // Initialize systems
        this.modelBuilder = new ModelBuilder(scene);
        this.interactionSystem = new InteractionSystem(scene);
        this.manannanSystem = new ManannanSystem(scene, this.modelBuilder);
        
        // Create room
        this.createRoom(scene);
        
        // Setup VR
        this.setupVR(scene);
        
        return scene;
    }

    async createRoom(scene) {
        // Create walls
        const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
        wallMat.diffuseTexture = new BABYLON.Texture("assets/textures/wall.jpg");
        
        const walls = [
            {pos: [0, 2, -6], rot: [0, 0, 0]},
            {pos: [0, 2, 6], rot: [0, Math.PI, 0]},
            {pos: [-6, 2, 0], rot: [0, Math.PI/2, 0]},
            {pos: [6, 2, 0], rot: [0, -Math.PI/2, 0]}
        ];

        walls.forEach(wall => {
            const wallMesh = BABYLON.MeshBuilder.CreateBox("wall", {
                width: 12, height: 4, depth: 0.1
            }, scene);
            wallMesh.position = new BABYLON.Vector3(...wall.pos);
            wallMesh.rotation = new BABYLON.Vector3(...wall.rot);
            wallMesh.material = wallMat;
        });
    }

    async setupVR(scene) {
        const xr = await scene.createDefaultXRExperienceAsync({
            floorMeshes: [this.ground]
        });
        
        this.xr = xr;
    }
}

// Start the game
new Game();
