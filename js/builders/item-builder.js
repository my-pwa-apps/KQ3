import { KQ3_COLORS, ITEMS } from '../kq3/constants.js';

export class ItemBuilder {
    constructor(scene) {
        this.scene = scene;
        this.cache = new Map();
        this.materialCache = new Map();
    }
    
    dispose() {
        // Clear caches properly
        this.cache.forEach(mesh => {
            if (mesh && mesh.dispose) mesh.dispose();
        });
        this.cache.clear();
        
        this.materialCache.forEach(material => {
            if (material && material.dispose) material.dispose();
        });
        this.materialCache.clear();
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
        book.material = this.createMaterial(KQ3_COLORS.MAGENTA);
        book.parent = container;
        
        // Pages with authentic KQ3 look
        const pages = BABYLON.MeshBuilder.CreateBox("pages", {
            width: 0.28, height: 0.06, depth: 0.38
        }, this.scene);
        pages.position.y = 0.01;
        pages.material = this.createMaterial(KQ3_COLORS.LIGHT_GRAY);
        pages.parent = container;
        
        // Add magical runes on the cover
        const runesMaterial = this.createMaterial(KQ3_COLORS.YELLOW);
        runesMaterial.emissiveColor = BABYLON.Color3.FromHexString(KQ3_COLORS.YELLOW);
        
        const runeDecal = BABYLON.MeshBuilder.CreatePlane("runes", {
            width: 0.25, height: 0.3
        }, this.scene);
        runeDecal.position.z = 0.026;
        runeDecal.material = runesMaterial;
        runeDecal.parent = container;
        
        this.setupInteraction(container, ITEMS.SPELLBOOK, "The Great Spellbook. Study it carefully when Manannan is away.");
        
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
    
    createFlourBarrel() {
        const container = new BABYLON.TransformNode("flour-barrel-container", this.scene);
        
        const barrel = BABYLON.MeshBuilder.CreateCylinder("barrel", {
            height: 1.0,
            diameter: 0.8,
            tessellation: 16
        }, this.scene);
        barrel.material = this.createMaterial("#8B5A2B");
        barrel.parent = container;
        
        // Add barrel lid
        const lid = BABYLON.MeshBuilder.CreateCylinder("barrel-lid", {
            height: 0.05,
            diameter: 0.85,
            tessellation: 16
        }, this.scene);
        lid.position.y = 0.5;
        lid.material = this.createMaterial("#A0522D");
        lid.parent = container;
        
        this.setupInteraction(container, "flour-barrel", "A barrel of flour. Essential for baking.");
        
        return container;
    }

    createKnife() {
        const container = new BABYLON.TransformNode("knife-container", this.scene);
        
        // Blade
        const blade = BABYLON.MeshBuilder.CreateBox("blade", {
            width: 0.02, 
            height: 0.01, 
            depth: 0.25
        }, this.scene);
        blade.material = this.createMaterial("#C0C0C0");
        blade.parent = container;
        
        // Handle
        const handle = BABYLON.MeshBuilder.CreateBox("handle", {
            width: 0.03, 
            height: 0.02, 
            depth: 0.1
        }, this.scene);
        handle.position.z = -0.17;
        handle.material = this.createMaterial("#8B4513");
        handle.parent = container;
        
        this.setupInteraction(container, "knife", "A small knife. Useful for various tasks.");
        this.setupPickable(container, "knife");
        
        return container;
    }

    createMirror() {
        const container = new BABYLON.TransformNode("mirror-container", this.scene);
        
        // Frame
        const frame = BABYLON.MeshBuilder.CreateBox("frame", {
            width: 0.6, 
            height: 0.8, 
            depth: 0.05
        }, this.scene);
        frame.material = this.createMaterial("#8B4513");
        frame.parent = container;
        
        // Mirror surface - use simplified reflective material for performance
        const glass = BABYLON.MeshBuilder.CreateBox("glass", {
            width: 0.5, 
            height: 0.7, 
            depth: 0.01
        }, this.scene);
        glass.position.z = 0.03;
        
        // Create simplified reflective material that works well in VR
        const mirrorMat = new BABYLON.StandardMaterial("mirrorMat", this.scene);
        mirrorMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        mirrorMat.specularColor = new BABYLON.Color3(1, 1, 1);
        mirrorMat.specularPower = 128;
        mirrorMat.reflectionFresnelParameters = new BABYLON.FresnelParameters();
        mirrorMat.reflectionFresnelParameters.bias = 0.1;
        mirrorMat.reflectionFresnelParameters.power = 1;
        
        glass.material = mirrorMat;
        glass.parent = container;
        
        this.setupInteraction(container, "mirror", "A mirror on the wall. It reflects your image.");
        
        return container;
    }

    createPorridgePot() {
        const container = new BABYLON.TransformNode("porridge-pot-container", this.scene);
        
        // Pot
        const pot = BABYLON.MeshBuilder.CreateCylinder("pot", {
            height: 0.5,
            diameterTop: 0.6,
            diameterBottom: 0.4,
            tessellation: 16
        }, this.scene);
        pot.material = this.createMaterial("#696969");
        pot.parent = container;
        
        // Porridge inside
        const porridge = BABYLON.MeshBuilder.CreateCylinder("porridge", {
            height: 0.15,
            diameterTop: 0.55,
            diameterBottom: 0.55,
            tessellation: 16
        }, this.scene);
        porridge.position.y = 0.1;
        porridge.material = this.createMaterial("#F5DEB3");
        porridge.parent = container;
        
        this.setupInteraction(container, "porridge-pot", "A pot of porridge. It's still warm.");
        
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
        
        // Create feather with authentic KQ3 colors
        const featherStem = BABYLON.MeshBuilder.CreateCylinder("feather-stem", {
            height: 0.2,
            diameter: 0.01,
            tessellation: 8
        }, this.scene);
        featherStem.material = this.createMaterial(KQ3_COLORS.BROWN);
        featherStem.rotation.x = Math.PI/2;
        featherStem.parent = container;
        
        // Create feather barbs
        const featherBarbs = BABYLON.MeshBuilder.CreateCylinder("feather-barbs", {
            height: 0.15,
            diameterTop: 0.001,
            diameterBottom: 0.05,
            tessellation: 8
        }, this.scene);
        featherBarbs.position.z = 0.08;
        featherBarbs.rotation.x = Math.PI/2;
        featherBarbs.material = this.createMaterial(KQ3_COLORS.BROWN);
        featherBarbs.parent = container;
        
        this.setupInteraction(container, "eagle-feather", "An eagle feather. Essential for the 'Fly Like an Eagle' spell.");
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
        
        // KQ3-style tooltip
        this.showTooltip = (text) => {
            if (!this.tooltipText) {
                const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
                this.tooltipText = new BABYLON.GUI.TextBlock();
                this.tooltipText.text = text;
                this.tooltipText.color = KQ3_COLORS.LIGHT_CYAN;
                this.tooltipText.fontSize = 24;
                this.tooltipText.outlineWidth = 1;
                this.tooltipText.outlineColor = KQ3_COLORS.BLACK;
                this.tooltipText.top = "-200px";
                this.tooltipText.fontFamily = "Arial";
                advancedTexture.addControl(this.tooltipText);
            } else {
                this.tooltipText.text = text;
                this.tooltipText.isVisible = true;
            }
        };
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
    
    hideTooltip() {
        if (this.tooltipText) {
            this.tooltipText.isVisible = false;
        }
    }
    
    // Optimize material creation with better caching
    createMaterial(colorHex, alpha = 1.0) {
        const cacheKey = `${colorHex}_${alpha}`;
        if (this.materialCache.has(cacheKey)) {
            return this.materialCache.get(cacheKey);
        }
        
        const mat = new BABYLON.StandardMaterial(cacheKey, this.scene);
        mat.diffuseColor = BABYLON.Color3.FromHexString(colorHex);
        
        if (alpha < 1.0) {
            mat.alpha = alpha;
            mat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
        }
        
        // Reduce specular reflection for more authentic KQ3 look
        mat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        
        // Cache for reuse
        this.materialCache.set(cacheKey, mat);
        return mat;
    }
}
