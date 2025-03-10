export class NavigationSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.teleportPoints = [];
        
        this.setupNavigationPoints();
        this.setupTeleportUI();
    }
    
    setupNavigationPoints() {
        // Define teleport points between rooms
        this.addTeleportPoint("main_to_kitchen", new BABYLON.Vector3(0, 0, 5), "To Kitchen");
        this.addTeleportPoint("kitchen_to_main", new BABYLON.Vector3(0, 0, -5), "To Main Hall", new BABYLON.Vector3(0, 0, 10));
        this.addTeleportPoint("main_to_study", new BABYLON.Vector3(-5, 0, 0), "To Study");
        this.addTeleportPoint("study_to_main", new BABYLON.Vector3(5, 0, 0), "To Main Hall", new BABYLON.Vector3(-10, 0, 0));
        this.addTeleportPoint("main_to_upstairs", new BABYLON.Vector3(4, 0, -3), "Upstairs");
    }
    
    addTeleportPoint(id, position, label, origin = null) {
        // Create marker for teleport
        const point = BABYLON.MeshBuilder.CreateCylinder(id, {
            height: 0.1, 
            diameter: 0.5
        }, this.scene);
        
        point.position = position;
        if (origin) {
            point.position.addInPlace(origin);
        }
        point.material = new BABYLON.StandardMaterial(id + "_mat", this.scene);
        point.material.diffuseColor = new BABYLON.Color3(0, 0.7, 1);
        point.material.alpha = 0.6;
        
        // Add hover effect
        point.actionManager = new BABYLON.ActionManager(this.scene);
        point.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                () => {
                    point.material.emissiveColor = new BABYLON.Color3(0.2, 0.5, 1);
                    this.showLabel(point, label);
                }
            )
        );
        
        point.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                () => {
                    point.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
                    this.hideLabel();
                }
            )
        );
        
        // Add click action
        point.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                    this.teleportToDestination(id);
                }
            )
        );
        
        this.teleportPoints.push({ id, mesh: point });
    }
    
    setupTeleportUI() {
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.textBlock = new BABYLON.GUI.TextBlock();
        this.textBlock.color = "white";
        this.textBlock.fontSize = 24;
        this.textBlock.outlineWidth = 1;
        this.textBlock.outlineColor = "black";
        
        advancedTexture.addControl(this.textBlock);
        this.textBlock.isVisible = false;
        
        this.advancedTexture = advancedTexture;
    }
    
    showLabel(mesh, text) {
        this.textBlock.text = text;
        this.textBlock.isVisible = true;
    }
    
    hideLabel() {
        this.textBlock.isVisible = false;
    }
    
    teleportToDestination(id) {
        switch(id) {
            case "main_to_kitchen":
                this.camera.position = new BABYLON.Vector3(0, 1.6, 6);
                break;
            case "kitchen_to_main":
                this.camera.position = new BABYLON.Vector3(0, 1.6, 4);
                break;
            case "main_to_study":
                this.camera.position = new BABYLON.Vector3(-6, 1.6, 0);
                break;
            case "study_to_main":
                this.camera.position = new BABYLON.Vector3(-4, 1.6, 0);
                break;
            case "main_to_upstairs":
                // Teleport upstairs - we would add the second floor coordinates here
                this.showMessage("Second floor not yet implemented");
                break;
        }
    }
    
    showMessage(text) {
        const textBlock = new BABYLON.GUI.TextBlock();
        textBlock.text = text;
        textBlock.color = "white";
        textBlock.fontSize = 24;
        textBlock.outlineWidth = 1;
        textBlock.outlineColor = "black";
        
        this.advancedTexture.addControl(textBlock);
        
        setTimeout(() => {
            this.advancedTexture.removeControl(textBlock);
        }, 3000);
    }
}
