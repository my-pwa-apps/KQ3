export class ModelBuilder {
    constructor(scene) {
        this.scene = scene;
        this.cache = new Map();
    }

    createWizard() {
        if (this.cache.has('wizard')) {
            return this.cache.get('wizard').clone('wizard_instance');
        }

        const wizard = new BABYLON.TransformNode("wizard", this.scene);
        
        const wizardMeshes = {
            robe: this.createRobe(),
            head: this.createHead(),
            beard: this.createBeard(),
            staff: this.createStaff()
        };

        Object.values(wizardMeshes).forEach(mesh => {
            mesh.parent = wizard;
            mesh.freezeWorldMatrix();
        });

        this.cache.set('wizard', wizard);
        return wizard;
    }

    createRobe() {
        const robe = BABYLON.MeshBuilder.CreateCylinder("robe", {
            height: 1.8,
            diameter: 0.8,
            tessellation: 12,
            updatable: false
        }, this.scene);
        robe.material = this.createMaterial("#321853");
        return robe;
    }

    // ...similar optimized methods for head, beard, staff...

    createMaterial(color) {
        const key = `material_${color}`;
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        const mat = new BABYLON.StandardMaterial(key, this.scene);
        mat.diffuseColor = BABYLON.Color3.FromHexString(color);
        mat.roughness = 1;
        this.cache.set(key, mat);
        return mat;
    }
}
