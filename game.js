import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';

let scene, camera, renderer, world, player;
const enemies = [];

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

    // Player Setup
    player = new Player(scene, camera, world);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Game Loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    world.step(1 / 60);
    player.update();
    renderer.render(scene, camera);
}

init();

