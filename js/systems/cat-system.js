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
        // Create cat mesh
        this.cat = this.modelBuilder.createCat();
        this.cat.position = new BABYLON.Vector3(2, 0, 2);
        
        // Add animation to cat
        this.walkAnimation = new BABYLON.Animation(
            "catWalk", "position", 30,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        
        // Set initial position
        this.moveCatToWaypoint(this.currentWaypoint);
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
    
    moveCatToWaypoint(waypointIndex) {
        const targetPosition = this.waypoints[waypointIndex];
        
        // Create animation keys
        const keys = [];
        keys.push({
            frame: 0,
            value: this.cat.position.clone()
        });
        
        keys.push({
            frame: 60,
            value: targetPosition.clone()
        });
        
        this.walkAnimation.setKeys(keys);
        this.cat.animations = [this.walkAnimation];
        
        // Calculate rotation to face movement direction
        const direction = targetPosition.subtract(this.cat.position);
        if (direction.length() > 0.1) {
            const angle = Math.atan2(direction.x, direction.z);
            this.cat.rotation.y = angle;
        }
        
        // Start animation
        this.scene.beginAnimation(this.cat, 0, 60, false);
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
