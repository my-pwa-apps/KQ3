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

    createHead() {
        const head = BABYLON.MeshBuilder.CreateSphere("head", {
            diameter: 0.4,
            segments: 16,
            updatable: false
        }, this.scene);
        head.position.y = 1.0;
        head.position.z = 0.1;
        head.material = this.createMaterial("#FFE0BD");
        return head;
    }

    createBeard() {
        const beard = BABYLON.MeshBuilder.CreateCylinder("beard", {
            height: 0.4,
            diameterTop: 0.1,
            diameterBottom: 0.3,
            tessellation: 16,
            updatable: false
        }, this.scene);
        beard.position.y = 0.7;
        beard.position.z = 0.15;
        beard.rotation.x = Math.PI / 10;
        beard.material = this.createMaterial("#CCCCCC");
        return beard;
    }

    createStaff() {
        const staffContainer = new BABYLON.TransformNode("staffContainer", this.scene);
        
        const shaft = BABYLON.MeshBuilder.CreateCylinder("staffShaft", {
            height: 1.8,
            diameter: 0.06,
            tessellation: 8,
            updatable: false
        }, this.scene);
        shaft.position.x = 0.3;
        shaft.position.y = 0;
        shaft.material = this.createMaterial("#8B4513");
        shaft.parent = staffContainer;
        
        const orb = BABYLON.MeshBuilder.CreateSphere("staffOrb", {
            diameter: 0.12,
            segments: 12,
            updatable: false
        }, this.scene);
        orb.position.x = 0.3;
        orb.position.y = 0.9;
        orb.material = this.createMaterial("#4A90E2");
        orb.parent = staffContainer;
        
        return staffContainer;
    }

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
