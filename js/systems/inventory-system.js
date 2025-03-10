export class InventorySystem {
    constructor(scene) {
        this.scene = scene;
        this.inventory = [];
        this.setupEvents();
        this.createInventoryUI();
    }
    
    setupEvents() {
        document.addEventListener('itemPicked', (e) => {
            this.addItem(e.detail.itemType);
            if (e.detail.mesh) {
                e.detail.mesh.dispose();
            }
        });
    }
    
    addItem(itemType) {
        this.inventory.push(itemType);
        console.log(`Added ${itemType} to inventory`);
        this.updateInventoryUI();
        
        // Show message
        this.showMessage(`You picked up: ${itemType}`);
    }
    
    hasItem(itemType) {
        return this.inventory.includes(itemType);
    }
    
    removeItem(itemType) {
        const index = this.inventory.indexOf(itemType);
        if (index !== -1) {
            this.inventory.splice(index, 1);
            this.updateInventoryUI();
            return true;
        }
        return false;
    }
    
    createInventoryUI() {
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("inventoryUI");
        
        // Create inventory panel at the bottom
        const panel = new BABYLON.GUI.StackPanel();
        panel.width = "100%";
        panel.height = "80px";
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        panel.background = "#333333AA";
        
        // Inventory title
        const title = new BABYLON.GUI.TextBlock();
        title.text = "INVENTORY";
        title.color = "white";
        title.height = "20px";
        panel.addControl(title);
        
        // Item container (horizontal)
        const itemPanel = new BABYLON.GUI.StackPanel();
        itemPanel.isVertical = false;
        itemPanel.height = "60px";
        panel.addControl(itemPanel);
        
        advancedTexture.addControl(panel);
        
        this.advancedTexture = advancedTexture;
        this.itemPanel = itemPanel;
    }
    
    updateInventoryUI() {
        this.itemPanel.clearControls();
        
        this.inventory.forEach(itemType => {
            const itemBtn = new BABYLON.GUI.Button();
            itemBtn.width = "50px";
            itemBtn.height = "50px";
            itemBtn.color = "white";
            itemBtn.thickness = 1;
            itemBtn.cornerRadius = 5;
            itemBtn.background = "#555555";
            
            const text = new BABYLON.GUI.TextBlock();
            text.text = itemType.substring(0, 3).toUpperCase();
            text.color = "white";
            itemBtn.addControl(text);
            
            this.itemPanel.addControl(itemBtn);
        });
    }
    
    showMessage(text) {
        const messageText = new BABYLON.GUI.TextBlock();
        messageText.text = text;
        messageText.color = "white";
        messageText.fontSize = 24;
        messageText.resizeToFit = true;
        messageText.height = "40px";
        messageText.outlineWidth = 1;
        messageText.outlineColor = "black";
        
        messageText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        messageText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        messageText.top = "20px";
        
        this.advancedTexture.addControl(messageText);
        
        // Remove after a few seconds
        setTimeout(() => {
            this.advancedTexture.removeControl(messageText);
        }, 3000);
    }
}
