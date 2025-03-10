export class InteractionSystem {
    constructor(scene, xrHelper) {
        this.scene = scene;
        this.xrHelper = xrHelper;
        this.laserPointers = {};
        
        this.setupMouseInteraction();
        
        if (xrHelper) {
            this.setupVRInteraction();
        }
    }
    
    dispose() {
        Object.values(this.laserPointers).forEach(pointer => {
            if (pointer && pointer.dispose) pointer.dispose();
        });
    }
    
    setupMouseInteraction() {
        if (!this.scene) return;
        
        // Use single observer pattern for better performance
        this.scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                const pickResult = this.scene.pick(
                    this.scene.pointerX, 
                    this.scene.pointerY,
                    (mesh) => mesh.isPickable && mesh.isEnabled()
                );
                
                if (pickResult.hit) {
                    this.handleMeshPick(pickResult.pickedMesh);
                }
            }
        });
    }
    
    setupVRInteraction() {
        if (!this.xrHelper || !this.xrHelper.baseExperience) return;
        
        this.xrHelper.baseExperience.onStateChangedObservable.add((state) => {
            if (state === BABYLON.WebXRState.IN_XR) {
                this.setupVRControllers();
            }
        });
    }
    
    setupVRControllers() {
        this.xrHelper.input.onControllerAddedObservable.add((controller) => {
            // Identify right controller for interaction
            controller.onMotionControllerInitObservable.add((motionController) => {
                const handedness = motionController.handness || motionController.handedness;
                
                if (handedness === 'right') {
                    this.setupLaserPointer(controller);
                    this.setupTriggerInteraction(controller, motionController);
                }
            });
        });
        
        // Cleanup on controller removal
        this.xrHelper.input.onControllerRemovedObservable.add((controller) => {
            if (this.laserPointers[controller.uniqueId]) {
                this.laserPointers[controller.uniqueId].dispose();
                delete this.laserPointers[controller.uniqueId];
            }
        });
    }
    
    setupTriggerInteraction(controller, motionController) {
        const triggerComponent = motionController.getComponent('xr-standard-trigger');
        
        if (triggerComponent) {
            triggerComponent.onButtonStateChangedObservable.add((component) => {
                if (component.pressed) {
                    this.performVRRaycast(controller);
                }
            });
        }
        
        // Also add squeeze interaction as alternative
        const squeezeComponent = motionController.getComponent('xr-standard-squeeze');
        if (squeezeComponent) {
            squeezeComponent.onButtonStateChangedObservable.add((component) => {
                if (component.pressed) {
                    this.performVRRaycast(controller);
                }
            });
        }
    }
    
    performVRRaycast(controller) {
        // Create picking ray from controller
        const ray = new BABYLON.Ray();
        controller.getWorldPointerRayToRef(ray);
        
        // Use fast ray casting with specific predicate for better performance
        const pickInfo = this.scene.pickWithRay(ray, (mesh) => {
            return mesh.isPickable && mesh.isEnabled() && !mesh.name.includes("laserPointer");
        });
        
        if (pickInfo.hit && pickInfo.pickedMesh) {
            this.handleMeshPick(pickInfo.pickedMesh);
            
            // Visual feedback
            this.showPickFeedback(pickInfo.pickedPoint);
        }
    }
    
    handleMeshPick(mesh) {
        // Check for direct metadata or parent object's metadata
        const metadata = mesh.metadata || 
                        (mesh.parent && mesh.parent.metadata);
        
        if (metadata && metadata.isPickable) {
            const event = new CustomEvent('itemPicked', { 
                detail: { 
                    itemType: metadata.type, 
                    mesh: mesh.parent || mesh
                }
            });
            document.dispatchEvent(event);
        }
    }
    
    showPickFeedback(position) {
        if (!position) return;
        
        // Create particle burst at pick location
        const particleSystem = new BABYLON.ParticleSystem("pickFeedback", 20, this.scene);
        particleSystem.particleTexture = new BABYLON.Texture("assets/textures/spark.png", this.scene);
        particleSystem.emitter = position;
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);
        
        particleSystem.color1 = new BABYLON.Color4(1, 1, 0, 1);
        particleSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1);
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.1;
        particleSystem.minLifeTime = 0.2;
        particleSystem.maxLifeTime = 0.4;
        particleSystem.emitRate = 100;
        particleSystem.gravity = new BABYLON.Vector3(0, -9.8, 0);
        
        particleSystem.start();
        
        // Auto-dispose after short effect
        setTimeout(() => {
            particleSystem.stop();
            setTimeout(() => particleSystem.dispose(), 500);
        }, 300);
    }
    
    setupLaserPointer(controller) {
        // Create optimized laser pointer with dynamic length
        const laserPointer = BABYLON.MeshBuilder.CreateCylinder(
            `laserPointer_${controller.uniqueId}`, 
            { height: 1, diameter: 0.01, tessellation: 8, updatable: true },
            this.scene
        );
        
        // Use emissive material for better visibility
        const laserMaterial = new BABYLON.StandardMaterial(`laserMat_${controller.uniqueId}`, this.scene);
        laserMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
        laserMaterial.disableLighting = true;
        laserMaterial.alpha = 0.7;
        laserPointer.material = laserMaterial;
        
        // Position and orient laser
        laserPointer.rotation.x = Math.PI / 2;
        laserPointer.position.z = 0.5; // Start at half-length
        laserPointer.parent = controller.grip || controller;
        
        // Store reference for disposal
        this.laserPointers[controller.uniqueId] = laserPointer;
        
        // Add raycast observer to dynamically adjust pointer length
        this.scene.onBeforeRenderObservable.add(() => {
            this.updateLaserPointer(controller, laserPointer);
        });
        
        return laserPointer;
    }
    
    updateLaserPointer(controller, laserPointer) {
        if (!controller.active || !laserPointer) return;
        
        const ray = new BABYLON.Ray();
        controller.getWorldPointerRayToRef(ray);
        
        const pickInfo = this.scene.pickWithRay(ray, (mesh) => {
            return mesh.isVisible && mesh !== laserPointer && 
                  !mesh.name.includes("laserPointer");
        });
        
        // Adjust laser length based on hit distance
        const distance = pickInfo.hit ? 
                        pickInfo.distance : 
                        5; // Default length
        
        // Update scale to match distance
        laserPointer.scaling.y = distance;
        laserPointer.position.z = distance / 2;
        
        // Highlight pickable objects
        if (pickInfo.hit && pickInfo.pickedMesh) {
            const metadata = pickInfo.pickedMesh.metadata || 
                           (pickInfo.pickedMesh.parent && pickInfo.pickedMesh.parent.metadata);
            
            if (metadata && metadata.isPickable) {
                laserMaterial.emissiveColor = new BABYLON.Color3(0, 1, 0);
            } else {
                laserMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
            }
        } else {
            laserMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
        }
    }
}
