import { KQ3_COLORS } from '../kq3/constants.js';

export class ManannanSystem {
    constructor(scene, modelBuilder) {
        this.scene = scene;
        this.modelBuilder = modelBuilder;
        this.isManannanPresent = false;
        this.warningShown = false;
        this.manannanTimer = null;
        this.countdownMinutes = 25; // Classic KQ3 timer of ~25 minutes
        
        this.setupManannan();
        this.startCountdown();
    }
    
    startCountdown() {
        // Simulating KQ3's timer system (accelerated for gameplay)
        const timerTickMs = 5000; // 5 seconds = 1 game minute
        this.manannanTimer = setInterval(() => {
            this.countdownMinutes--;
            
            if (this.countdownMinutes === 5) {
                // Warning when 5 minutes remain
                this.showMessage("Manannan will return soon!");
            }
            
            if (this.countdownMinutes <= 0) {
                this.countdownMinutes = 25;
                this.appearManannan();
            }
        }, timerTickMs);
    }
    
    showMessage(text) {
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const textBlock = new BABYLON.GUI.TextBlock();
        textBlock.text = text;
        textBlock.color = KQ3_COLORS.WHITE;
        textBlock.fontSize = 24;
        textBlock.outlineWidth = 1;
        textBlock.outlineColor = KQ3_COLORS.BLACK;
        textBlock.fontFamily = "Arial";
        
        advancedTexture.addControl(textBlock);
        
        setTimeout(() => {
            advancedTexture.removeControl(textBlock);
        }, 3000);
    }
    
    punishPlayer() {
        this.showMessage("Manannan has caught you practicing magic!");
        
        // KQ3-style punishment sequence
        setTimeout(() => {
            this.showMessage("You have been turned into a snail!");
        }, 1500);
        
        setTimeout(() => {
            this.showMessage("GAME OVER");
        }, 3000);
        
        // Reset player state after punishment
        setTimeout(() => {
            location.reload(); // Restart the game
        }, 5000);
    }
}
