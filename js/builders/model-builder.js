export class ModelBuilder {
    constructor(scene) {
        this.scene = scene;
    }

    createWizard() {
        const wizard = new BABYLON.TransformNode("wizard", this.scene);
        
        // Robe
        const robe = BABYLON.MeshBuilder.CreateCylinder("robe", {
            height: 1.8,
            diameter: 0.8
        }, this.scene);
        robe.material = this.createMaterial("#321853");
        robe.parent = wizard;

        // Head
        const head = BABYLON.MeshBuilder.CreateSphere("head", {
            diameter: 0.4
        }, this.scene);
        head.position.y = 1.7;
        head.position.z = 0.1;
        head.material = this.createMaterial("#FFE0BD");
        head.parent = wizard;

        // Add staff and other details...
        
        return wizard;
    }

    createMaterial(color) {
        const mat = new BABYLON.StandardMaterial("mat", this.scene);
        mat.diffuseColor = BABYLON.Color3.FromHexString(color);
        return mat;
    }
}
