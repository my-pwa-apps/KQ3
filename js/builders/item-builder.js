export class ItemBuilder {
    constructor(scene) {
        this.scene = scene;
        this.cache = new Map();
        this.materialCache = new Map();
    }

    createKQ3Item(type, position) {
        let item;
        switch(type) {
            case 'spellbook': 
                item = this.createSpellbook();
                break;
            case 'wand': 
                item = this.createWand();
                break;
            case 'cauldron': 
                item = this.createCauldron();
                break;
            case 'flour-barrel': 
                item = this.createFlourBarrel();
                break;
            case 'knife': 
                item = this.createKnife();
                break;
            case 'mirror': 
                item = this.createMirror();
                break;
            case 'porridge-pot': 
                item = this.createPorridgePot();
                break;
            case 'chicken-feather':
                item = this.createChickenFeather();
                break;
            case 'eagle-feather':
                item = this.createEagleFeather();
                break;
            case 'acorns':
                item = this.createAcorns();
                break;
        }
        
        if (item && position) {
            item.position = position;
        }
        
        return item;
    }

    createSpellbook() {
        const container = new BABYLON.TransformNode("spellbook-container", this.scene);
        
        const book = BABYLON.MeshBuilder.CreateBox("spellbook", {
            width: 0.3, height: 0.05, depth: 0.4
        }, this.scene);
        book.material = this.createMaterial("#8B4513");
        book.parent = container;
        
        // Remove physics assignment:
        // book.physicsImpostor = new BABYLON.PhysicsImpostor(
        //    book, BABYLON.PhysicsImpostor.BoxImpostor, 
        //    { mass: 1, restitution: 0.5, friction: 0.5 }
        // );
        
        // Add page details
        const pages = BABYLON.MeshBuilder.CreateBox("pages", {
            width: 0.28, height: 0.06, depth: 0.38
        }, this.scene);
        pages.position.y = 0.01;
        pages.material = this.createMaterial("#F5F5DC");
        pages.parent = container;
        
        this.setupInteraction(container, "spellbook", "Manannan's spell book. Better not touch it unless he's away!");
        
        return container;
    }

    createWand() {
        const container = new BABYLON.TransformNode("wand-container", this.scene);
        
        const wand = BABYLON.MeshBuilder.CreateCylinder("wand", {
            height: 0.5,
            diameter: 0.03,
            tessellation: 8
        }, this.scene);
        wand.material = this.createMaterial("#8B4513");
        wand.parent = container;
        
        // Add star tip
        const tip = BABYLON.MeshBuilder.CreateSphere("tip", {
            diameter: 0.05
        }, this.scene);
        tip.position.y = 0.25;
        tip.material = this.createMaterial("#FFD700");
        tip.parent = container;
        
        this.setupInteraction(container, "wand", "Manannan's wand. It seems to emit a faint magical glow.");
        
        return container;
    }
    
    createCauldron() {
        const container = new BABYLON.TransformNode("cauldron-container", this.scene);
        
        const cauldron = BABYLON.MeshBuilder.CreateCylinder("cauldron", {
            height: 0.6,
            diameterTop: 0.8,
            diameterBottom: 0.5,
            tessellation: 16
        }, this.scene);
        cauldron.material = this.createMaterial("#4A4A4A");
        cauldron.parent = container;
        
        this.setupInteraction(container, "cauldron", "A large iron cauldron. Perfect for brewing potions!");
        
        return container;
    }
    
    createChickenFeather() {
        const container = new BABYLON.TransformNode("chicken-feather-container", this.scene);
        
        const feather = BABYLON.MeshBuilder.CreateBox("feather", {
            width: 0.03, 
            height: 0.01, 
            depth: 0.15
        }, this.scene);
        feather.rotation.y = Math.PI / 4;
        feather.material = this.createMaterial("#FFFFFF");
        feather.parent = container;
        
        this.setupInteraction(container, "chicken-feather", "A white chicken feather. Useful for certain spells.");
        this.setupPickable(container, "chicken-feather");
        
        return container;
    }

    createEagleFeather() {
        const container = new BABYLON.TransformNode("eagle-feather-container", this.scene);
        
        const feather = BABYLON.MeshBuilder.CreateBox("feather", {
            width: 0.03, 
            height: 0.01, 
            depth: 0.2
        }, this.scene);
        feather.rotation.y = Math.PI / 4;
        feather.material = this.createMaterial("#8B4513");
        feather.parent = container;
        
        this.setupInteraction(container, "eagle-feather", "An eagle feather. An essential component for the flying spell.");
        this.setupPickable(container, "eagle-feather");
        
        return container;
    }

    createAcorns() {
        const container = new BABYLON.TransformNode("acorns-container", this.scene);
        
        // Create 3 acorns
        for (let i = 0; i < 3; i++) {
            const acorn = BABYLON.MeshBuilder.CreateSphere("acorn" + i, {
                diameter: 0.08
            }, this.scene);
            acorn.position.x = i * 0.1 - 0.1;
            acorn.material = this.createMaterial("#8B4513");
            acorn.parent = container;
        }
        
        this.setupInteraction(container, "acorns", "A handful of acorns. Might be useful for a spell ingredient.");
        this.setupPickable(container, "acorns");
        
        return container;
    }
    
    // Additional KQ3 items would be implemented here...
    
    setupInteraction(mesh, itemType, description) {
        mesh.metadata = { type: itemType, description: description, isInteractive: true };
        
        // Make all children pickable
        const makePickable = (parent) => {
            for(let child of parent.getChildMeshes()) {
                child.isPickable = true;
                child.metadata = { type: itemType, description: description, isInteractive: true };
                
                // Setup actions for hover
                if (!child.actionManager) {
                    child.actionManager = new BABYLON.ActionManager(this.scene);
                }
                
                // Hover effect
                const highlightMaterial = this.createMaterial("#FFFF00", 0.3);
                child.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                        BABYLON.ActionManager.OnPointerOverTrigger, 
                        () => {
                            this.showTooltip(description);
                            child._originalMaterial = child.material;
                            child.material = highlightMaterial;
                        }
                    )
                );
                
                child.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                        BABYLON.ActionManager.OnPointerOutTrigger, 
                        () => {
                            this.hideTooltip();
                            if (child._originalMaterial) {
                                child.material = child._originalMaterial;
                            }
                        }
                    )
                );
            }
        };
        
        makePickable(mesh);
    }
    
    setupPickable(mesh, itemType) {
        for(let child of mesh.getChildMeshes()) {
            child.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPickTrigger, 
                    () => {
                        // Dispatch event for inventory system to handle
                        document.dispatchEvent(new CustomEvent('itemPicked', { 
                            detail: { itemType: itemType, mesh: mesh }
                        }));
                    }
                )
            );
        }
    }
    
    showTooltip(text) {
        if (!this.tooltipText) {
            const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
            this.tooltipText = new BABYLON.GUI.TextBlock();
            this.tooltipText.text = text;
            this.tooltipText.color = "white";
            this.tooltipText.fontSize = 24;
            this.tooltipText.outlineWidth = 1;
            this.tooltipText.outlineColor = "black";
            this.tooltipText.top = "-200px";
            advancedTexture.addControl(this.tooltipText);
        } else {
            this.tooltipText.text = text;
            this.tooltipText.isVisible = true;
        }
    }
    
    hideTooltip() {
        if (this.tooltipText) {
            this.tooltipText.isVisible = false;
        }
    }
    
    createMaterial(colorHex, alpha = 1.0) {
        const cacheKey = `${colorHex}_${alpha}`;
        if (this.materialCache.has(cacheKey)) {
            return this.materialCache.get(cacheKey);
        }
        
        const mat = new BABYLON.StandardMaterial(cacheKey, this.scene);
        mat.diffuseColor = BABYLON.Color3.FromHexString(colorHex);
        
        if (alpha < 1.0) {
            mat.alpha = alpha;
        }
        
        this.materialCache.set(cacheKey, mat);
        return mat;
    }
}
