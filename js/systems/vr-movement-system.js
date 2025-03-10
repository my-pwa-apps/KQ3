export class VRMovementSystem {
    constructor(scene, xrHelper) {
        this.scene = scene;
        this.xrHelper = xrHelper;
        this.movementSpeed = 0.1;
        this.rotationSpeed = 0.05;  // For snap turning
        this.lastUpdateTime = 0;
        
        if (xrHelper) {
            this.setupVRMovement();
        }
    }
    
    dispose() {
        // Clean up any resources or listeners here
    }
    
    setupVRMovement() {
        if (!this.xrHelper) return;
        
        this.xrHelper.baseExperience.onStateChangedObservable.add((state) => {
            if (state === BABYLON.WebXRState.IN_XR) {
                this.setupControllers();
            }
        });
    }
    
    setupControllers() {
        this.xrHelper.input.onControllerAddedObservable.add((controller) => {
            controller.onMotionControllerInitObservable.add((motionController) => {
                const handedness = motionController.handness || motionController.handedness;
                
                if (handedness === 'left') {
                    this.setupMovementControls(motionController);
                } else if (handedness === 'right') {
                    this.setupTurningControls(motionController);
                }
            });
        });
    }
    
    setupMovementControls(motionController) {
        const thumbstick = motionController.getComponent('xr-standard-thumbstick');
        if (!thumbstick) return;
        
        thumbstick.onAxisValueChangedObservable.add((axes) => {
            const now = Date.now();
            // Limit updates for better performance (every 16ms = ~60fps)
            if (now - this.lastUpdateTime < 16) return;
            this.lastUpdateTime = now;
            
            this.handleMovement(axes);
        });
    }
    
    setupTurningControls(motionController) {
        const thumbstick = motionController.getComponent('xr-standard-thumbstick');
        if (!thumbstick) return;
        
        let lastX = 0;
        let snapTurnEnabled = true;
        
        thumbstick.onAxisValueChangedObservable.add((axes) => {
            // Handle snap turning (right thumbstick)
            if (Math.abs(axes.x) > 0.7 && Math.abs(lastX) < 0.3 && snapTurnEnabled) {
                this.snapTurn(axes.x > 0 ? 1 : -1);
                snapTurnEnabled = false;
                setTimeout(() => { snapTurnEnabled = true; }, 250);  // Cooldown
            }
            lastX = axes.x;
        });
    }
    
    handleMovement(axes) {
        if (!this.xrHelper.baseExperience.camera) return;
        
        const camera = this.xrHelper.baseExperience.camera;
        
        // Skip small movements to prevent drift
        if (Math.abs(axes.x) < 0.1 && Math.abs(axes.y) < 0.1) return;
        
        // Get movement directions relative to camera orientation
        const cameraDirection = this.getCameraForwardVector(camera);
        const cameraRight = this.getCameraRightVector(camera);
        
        // Calculate movement vector
        const movement = new BABYLON.Vector3();
        
        if (Math.abs(axes.y) > 0.1) {
            movement.addInPlace(cameraDirection.scale(axes.y * this.movementSpeed));
        }
        
        if (Math.abs(axes.x) > 0.1) {
            movement.addInPlace(cameraRight.scale(axes.x * this.movementSpeed));
        }
        
        // Check for collisions before moving
        if (this.checkCollision(camera.position, movement)) {
            return;
        }
        
        // Apply movement
        camera.position.addInPlace(movement);
    }
    
    snapTurn(direction) {
        if (!this.xrHelper.baseExperience.camera) return;
        
        const camera = this.xrHelper.baseExperience.camera;
        // Apply 45-degree snap turn
        const rotation = Math.PI / 4 * direction;
        this.xrHelper.baseExperience.rotateByQuaternionToRef(
            BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), rotation),
            camera.absoluteRotation
        );
    }
    
    getCameraForwardVector(camera) {
        const forward = camera.getDirection(BABYLON.Vector3.Forward());
        forward.y = 0;  // Keep movement on ground plane
        if (forward.length() < 0.1) return new BABYLON.Vector3(0, 0, 1);
        forward.normalize();
        return forward;
    }
    
    getCameraRightVector(camera) {
        const right = camera.getDirection(BABYLON.Vector3.Right());
        right.y = 0;
        if (right.length() < 0.1) return new BABYLON.Vector3(1, 0, 0);
        right.normalize();
        return right;
    }
    
    checkCollision(position, movement) {
        // Simple ray-based collision detection
        const ray = new BABYLON.Ray(position, movement.normalize(), movement.length() * 1.2);
        const hit = this.scene.pickWithRay(ray, (mesh) => {
            // Only check collision with walls and large objects
            return mesh.checkCollisions && 
                   mesh.name.includes("wall") || 
                   mesh.name.includes("table");
        });
        
        return hit.hit;
    }
}
