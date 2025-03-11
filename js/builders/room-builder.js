export class RoomBuilder {
    static async createRoom(scene) {
        // Create all rooms in the house
        const mainHall = await this.createMainHall(scene);
        const kitchen = await this.createKitchen(scene);
        const study = await this.createStudy(scene);
        const stairs = this.createStairs(scene);
        
        // Add doorways between rooms
        this.createDoorways(scene);
        
        // Create container for all rooms
        const house = new BABYLON.TransformNode("manannans-house", scene);
        mainHall.parent = house;
        kitchen.parent = house;
        study.parent = house;
        stairs.parent = house;
        
        return house;
    }
    
    static async createMainHall(scene) {
        const mainHall = new BABYLON.TransformNode("main-hall", scene);
        const wallMat = this.createWallMaterial(scene);
        const floorMat = this.createFloorMaterial(scene);
        
        // Create room structure
        const walls = [
            { pos: [0, 2, -5], rot: [0, 0, 0], width: 10 },
            { pos: [0, 2, 5], rot: [0, Math.PI, 0], width: 10 },
            { pos: [-5, 2, 0], rot: [0, Math.PI/2, 0], width: 10 },
            { pos: [5, 2, 0], rot: [0, -Math.PI/2, 0], width: 10 }
        ];
        
        walls.forEach((wall, index) => {
            if (index !== 1) { // Skip south wall (doorway to kitchen)
                const wallMesh = BABYLON.MeshBuilder.CreateBox(`mainHall_wall${index}`, {
                    width: wall.width, height: 4, depth: 0.1,
                    updatable: false
                }, scene);
                
                wallMesh.position = new BABYLON.Vector3(...wall.pos);
                wallMesh.rotation = new BABYLON.Vector3(...wall.rot);
                wallMesh.material = wallMat;
                wallMesh.parent = mainHall;
            }
        });
        
        // Floor
        const floor = BABYLON.MeshBuilder.CreateGround("mainHall_floor", {
            width: 10, height: 10,
            updatable: false
        }, scene);
        floor.material = floorMat;
        floor.parent = mainHall;
        
        // Add furniture
        await this.addMainHallFurniture(scene, mainHall);
        
        return mainHall;
    }
    
    static async createKitchen(scene) {
        const kitchen = new BABYLON.TransformNode("kitchen", scene);
        kitchen.position.z = 10;
        
        const wallMat = this.createWallMaterial(scene);
        const floorMat = this.createFloorMaterial(scene);
        
        // Create room structure
        const walls = [
            { pos: [0, 2, -5], rot: [0, 0, 0], width: 10 }, // North wall (shared with main hall)
            { pos: [0, 2, 5], rot: [0, Math.PI, 0], width: 10 },
            { pos: [-5, 2, 0], rot: [0, Math.PI/2, 0], width: 10 },
            { pos: [5, 2, 0], rot: [0, -Math.PI/2, 0], width: 10 }
        ];
        
        walls.forEach((wall, index) => {
            if (index !== 0) { // Skip north wall (doorway to main hall)
                const wallMesh = BABYLON.MeshBuilder.CreateBox(`kitchen_wall${index}`, {
                    width: wall.width, height: 4, depth: 0.1,
                    updatable: false
                }, scene);
                
                wallMesh.position = new BABYLON.Vector3(...wall.pos);
                wallMesh.rotation = new BABYLON.Vector3(...wall.rot);
                wallMesh.material = wallMat;
                wallMesh.parent = kitchen;
            }
        });
        
        // Floor
        const floor = BABYLON.MeshBuilder.CreateGround("kitchen_floor", {
            width: 10, height: 10,
            updatable: false
        }, scene);
        floor.material = floorMat;
        floor.parent = kitchen;
        
        // Add furniture
        await this.addKitchenFurniture(scene, kitchen);
        
        return kitchen;
    }
    
    static async createStudy(scene) {
        const study = new BABYLON.TransformNode("study", scene);
        study.position.x = -10;
        
        const wallMat = this.createWallMaterial(scene);
        const floorMat = this.createFloorMaterial(scene);
        
        // Create room structure
        const walls = [
            { pos: [0, 2, -5], rot: [0, 0, 0], width: 10 },
            { pos: [0, 2, 5], rot: [0, Math.PI, 0], width: 10 },
            { pos: [-5, 2, 0], rot: [0, Math.PI/2, 0], width: 10 },
            { pos: [5, 2, 0], rot: [0, -Math.PI/2, 0], width: 10 }
        ];
        
        walls.forEach((wall, index) => {
            if (index !== 3) { // Skip east wall (doorway to main hall)
                const wallMesh = BABYLON.MeshBuilder.CreateBox(`study_wall${index}`, {
                    width: wall.width, height: 4, depth: 0.1,
                    updatable: false
                }, scene);
                
                wallMesh.position = new BABYLON.Vector3(...wall.pos);
                wallMesh.rotation = new BABYLON.Vector3(...wall.rot);
                wallMesh.material = wallMat;
                wallMesh.parent = study;
            }
        });
        
        // Floor
        const floor = BABYLON.MeshBuilder.CreateGround("study_floor", {
            width: 10, height: 10,
            updatable: false
        }, scene);
        floor.material = floorMat;
        floor.parent = study;
        
        // Add furniture
        await this.addStudyFurniture(scene, study);
        
        return study;
    }
    
    static createStairs(scene) {
        const stairs = new BABYLON.TransformNode("stairs", scene);
        stairs.position = new BABYLON.Vector3(4, 0, -3);
        
        // Create stair steps
        const stairMat = this.createMaterial(scene, "#8B4513");
        
        for (let i = 0; i < 10; i++) {
            const step = BABYLON.MeshBuilder.CreateBox(`stair_${i}`, {
                width: 2, height: 0.2, depth: 0.5
            }, scene);
            step.position.y = i * 0.2;
            step.position.z = i * -0.5;
            step.material = stairMat;
            step.parent = stairs;
        }
        
        // Add stair railings
        const railing = BABYLON.MeshBuilder.CreateCylinder("railing", {
            height: 5, diameter: 0.1
        }, scene);
        railing.position = new BABYLON.Vector3(1, 2, -2.5);
        railing.rotation.x = -Math.PI/4;
        railing.material = stairMat;
        railing.parent = stairs;
        
        return stairs;
    }
    
    static createDoorways(scene) {
        // Main hall to kitchen doorway
        const kitchenDoorFrame = BABYLON.MeshBuilder.CreateBox("kitchenDoorFrame", {
            width: 2, height: 3, depth: 0.2
        }, scene);
        kitchenDoorFrame.position = new BABYLON.Vector3(0, 1.5, 5);
        kitchenDoorFrame.material = this.createMaterial(scene, "#8B4513");
        
        // Main hall to study doorway
        const studyDoorFrame = BABYLON.MeshBuilder.CreateBox("studyDoorFrame", {
            width: 0.2, height: 3, depth: 2
        }, scene);
        studyDoorFrame.position = new BABYLON.Vector3(-5, 1.5, 0);
        studyDoorFrame.material = this.createMaterial(scene, "#8B4513");
    }
    
    static async addMainHallFurniture(scene, parent) {
        // Remove this line that's causing the error:
        // walls.physicsImpostor = new BABYLON.PhysicsImpostor(walls, BABYLON.PhysicsImpostor.BoxImpostor,
        //     { mass: 0, restitution: 0.1, friction: 0.8 });

        // Add KQ3 specific items
        const spellbook = scene.itemBuilder.createKQ3Item('spellbook', 
            new BABYLON.Vector3(-3, 1.2, -2));
        spellbook.parent = parent;
        
        const cauldron = scene.itemBuilder.createKQ3Item('cauldron',
            new BABYLON.Vector3(2, 0.3, -3));
        cauldron.parent = parent;
        
        const wand = scene.itemBuilder.createKQ3Item('wand',
            new BABYLON.Vector3(-2.8, 1.2, -1.8));
        wand.parent = parent;
        
        // Collectible items
        const chickenFeather = scene.itemBuilder.createKQ3Item('chicken-feather',
            new BABYLON.Vector3(1.5, 0.8, 1));
        chickenFeather.parent = parent;
        
        // Dining table
        const table = BABYLON.MeshBuilder.CreateBox("dining_table", {
            width: 3, height: 0.8, depth: 1.5
        }, scene);
        table.position = new BABYLON.Vector3(0, 0.4, 0);
        table.material = this.createMaterial(scene, "#8B4513");
        table.parent = parent;
        
        // Chairs
        const chairPositions = [
            [0, 0, -1], [0, 0, 1],
            [-1.5, 0, 0], [1.5, 0, 0]
        ];
        
        chairPositions.forEach((pos, i) => {
            const chair = this.createChair(scene);
            chair.position = new BABYLON.Vector3(...pos);
            if (i < 2) {
                chair.rotation.y = i === 0 ? Math.PI : 0;
            } else {
                chair.rotation.y = i === 2 ? Math.PI/2 : -Math.PI/2;
            }
            chair.parent = parent;
        });
        
        // Fireplace
        const fireplace = this.createFireplace(scene);
        fireplace.position = new BABYLON.Vector3(0, 0, -4.5);
        fireplace.parent = parent;


        // Add thimble near the fireplace - classic KQ3 item
        const thimble = scene.modelBuilder.createPickableItem('thimble');
        thimble.position = new BABYLON.Vector3(0.8, 2.15, -4.3);
        thimble.parent = parent;
    }
    
    static async addKitchenFurniture(scene, parent) {
        // Counter
        const counter = BABYLON.MeshBuilder.CreateBox("counter", {
            width: 4, height: 1, depth: 1
        }, scene);
        counter.position = new BABYLON.Vector3(-3, 0.5, -3);
        counter.material = this.createMaterial(scene, "#A0A0A0");
        counter.parent = parent;
        
        // Shelves
        for (let i = 0; i < 3; i++) {
            const shelf = BABYLON.MeshBuilder.CreateBox("shelf_" + i, {
                width: 2, height: 0.1, depth: 0.5
            }, scene);
            shelf.position = new BABYLON.Vector3(3, 1 + i * 0.8, -4.5);
            shelf.material = this.createMaterial(scene, "#8B4513");
            shelf.parent = parent;
            
            // Add pots on shelves
            for (let j = 0; j < 2; j++) {
                const pot = this.createPot(scene, this.getRandomColor());
                pot.position = new BABYLON.Vector3(2 - j * 1, 1.2 + i * 0.8, -4.5);
                pot.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
                pot.parent = parent;
            }
        }

        // Add pickable items
        const fishOil = scene.modelBuilder.createPickableItem('fish-oil');
        fishOil.position = new BABYLON.Vector3(-3, 1.05, -3);
        fishOil.parent = parent;
        
        const mandrakeRoot = scene.modelBuilder.createPickableItem('mandrake-root');
        mandrakeRoot.position = new BABYLON.Vector3(3, 1.2, -4.3);
        mandrakeRoot.parent = parent;
        
        // Add more KQ3 items
        const flourBarrel = scene.itemBuilder.createKQ3Item('flour-barrel',
            new BABYLON.Vector3(-2.5, 0.5, -2.5));
        flourBarrel.parent = parent;
        
        const porridgePot = scene.itemBuilder.createKQ3Item('porridge-pot',
            new BABYLON.Vector3(0, 0.5, -3));
        porridgePot.parent = parent;
    }

    static async addStudyFurniture(scene, parent) {
        // Bookshelf
        const bookshelf = this.createBookshelf(scene);
        bookshelf.position = new BABYLON.Vector3(0, 0, -4.5);
        bookshelf.parent = parent;
        
        // Desk
        const desk = BABYLON.MeshBuilder.CreateBox("desk", {
            width: 2, height: 0.8, depth: 1
        }, scene);
        desk.position = new BABYLON.Vector3(-3, 0.4, 0);
        desk.material = this.createMaterial(scene, "#8B4513");
        desk.parent = parent;
        
        // Chair
        const chair = this.createChair(scene);
        chair.position = new BABYLON.Vector3(-3, 0, 1);
        chair.parent = parent;
        
        // Spellbook
        const spellbook = this.createSpellbook(scene);
        spellbook.position = new BABYLON.Vector3(-3, 0.8, 0);
        spellbook.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        spellbook.parent = parent;


        // Add pickable items
        const mistletoe = scene.modelBuilder.createPickableItem('mistletoe');
        mistletoe.position = new BABYLON.Vector3(-3, 0.85, 0);
        mistletoe.parent = parent;

        // Add KQ3 study items
        const mirror = scene.itemBuilder.createKQ3Item('mirror',
            new BABYLON.Vector3(-4, 1.5, -3));
        mirror.parent = parent;
        
        const eagleFeather = scene.itemBuilder.createKQ3Item('eagle-feather',
            new BABYLON.Vector3(-3.5, 0.85, 0.2));
        eagleFeather.parent = parent;
    }

    static createChair(scene) {
        const chair = new BABYLON.TransformNode("chair", scene);
        
        // Seat
        const seat = BABYLON.MeshBuilder.CreateBox("chair_seat", {
            width: 0.6, height: 0.1, depth: 0.6
        }, scene);
        seat.position.y = 0.4;
        seat.material = this.createMaterial(scene, "#8B4513");
        seat.parent = chair;
        
        // Back
        const back = BABYLON.MeshBuilder.CreateBox("chair_back", {
            width: 0.6, height: 0.8, depth: 0.1
        }, scene);
        back.position.y = 0.85;
        back.position.z = -0.25;
        back.material = this.createMaterial(scene, "#8B4513");
        back.parent = chair;
        
        // Legs
        const legPositions = [
            [0.25, 0.2, 0.25], [0.25, 0.2, -0.25],
            [-0.25, 0.2, 0.25], [-0.25, 0.2, -0.25]
        ];
        
        legPositions.forEach(pos => {
            const leg = BABYLON.MeshBuilder.CreateCylinder("chair_leg", {
                height: 0.4, diameter: 0.05
            }, scene);
            leg.position = new BABYLON.Vector3(...pos);
            leg.material = this.createMaterial(scene, "#8B4513");
            leg.parent = chair;
        });
        
        return chair;
    }
    
    static createFireplace(scene) {
        const fireplace = new BABYLON.TransformNode("fireplace", scene);
        
        // Main structure
        const main = BABYLON.MeshBuilder.CreateBox("fireplace_main", {
            width: 3, height: 2, depth: 0.5
        }, scene);
        main.position.y = 1;
        main.material = this.createMaterial(scene, "#808080");
        main.parent = fireplace;
        
        // Opening
        const opening = BABYLON.MeshBuilder.CreateBox("fireplace_opening", {
            width: 2, height: 1.5, depth: 0.6
        }, scene);
        opening.position.y = 0.9;
        opening.position.z = 0.1;
        opening.material = this.createMaterial(scene, "#000000");
        opening.parent = fireplace;
        
        // Mantle
        const mantle = BABYLON.MeshBuilder.CreateBox("fireplace_mantle", {
            width: 3.5, height: 0.2, depth: 0.7
        }, scene);
        mantle.position.y = 2.1;
        mantle.material = this.createMaterial(scene, "#8B4513");
        mantle.parent = fireplace;
        
        // Fire effect (red/orange box)
        const fire = BABYLON.MeshBuilder.CreateBox("fire", {
            width: 1.8, height: 0.6, depth: 0.1
        }, scene);
        fire.position.y = 0.5;
        fire.position.z = 0.1;
        
        const fireMat = new BABYLON.StandardMaterial("fireMat", scene);
        fireMat.emissiveColor = new BABYLON.Color3(1, 0.3, 0);
        fire.material = fireMat;
        fire.parent = fireplace;
        
        return fireplace;
    }
    
    static createBookshelf(scene) {
        const bookshelf = new BABYLON.TransformNode("bookshelf", scene);
        
        // Main structure
        const main = BABYLON.MeshBuilder.CreateBox("shelf_main", {
            width: 3, height: 2.5, depth: 0.5
        }, scene);
        main.position.y = 1.25;
        main.material = this.createMaterial(scene, "#8B4513");
        main.parent = bookshelf;
        
        // Shelves
        for (let i = 0; i < 3; i++) {
            const shelf = BABYLON.MeshBuilder.CreateBox("shelf_" + i, {
                width: 2.8, height: 0.05, depth: 0.4
            }, scene);
            shelf.position.y = 0.5 + i * 0.8;
            shelf.material = this.createMaterial(scene, "#8B4513");
            shelf.parent = bookshelf;
            
            // Add books on each shelf
            for (let j = 0; j < 4; j++) {
                const book = this.createBook(scene, this.getRandomColor());
                book.position.x = -1.2 + j * 0.6;
                book.position.y = 0.6 + i * 0.8;
                book.parent = bookshelf;
            }
        }
        
        return bookshelf;
    }
    
    static createBook(scene, color) {
        const book = BABYLON.MeshBuilder.CreateBox("book", {
            width: 0.3, height: 0.4, depth: 0.05
        }, scene);
        book.material = this.createMaterial(scene, color);
        return book;
    }
    
    static createPot(scene, color) {
        const pot = new BABYLON.TransformNode("pot", scene);
        
        // Base
        const base = BABYLON.MeshBuilder.CreateCylinder("pot_base", {
            height: 0.3, diameterTop: 0.2, diameterBottom: 0.15
        }, scene);
        base.material = this.createMaterial(scene, color);
        base.parent = pot;
        
        // Lid
        const lid = BABYLON.MeshBuilder.CreateCylinder("pot_lid", {
            height: 0.05, diameterTop: 0.15, diameterBottom: 0.22
        }, scene);
        lid.position.y = 0.175;
        lid.material = this.createMaterial(scene, color);
        lid.parent = pot;
        
        // Handle
        const handle = BABYLON.MeshBuilder.CreateCylinder("pot_handle", {
            height: 0.1, diameter: 0.02
        }, scene);
        handle.position.y = 0.2;
        handle.material = this.createMaterial(scene, "#000000");
        handle.parent = pot;
        
        return pot;
    }
    
    static createSpellbook(scene) {
        const spellbook = BABYLON.MeshBuilder.CreateBox("spellbook", {
            width: 0.5, height: 0.1, depth: 0.6
        }, scene);
        
        const mat = new BABYLON.StandardMaterial("spellbookMat", scene);
        mat.diffuseColor = new BABYLON.Color3(0.5, 0, 0.5);
        spellbook.material = mat;
        
        // Make spellbook interactive
        spellbook.isPickable = true;
        spellbook.actionManager = new BABYLON.ActionManager(scene);
        spellbook.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger, 
                () => { console.log("Spellbook clicked!"); }
            )
        );
        
        return spellbook;
    }
    
    static createWallMaterial(scene) {
        return this.createMaterial(scene, "#D2B48C");
    }
    
    static createFloorMaterial(scene) {
        return this.createMaterial(scene, "#8B4513");
    }
    
    static createMaterial(scene, color) {
        const mat = new BABYLON.StandardMaterial(color.replace("#", "mat_"), scene);
        mat.diffuseColor = BABYLON.Color3.FromHexString(color);
        return mat;
    }
    
    static getRandomColor() {
        const colors = ["#A52A2A", "#D2691E", "#6B8E23", "#483D8B", "#4682B4"];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
