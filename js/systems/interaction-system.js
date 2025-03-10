export class InteractionSystem {
    constructor(scene, xrHelper) {
        this.scene = scene;
        this.setupMouseInteraction();
        
        if (xrHelper) {
            xrHelper.baseExperience.sessionManager.onXRSessionInit.add(() => {
                this.setupVRInteraction(xrHelper);
            });
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

    setupVRInteraction(xrHelper) {
        if (!xrHelper || !xrHelper.input) return;

        xrHelper.input.onControllerAddedObservable.add((controller) => {
            if (controller.onTriggerStateChangedObservable) {
                controller.onTriggerStateChangedObservable.add((state) => {
                    if (state.pressed) {
                        this.handleVRInteraction(controller);
                    }
                });
            }
        });
    }

    handleVRInteraction(controller) {
        if (!controller) return;
        
        const ray = new BABYLON.Ray();
        controller.getWorldPointerRayToRef(ray);
        
        const pickInfo = this.scene.pickWithRay(ray);
        if (pickInfo.hit) {
            this.handleInteraction(pickInfo.pickedPoint);
        }
    }

    handleInteraction(position) {
        console.log('Interaction at position:', position);
    }
}
