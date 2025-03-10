export class CatSystem {
    constructor(scene, modelBuilder) {
        this.scene = scene;
        this.modelBuilder = modelBuilder;
        this.waypoints = this.createWaypoints();
        this.currentWaypoint = 0;
        
        this.setupCat();
        this.startCatBehavior();
    }
    
    setupCat() {
        this.cat = this.modelBuilder.createCat();
        this.cat.position = new BABYLON.Vector3(2, 0, 2);
        this.walkingSpeed = 0.05;
        this.walkingHeight = 0.03;
        this.walkCycle = 0;
        this.isMoving = false;
        this.scene.registerBeforeRender(() => this.updateCatAnimation());
    }
    updateCatAnimation() {
        if (!this.isMoving) return;
        this.walkCycle += 0.1;
        const heightOffset = Math.abs(Math.sin(this.walkCycle)) * this.walkingHeight;
        this.cat.position.y = 0.2 + heightOffset;
        this.cat.rotation.z = Math.sin(this.walkCycle) * 0.05;
    }
    moveCatToWaypoint(waypointIndex) {
        const targetPosition = this.waypoints[waypointIndex];
        const currentPosition = this.cat.position;
        const direction = targetPosition.subtract(currentPosition);
        if (direction.length() > 0.1) {
            this.isMoving = true;
            const angle = Math.atan2(direction.x, direction.z);
            this.cat.rotation.y = angle;
            const alpha = this.walkingSpeed;
            this.cat.position = BABYLON.Vector3.Lerp(
                currentPosition,
                targetPosition,
                alpha
            );
            if (currentPosition.subtract(targetPosition).length() < 0.1) {
                this.isMoving = false;
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
