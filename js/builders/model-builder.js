export class ModelBuilder {
    constructor(scene) {
        this.scene = scene;
        this.cache = new Map();
        this.materialCache = new Map();
    }
    
    dispose() {
        // Clean up cached resources
        this.cache.forEach(mesh => {
            if (mesh && mesh.dispose) mesh.dispose();
        });
        this.cache.clear();
        
        this.materialCache.forEach(material => {
            if (material && material.dispose) material.dispose();
        });
        this.materialCache.clear();
    }
    
    createPickableItem(type) {
        // Cache check for better performance
        const cacheKey = `pickable_${type}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey).clone(`item_${type}_instance`, null, false);
        }

        const item = new BABYLON.TransformNode(`item_${type}`, this.scene);
        item.metadata = { type, isPickable: true };
        
        let mesh;
        
        switch(type) {
            case 'mandrake-root':
                mesh = this.createOptimizedCylinder(`mesh_${type}`, {
                    height: 0.2,
                    diameterTop: 0.05,
                    diameterBottom: 0.1,
                }, "#8B4513");
                break;
                
            case 'cat-hair':
                mesh = this.createOptimizedCylinder(`mesh_${type}`, {
                    height: 0.1,
                    diameterTop: 0.01,
                    diameterBottom: 0.01,
                }, "#5E5E5E");
                break;
                
            case 'fish-oil':
                mesh = this.createPotion("#87CEEB");
                break;
                
            case 'mistletoe':
                mesh = BABYLON.MeshBuilder.CreateTorus(`mesh_${type}`, {
                    diameter: 0.15,
                    thickness: 0.03
                }, this.scene);
                mesh.material = this.createMaterial("#228B22");
                break;
                
            case 'thimble':
                mesh = this.createOptimizedCylinder(`mesh_${type}`, {
                    height: 0.1,
                    diameterTop: 0.08,
                    diameterBottom: 0.08
                }, "#C0C0C0");
                break;
        }
        
        if (mesh) {
            mesh.parent = item;
            mesh.isPickable = true;
            mesh.metadata = { type, isPickable: true };
            
            // Setup optimized interaction highlighting
            this.setupPickableInteraction(mesh, item, type);
        }
        
        // Cache the template for future reuse
        this.cache.set(cacheKey, item);
        return item;
    }
    
    setupPickableInteraction(mesh, item, type) {
        // Get or create highlight material
        const highlightMaterial = this.createMaterial("#FFFF00", 0.4);
        
        // Store original material reference
        const originalMaterial = mesh.material;
        mesh._customOriginalMaterial = originalMaterial;
        
        // Use action manager with optimized triggers
        if (!mesh.actionManager) {
            mesh.actionManager = new BABYLON.ActionManager(this.scene);
        }
        
        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger, 
                () => mesh.material = highlightMaterial
            )
        );
        
        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger, 
                () => mesh.material = mesh._customOriginalMaterial || originalMaterial
            )
        );
        
        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger, 
                () => {
                    // Direct event dispatch for better performance
                    document.dispatchEvent(new CustomEvent('itemPicked', { 
                        detail: { itemType: type, mesh: item } 
                    }));
                }
            )
        );
    }
    
    createOptimizedCylinder(name, options, colorHex) {
        // Create optimized cylinder with performance settings
        const cylinder = BABYLON.MeshBuilder.CreateCylinder(name, {
            ...options,
            tessellation: 12, // Reduced for better performance
            updatable: false
        }, this.scene);
        
        cylinder.material = this.createMaterial(colorHex);
        cylinder.freezeWorldMatrix(); // Performance optimization
        
        return cylinder;
    }
    
    createMaterial(colorHex, alpha = 1.0) {
        // Cache materials by color and alpha
        const cacheKey = `${colorHex}_${alpha}`;
        if (this.materialCache.has(cacheKey)) {
            return this.materialCache.get(cacheKey);
        }
        
        const mat = new BABYLON.StandardMaterial(cacheKey, this.scene);
        mat.diffuseColor = BABYLON.Color3.FromHexString(colorHex);
        
        if (alpha < 1.0) {
            mat.alpha = alpha;
        }
        
        // Performance optimizations
        mat.freeze(); // Prevents material updates for static objects
        this.materialCache.set(cacheKey, mat);
        
        return mat;
    }
    
    createPotion(color) {
        // Create bottle shape
        const bottle = BABYLON.MeshBuilder.CreateCylinder("potion", {
            height: 0.2,
            diameterTop: 0.04,
            diameterBottom: 0.06
        }, this.scene);
        bottle.material = this.createMaterial("#D3D3D3");
        bottle.material.alpha = 0.7;
        
        // Create liquid inside
        const liquid = BABYLON.MeshBuilder.CreateCylinder("liquid", {
            height: 0.14,
            diameterTop: 0.03,
            diameterBottom: 0.05
        }, this.scene);
        liquid.position.y = -0.02;
        liquid.material = this.createMaterial(color);
        liquid.parent = bottle;
        
        return bottle;
    }
}
