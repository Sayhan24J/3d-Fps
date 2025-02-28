import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

export class Enemy {
    constructor(scene, world, player) {
        this.scene = scene;
        this.world = world;
        this.player = player;
        this.health = 3; // Enemy health

        // Enemy Mesh
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(Math.random() * 10 - 5, 1, Math.random() * -10);
        this.scene.add(this.mesh);

        // Enemy Physics
        this.body = new CANNON.Body({ mass: 1, shape: new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)) });
        this.body.position.copy(this.mesh.position);
        this.world.addBody(this.body);
    }

    update() {
        // Move towards player
        const direction = new THREE.Vector3(
            this.player.body.position.x - this.body.position.x,
            0,
            this.player.body.position.z - this.body.position.z
        );
        direction.normalize();
        this.body.velocity.set(direction.x * 2, this.body.velocity.y, direction.z * 2);

        // Update Mesh Position
        this.mesh.position.copy(this.body.position);
    }

    takeDamage() {
        this.health -= 1;
        if (this.health <= 0) {
            this.scene.remove(this.mesh);
            this.world.removeBody(this.body);
        }
    }
}
