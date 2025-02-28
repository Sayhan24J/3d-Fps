import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

export class Player {
    constructor(scene, camera, world) {
        this.scene = scene;
        this.camera = camera;
        this.world = world;

        // Create Player Body
        this.body = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(1) });
        this.body.position.set(0, 2, 5);
        this.world.addBody(this.body);

        // Movement
        this.speed = 0.1;
        window.addEventListener('keydown', (e) => this.move(e));
    }

    move(event) {
        if (event.key === 'w') this.body.position.z -= this.speed;
        if (event.key === 's') this.body.position.z += this.speed;
        if (event.key === 'a') this.body.position.x -= this.speed;
        if (event.key === 'd') this.body.position.x += this.speed;
    }

    update() {
        this.camera.position.copy(this.body.position);
    }
}
