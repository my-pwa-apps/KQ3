export class CatSystem {
    constructor(scene, modelBuilder) {
        this.scene = scene;
        this.modelBuilder = modelBuilder;
        this.waypoints = this.createWaypoints();
        this.currentWaypoint = 0;
        this.isMoving = false;
        this.walkCycle = 0;
        this.walkingSpeed = 0.005; // Slower for smoother movement
        this.walkingHeight = 0.03;
        this.updateObserver = null;
        
        this.setupCat();
    }
    
    dispose() {
        if (this.updateObserver) {
            this.scene.onBeforeRenderObservable.remove(this.updateObserver);
            this.updateObserver = null;
        }
    }
    
    setupCat() {
        try {
            this.cat = this.modelBuilder.createCat();
            this.cat.position = new BABYLON.Vector3(2, 0.2, 2);
            
            // Register animation update
            this.updateObserver = this.scene.onBeforeRenderObservable.add(() => {
                this.updateCatAnimation();
            });
            
            // Start cat behavior cycle
            this.startCatBehavior();
        } catch (error) {
            console.error("Failed to setup cat:", error);
        }
    }
    
    updateCatAnimation() {
        if (!this.isMoving || !this.cat) return;
        
        // Animate walking cycle with walk bounce
        this.walkCycle += 0.05;
        const heightOffset = Math.abs(Math.sin(this.walkCycle)) * this.walkingHeight;
        this.cat.position.y = 0.2 + heightOffset;
        
        // Subtle head bob for more natural movement
        this.cat.rotation.z = Math.sin(this.walkCycle) * 0.05;
    }
    
    moveCatToWaypoint(waypointIndex) {
        if (!this.cat || !this.waypoints || waypointIndex >= this.waypoints.length) return;
        
        const targetPosition = this.waypoints[waypointIndex];
        const currentPosition = this.cat.position.clone();
        currentPosition.y = 0.2; // Base height without bounce
        
        // Get direction to target
        const direction = targetPosition.subtract(currentPosition);
        const distance = direction.length();
        
        if (distance > 0.1) {
            this.isMoving = true;
            
            // Calculate natural movement with proper rotation
            const angle = Math.atan2(direction.x, direction.z);
            this.cat.rotation.y = angle;
            
            // Use lerp for smooth movement
            const moveSpeed = Math.min(this.walkingSpeed * (60 / this.scene.getEngine().getFps()), 0.01);
            const newPosition = BABYLON.Vector3.Lerp(currentPosition, targetPosition, moveSpeed);
            
            // Keep Y position handled by animation
            newPosition.y = this.cat.position.y;
            this.cat.position = newPosition;
            
            // Check if we've arrived at target
            if (currentPosition.subtract(targetPosition).length() < 0.2) {
                this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
                this.isMoving = false;
                this.catSitAndGroom();
            }
        } else {
            this.isMoving = false;
        }
    }
    
    createWaypoints() {
        return [
            new BABYLON.Vector3(2, 0, 2),     // Main hall center
            new BABYLON.Vector3(-3, 0, -3),   // Near fireplace
            new BABYLON.Vector3(-8, 0, 0),    // Study entrance
            new BABYLON.Vector3(-12, 0, -4),  // Study corner
            new BABYLON.Vector3(-12, 0, 0),   // Near bookshelf
            new BABYLON.Vector3(-8, 0, 0),    // Back to study entrance
            new BABYLON.Vector3(0, 0, 0),     // Main hall
            new BABYLON.Vector3(0, 0, 8),     // Kitchen entrance
            new BABYLON.Vector3(-3, 0, 12),   // Kitchen corner
            new BABYLON.Vector3(0, 0, 8),     // Back to kitchen entrance
            new BABYLON.Vector3(3, 0, 3)      // Near stairs
        ];
    }
    
    startCatBehavior() {
        setInterval(() => {
            const randomAction = Math.random();
            
            if (randomAction < 0.6) {
                // Move to next waypoint
                this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
                this.moveCatToWaypoint(this.currentWaypoint);
            } else if (randomAction < 0.9) {
                // Sit and groom
                this.catSitAndGroom();
            } else {
                // Meow
                this.catMeow();
            }
        }, 8000); // Change behavior every 8 seconds
    }
    
    catSitAndGroom() {
        // Change cat mesh to sitting position
        this.cat.scaling.y = 0.7;
        setTimeout(() => {
            this.cat.scaling.y = 1.0;
        }, 4000);
    }
    
    catMeow() {
        console.log("Cat meows");
        // Here we could add a sound if needed
    }
}
