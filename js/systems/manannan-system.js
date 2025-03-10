export class ManannanSystem {
    constructor(scene, modelBuilder) {
        this.scene = scene;
        this.modelBuilder = modelBuilder;
        this.isManannanPresent = false;
        this.warningShown = false;
        
        this.setupManannan();
        this.startRandomChecks();
    }

    setupManannan() {
        this.manannan = this.modelBuilder.createWizard();
        this.manannan.position = new BABYLON.Vector3(0, -10, 0); // Hidden below floor
    }

    startRandomChecks() {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.showWarning();
            }
        }, 30000); // Check every 30 seconds
    }

    showWarning() {
        if (!this.warningShown && !this.isManannanPresent) {
            this.warningShown = true;
            this.showMessage("You hear footsteps approaching...");
            setTimeout(() => this.appearManannan(), 3000);
        }
    }

    appearManannan() {
        this.isManannanPresent = true;
        this.manannan.position = new BABYLON.Vector3(0, 0, -2);
        
        // Leave after 5 seconds
        setTimeout(() => this.disappearManannan(), 5000);
    }

    disappearManannan() {
        this.manannan.position = new BABYLON.Vector3(0, -10, 0);
        this.isManannanPresent = false;
        this.warningShown = false;
    }

    showMessage(text) {
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const textBlock = new BABYLON.GUI.TextBlock();
        textBlock.text = text;
        textBlock.color = "white";
        textBlock.fontSize = 24;
        advancedTexture.addControl(textBlock);

        setTimeout(() => {
            advancedTexture.removeControl(textBlock);
        }, 3000);
    }
}
