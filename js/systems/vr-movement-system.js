export class VRMovementSystem {
    constructor(scene, xrHelper) {
        this.scene = scene;
        this.xrHelper = xrHelper;
        this.movementSpeed = 0.05; // Reduced speed for better control
        this.rotationSpeed = 0.05;
        this.lastUpdateTime = 0;
        this.movementThreshold = 0.15; // Increased threshold to prevent drift
        
        if (xrHelper) {
            this.setupVRMovement();
        }
    }

    handleThumbstickMovement(axes, controller) {
        if (!this.xrHelper?.baseExperience?.camera) return;
        
        // Throttle updates for performance
        const now = performance.now();
        if (now - this.lastUpdateTime < 16) return; // ~60fps
        this.lastUpdateTime = now;
        
        const camera = this.xrHelper.baseExperience.camera;
        
        // Skip small movements (fixes drift issue)
        if (Math.abs(axes.x) < this.movementThreshold && 
            Math.abs(axes.y) < this.movementThreshold) return;
        
        // Better movement vector calculation
        const cameraDirection = camera.getDirection(BABYLON.Vector3.Forward());
        cameraDirection.y = 0; // Keep movement on ground plane
        
        if (cameraDirection.length() < 0.1) return; // Avoid normalization errors
        cameraDirection.normalize();
        
        const cameraRight = BABYLON.Vector3.Cross(cameraDirection, BABYLON.Vector3.Up());
        cameraRight.normalize();
        
        // Fixed movement direction (inverted Y-axis)
        const movement = new BABYLON.Vector3();
        movement.addInPlace(cameraDirection.scale(-axes.y * this.movementSpeed));
        movement.addInPlace(cameraRight.scale(axes.x * this.movementSpeed));
        
        // Apply movement with collision check
        if (this.checkCollision(camera.position, movement)) {
            return; // Don't move if collision detected
        }
        
        camera.position.addInPlace(movement);
    }
    
    checkCollision(position, movement) {
        // Simple ray-based collision detection
        const ray = new BABYLON.Ray(
            position, 
            movement.normalize(), 
            movement.length() * 1.2
        );
        
        const hit = this.scene.pickWithRay(ray, mesh => {
            return mesh.name.includes("wall") || 
                  mesh.name.includes("furniture");
        });
        
        return hit.hit;
    }
    
    dispose() {
        // Cleanup any resources
    }
}
