import { KQ3_COLORS, ITEMS } from '../kq3/constants.js';

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
        
        // Create KQ3-style inventory panel (black box with cyan border)
        const panel = new BABYLON.GUI.StackPanel();
        panel.width = "100%";
        panel.height = "80px";
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        panel.background = KQ3_COLORS.BLACK;
        
        // Add border
        const border = new BABYLON.GUI.Rectangle();
        border.width = "100%";
        border.height = "80px";
        border.thickness = 2;
        border.color = KQ3_COLORS.LIGHT_CYAN;
        
        // Inventory title in KQ3 style
        const title = new BABYLON.GUI.TextBlock();
        title.text = "INVENTORY";
        title.color = KQ3_COLORS.LIGHT_CYAN;
        title.fontSize = 16;
        title.fontFamily = "Arial";
        title.height = "20px";
        panel.addControl(title);
        
        // Item container (horizontal)
        const itemPanel = new BABYLON.GUI.StackPanel();
        itemPanel.isVertical = false;
        itemPanel.height = "60px";
        panel.addControl(itemPanel);
        
        advancedTexture.addControl(border);
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
            itemBtn.color = KQ3_COLORS.LIGHT_CYAN;
            itemBtn.thickness = 1;
            itemBtn.cornerRadius = 0; // Square edges like in KQ3
            itemBtn.background = KQ3_COLORS.DARK_GRAY;
            
            // Show item icon - this could be extended with more item-specific icons
            const itemText = new BABYLON.GUI.TextBlock();
            itemText.text = this.getItemSymbol(itemType);
            itemText.color = KQ3_COLORS.WHITE;
            itemText.fontSize = 14;
            itemBtn.addControl(itemText);
            
            this.itemPanel.addControl(itemBtn);
        });
    }
    
    getItemSymbol(itemType) {
        // Return first 2 chars in uppercase plus unicode symbol
        switch(itemType) {
            case ITEMS.EAGLE_FEATHER: return "EF ⋙";
            case ITEMS.CAT_HAIR: return "CH ~";
            case ITEMS.WAND: return "WD ⚡";
            case ITEMS.MANDRAKE_ROOT: return "MR ⚘";
            case ITEMS.FISH_OIL: return "FO ≈";
            default: return itemType.substring(0, 2).toUpperCase();
        }
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
