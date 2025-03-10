export class RoomBuilder {
    static async createRoom(scene) {
        const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
        wallMat.diffuseTexture = new BABYLON.Texture("assets/textures/wall.jpg");
        wallMat.roughness = 1;

        const walls = [
            { pos: [0, 2, -6], rot: [0, 0, 0] },
            { pos: [0, 2, 6], rot: [0, Math.PI, 0] },
            { pos: [-6, 2, 0], rot: [0, Math.PI/2, 0] },
            { pos: [6, 2, 0], rot: [0, -Math.PI/2, 0] }
        ];

        const wallInstances = walls.map((wall, index) => {
            const wallMesh = BABYLON.MeshBuilder.CreateBox(`wall${index}`, {
                width: 12, height: 4, depth: 0.1,
                updatable: false
            }, scene);
            
            wallMesh.position = new BABYLON.Vector3(...wall.pos);
            wallMesh.rotation = new BABYLON.Vector3(...wall.rot);
            wallMesh.material = wallMat;
            wallMesh.freezeWorldMatrix();
            
            return wallMesh;
        });

        const floor = BABYLON.MeshBuilder.CreateGround("floor", {
            width: 12, height: 12,
            updatable: false
        }, scene);
        floor.material = this.createFloorMaterial(scene);
        floor.freezeWorldMatrix();

        return { walls: wallInstances, floor };
    }

    static createFloorMaterial(scene) {
        const floorMat = new BABYLON.StandardMaterial("floorMat", scene);
        floorMat.diffuseTexture = new BABYLON.Texture("assets/textures/floor.jpg");
        floorMat.roughness = 1;
        return floorMat;
    }
}
