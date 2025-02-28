import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Bullet } from './bullet.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let player = new Player(canvas.width / 2, canvas.height / 2);
let enemies = [];
let bullets = [];
let score = 0;
let isGameOver = false;

function spawnEnemy() {
    let x = Math.random() > 0.5 ? 0 : canvas.width;
    let y = Math.random() * canvas.height;
    enemies.push(new Enemy(x, y));
}

setInterval(spawnEnemy, 2000);

function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.update();
    player.draw(ctx);

    bullets.forEach((bullet, index) => {
        bullet.update();
        bullet.draw(ctx);
        if (bullet.x > canvas.width || bullet.x < 0 || bullet.y > canvas.height || bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });

    enemies.forEach((enemy, eIndex) => {
        enemy.update(player.x, player.y);
        enemy.draw(ctx);

        bullets.forEach((bullet, bIndex) => {
            if (bullet.collidesWith(enemy)) {
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score += 10;
                document.getElementById("score").innerText = score;
            }
        });

        if (enemy.collidesWith(player)) {
            player.health -= 10;
            document.getElementById("health").innerText = player.health;
            if (player.health <= 0) gameOver();
        }
    });

    requestAnimationFrame(gameLoop);
}

function gameOver() {
    isGameOver = true;
    document.getElementById("gameOverScreen").style.display = "block";
}

window.restartGame = function () {
    document.getElementById("gameOverScreen").style.display = "none";
    isGameOver = false;
    player.health = 100;
    enemies = [];
    bullets = [];
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("health").innerText = player.health;
    gameLoop();
};

window.addEventListener("keydown", (e) => player.move(e));
window.addEventListener("click", (e) => bullets.push(new Bullet(player.x, player.y, e.clientX, e.clientY, player.weapon)));

window.addEventListener("keydown", (e) => {
    if (e.key === "1") {
        player.weapon = "Pistol";
    } else if (e.key === "2") {
        player.weapon = "Shotgun";
    }
    document.getElementById("weapon").innerText = player.weapon;
});

gameLoop();
