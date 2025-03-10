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
                    thickness: 0.03,
                    tessellation: 16
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
            
            this.setupPickableInteraction(mesh, item, type);
        }
        
        this.cache.set(cacheKey, item);
        return item;
    }
    
    createCat() {
        const cacheKey = 'cat';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey).clone('cat_instance');
        }

        const cat = new BABYLON.TransformNode("cat", this.scene);
        
        // Cat body
        const body = BABYLON.MeshBuilder.CreateSphere("cat_body", {
            diameterX: 0.5, 
            diameterY: 0.35, 
            diameterZ: 0.8
        }, this.scene);
        body.material = this.createMaterial("#5E5E5E");
        body.parent = cat;
        
        // Cat head
        const head = BABYLON.MeshBuilder.CreateSphere("cat_head", {
            diameter: 0.3
        }, this.scene);
        head.position = new BABYLON.Vector3(0, 0.1, 0.4);
        head.material = this.createMaterial("#5E5E5E");
        head.parent = cat;
        
        // Cat ears
        const earLeft = BABYLON.MeshBuilder.CreateCylinder("cat_ear_left", {
            height: 0.15,
            diameterTop: 0,
            diameterBottom: 0.1
        }, this.scene);
        earLeft.position = new BABYLON.Vector3(0.1, 0.25, 0.4);
        earLeft.material = this.createMaterial("#5E5E5E");
        earLeft.parent = cat;
        
        const earRight = BABYLON.MeshBuilder.CreateCylinder("cat_ear_right", {
            height: 0.15,
            diameterTop: 0,
            diameterBottom: 0.1
        }, this.scene);
        earRight.position = new BABYLON.Vector3(-0.1, 0.25, 0.4);
        earRight.material = this.createMaterial("#5E5E5E");
        earRight.parent = cat;
        
        // Cat tail
        const tail = BABYLON.MeshBuilder.CreateCylinder("cat_tail", {
            height: 0.5,
            diameterTop: 0.03,
            diameterBottom: 0.06
        }, this.scene);
        tail.position = new BABYLON.Vector3(0, 0.15, -0.4);
        tail.rotation.x = Math.PI / 2;
        tail.material = this.createMaterial("#5E5E5E");
        tail.parent = cat;
        
        // Position cat to stand on the floor
        cat.position.y = 0.2;
        
        this.cache.set(cacheKey, cat);
        return cat;
    }
    
    setupPickableInteraction(mesh, item, type) {
        const highlightMaterial = this.createMaterial("#FFFF00", 0.4);
        const originalMaterial = mesh.material;
        mesh._customOriginalMaterial = originalMaterial;
        
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
                    document.dispatchEvent(new CustomEvent('itemPicked', { 
                        detail: { itemType: type, mesh: item } 
                    }));
                }
            )
        );
    }
    
    createOptimizedCylinder(name, options, colorHex) {
        const cylinder = BABYLON.MeshBuilder.CreateCylinder(name, {
            ...options,
            tessellation: 12,
            updatable: false
        }, this.scene);
        
        cylinder.material = this.createMaterial(colorHex);
        return cylinder;
    }
    
    createPotion(color) {
        const bottle = BABYLON.MeshBuilder.CreateCylinder("potion", {
            height: 0.2,
            diameterTop: 0.04,
            diameterBottom: 0.06,
            tessellation: 12
        }, this.scene);
        
        bottle.material = this.createMaterial("#D3D3D3", 0.7);
        
        const liquid = BABYLON.MeshBuilder.CreateCylinder("liquid", {
            height: 0.14,
            diameterTop: 0.03,
            diameterBottom: 0.05,
            tessellation: 12
        }, this.scene);
        liquid.position.y = -0.02;
        liquid.material = this.createMaterial(color);
        liquid.parent = bottle;
        
        return bottle;
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
