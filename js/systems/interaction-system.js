export class InteractionSystem {
    constructor(scene, xrHelper) {
        this.scene = scene;
        this.xrHelper = xrHelper;
        this.setupInteractions();
    }

    setupInteractions() {
        // Always setup mouse/touch interactions
        this.setupMouseInteraction();
        
        // Setup VR interactions only if XR is available
        if (this.xrHelper) {
            this.setupVRInteraction();
        }
    }

    setupMouseInteraction() {
        if (!this.scene) return;
        
        this.scene.onPointerDown = (evt) => {
            const pickResult = this.scene.pick(evt.clientX, evt.clientY);
            if (pickResult.hit) {
                this.handleInteraction(pickResult.pickedPoint);
            }
        };
    }

    setupVRInteraction() {
        if (!this.xrHelper || !this.xrHelper.baseExperience) return;

        this.xrHelper.baseExperience.onControllerAddedObservable.add((controller) => {
            controller.onTriggerStateChangedObservable.add((state) => {
                if (state.pressed) {
                    const ray = controller.getWorldPointerRayToRef();
                    const pickInfo = this.scene.pickWithRay(ray);
                    if (pickInfo.hit) {
                        this.handleInteraction(pickInfo.pickedPoint);
                    }
                }
            });
        });
    }

    handleInteraction(position) {
        console.log('Interaction at position:', position);
    }
}
