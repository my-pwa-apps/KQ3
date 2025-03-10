export class InteractionSystem {
    constructor(scene) {
        this.scene = scene;
        this.setupInteraction();
    }

    setupInteraction() {
        // VR Controller interaction
        this.scene.onXRControllerAdded.add((controller) => {
            controller.onTriggerStateChangedObservable.add((state) => {
                if (state.pressed) {
                    this.handleInteraction(controller.position);
                }
            });
        });

        // Mouse interaction
        this.scene.onPointerDown = (evt) => {
            const pickResult = this.scene.pick(evt.clientX, evt.clientY);
            if (pickResult.hit) {
                this.handleInteraction(pickResult.pickedPoint);
            }
        };
    }

    handleInteraction(position) {
        // Handle object interactions
    }
}
