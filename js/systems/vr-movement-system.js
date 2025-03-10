export class VRMovementSystem {
    constructor(scene, xrHelper) {
        this.scene = scene;
        this.xrHelper = xrHelper;
        this.movementSpeed = 0.05; // Reduced speed
        this.rotationSpeed = 0.05;
        this.lastUpdateTime = 0;
        this.movementThreshold = 0.1;
    }
    handleThumbstickMovement(axes, controller) {
        if (!this.xrHelper.baseExperience.camera) return;
        const now = performance.now();
        if (now - this.lastUpdateTime < 16) return;
        this.lastUpdateTime = now;
        const camera = this.xrHelper.baseExperience.camera;
        if (Math.abs(axes.x) < this.movementThreshold && Math.abs(axes.y) < this.movementThreshold) return;
        const cameraDirection = camera.getDirection(BABYLON.Vector3.Forward());
        cameraDirection.y = 0;
        cameraDirection.normalize();
        const cameraRight = camera.getDirection(BABYLON.Vector3.Right());
        cameraRight.y = 0;
        cameraRight.normalize();
        // Invert Y-axis for correct forward/backward movement
        const movement = new BABYLON.Vector3();
        movement.addInPlace(cameraDirection.scale(-axes.y * this.movementSpeed));
        movement.addInPlace(cameraRight.scale(axes.x * this.movementSpeed));
        camera.position.addInPlace(movement);
    }
}
