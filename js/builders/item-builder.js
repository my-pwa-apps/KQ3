export class ItemBuilder {
    constructor(scene) {
        this.scene = scene;
        this.cache = new Map();
    }

    createKQ3Item(type) {
        switch(type) {
            case 'spellbook': return this.createSpellbook();
            case 'wand': return this.createWand();
            case 'cauldron': return this.createCauldron();
            case 'flour-barrel': return this.createFlourBarrel();
            case 'knife': return this.createKnifeOnTable();
            case 'mirror': return this.createMirror();
            case 'porridge-pot': return this.createPorridgePot();
            // Add more KQ3 items as needed
        }
    }

    createSpellbook() {
        const book = BABYLON.MeshBuilder.CreateBox("spellbook", {
            width: 0.3, height: 0.05, depth: 0.4
        }, this.scene);
        book.physicsImpostor = new BABYLON.PhysicsImpostor(
            book, BABYLON.PhysicsImpostor.BoxImpostor, 
            { mass: 1, restitution: 0.5, friction: 0.5 }
        );
        book.metadata = { type: 'spellbook', isInteractive: true };
        return book;
    }

    createCauldron() {
        const cauldron = BABYLON.MeshBuilder.CreateCylinder("cauldron", {
            height: 0.6,
            diameterTop: 0.8,
            diameterBottom: 0.5
        }, this.scene);
        cauldron.physicsImpostor = new BABYLON.PhysicsImpostor(
            cauldron, BABYLON.PhysicsImpostor.CylinderImpostor,
            { mass: 0, restitution: 0.2, friction: 0.8 }
        );
        cauldron.metadata = { type: 'cauldron', isInteractive: true };
        return cauldron;
    }
    
    // Add more item creation methods...
}
