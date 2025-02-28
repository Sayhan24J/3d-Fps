import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Weapon } from './weapon.js';

let scene, camera, renderer, world, player, weapon;
const enemies = [];
let score = 0;

function init() {
    // Three.js Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Cannon.js Physics World
    world = new CANNON.World();
    world.gravity.set(0, -9.8, 0);

    // UI Elements
    const scoreText = document.createElement('div');
    scoreText.style.position = 'absolute';
    scoreText.style.top = '10px';
    scoreText.style.left = '10px';
    scoreText.style.color = 'white';
    scoreText.innerHTML = 'Score: 0';
    document.body.appendChild(scoreText);

    // Player Setup
    player = new Player(scene, camera, world);
    weapon = new Weapon(scene, world, enemies);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Spawn Enemies
    for (let i = 0; i < 3; i++) {
        const enemy = new Enemy(scene, world, player);
        enemies.push(enemy);
    }

    // Game Loop
    animate(scoreText);
}

function animate(scoreText) {
    requestAnimationFrame(() => animate(scoreText));
    world.step(1 / 60);

    player.update();
    weapon.update();
    enemies.forEach((enemy) => enemy.update());

    // Check for enemy deaths and update score
    enemies.forEach((enemy, index) => {
        if (enemy.health <= 0) {
            enemies.splice(index, 1);
            score += 10;
            scoreText.innerHTML = `Score: ${score}`;
        }
    });

    renderer.render(scene, camera);
}

init();
