export class InteractionSystem {
    constructor(scene) {
        this.scene = scene;
        this.setupMouseInteraction();
        
        // Wait for XR to be initialized before setting up VR controls
        scene.onXRFrameObservable.add(() => {
            if (!this.vrInitialized) {
                this.setupVRInteraction();
                this.vrInitialized = true;
            }
        });
    }

    setupMouseInteraction() {
        this.scene.onPointerDown = (evt) => {
            const pickResult = this.scene.pick(evt.clientX, evt.clientY);
            if (pickResult.hit) {
                this.handleInteraction(pickResult.pickedPoint);
            }
        };
    }

    setupVRInteraction() {
        const xrHelper = this.scene.xrExperience;
        if (xrHelper && xrHelper.input) {
            xrHelper.input.onControllerAddedObservable.add((controller) => {
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
    }

    handleInteraction(position) {
        // Handle interactions here
        console.log('Interaction at position:', position);
    }
}
