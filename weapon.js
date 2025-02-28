import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

export class Weapon {
    constructor(scene, world, enemies) {
        this.scene = scene;
        this.world = world;
        this.enemies = enemies;
        this.bullets = [];

        window.addEventListener('click', () => this.shoot());
    }

    shoot() {
        const bulletGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);
        this.scene.add(bulletMesh);

        const bulletBody = new CANNON.Body({ mass: 0.1, shape: new CANNON.Sphere(0.2) });
        bulletBody.position.copy(this.scene.camera.position);
        bulletBody.velocity.set(0, 0, -10);
        this.world.addBody(bulletBody);

        this.bullets.push({ mesh: bulletMesh, body: bulletBody });

        // Check for collisions
        bulletBody.addEventListener('collide', (event) => {
            this.enemies.forEach((enemy) => {
                if (event.body === enemy.body) {
                    enemy.takeDamage();
                    this.scene.remove(bulletMesh);
                    this.world.removeBody(bulletBody);
                }
            });
        });
    }

    update() {
        this.bullets.forEach((bullet) => {
            bullet.mesh.position.copy(bullet.body.position);
        });
    }
}
