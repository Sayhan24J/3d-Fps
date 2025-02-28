const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game States
const GAME_STATES = {
  MENU: "MENU",
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER",
};
let gameState = GAME_STATES.MENU;

// Difficulty Settings
const DIFFICULTY = {
  EASY: { enemySpeed: 1, enemySpawnRate: 90, playerHealth: 150 },
  MEDIUM: { enemySpeed: 1.5, enemySpawnRate: 60, playerHealth: 100 },
  HARD: { enemySpeed: 2, enemySpawnRate: 30, playerHealth: 75 },
};
let currentDifficulty = DIFFICULTY.MEDIUM;

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 30,
  height: 30,
  color: "blue",
  speed: 5,
  dx: 0,
  dy: 0,
  health: 100,
  maxHealth: 100,
  angle: 0, // Angle to point toward the mouse
};

// Bullets
const bullets = [];
const bulletSpeed = 7;

// Enemies
const enemies = [];
let enemySpeed = 1.5;
let enemySpawnRate = 60; // Frames between enemy spawns
let enemySpawnCounter = 0;

// Score
let score = 0;

// Mouse position
let mouse = {
  x: 0,
  y: 0,
};

// Main Menu
const menu = document.createElement("div");
menu.id = "menu";
menu.innerHTML = `
  <h1>Shooter Game</h1>
  <button id="easyButton">Easy</button>
  <button id="mediumButton">Medium</button>
  <button id="hardButton">Hard</button>
`;
document.body.appendChild(menu);

// Difficulty Buttons
document.getElementById("easyButton").addEventListener("click", () => {
  startGame(DIFFICULTY.EASY);
});
document.getElementById("mediumButton").addEventListener("click", () => {
  startGame(DIFFICULTY.MEDIUM);
});
document.getElementById("hardButton").addEventListener("click", () => {
  startGame(DIFFICULTY.HARD);
});

// Start Game Function
function startGame(difficulty) {
  currentDifficulty = difficulty;
  player.health = difficulty.playerHealth;
  player.maxHealth = difficulty.playerHealth;
  enemySpeed = difficulty.enemySpeed;
  enemySpawnRate = difficulty.enemySpawnRate;

  // Reset game state
  bullets.length = 0;
  enemies.length = 0;
  score = 0;
  enemySpawnCounter = 0;

  // Hide menu and start game
  menu.style.display = "none";
  gameState = GAME_STATES.PLAYING;
  update();
}

// Draw Player
function drawPlayer() {
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.rotate(player.angle);
  ctx.fillStyle = player.color;
  ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
  ctx.restore();

  // Draw Health Bar
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y - 10, player.width, 5);
  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y - 10, (player.width * player.health) / player.maxHealth, 5);
}

// Draw Bullets
function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// Draw Enemies
function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // Draw Enemy Health Bar
    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 5);
    ctx.fillStyle = "green";
    ctx.fillRect(enemy.x, enemy.y - 10, (enemy.width * enemy.health) / enemy.maxHealth, 5);
  });
}

// Move Player
function movePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // Boundary detection
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Move Bullets
function moveBullets() {
  bullets.forEach((bullet, index) => {
    bullet.x += Math.cos(bullet.angle) * bulletSpeed;
    bullet.y += Math.sin(bullet.angle) * bulletSpeed;

    // Remove bullet if off screen
    if (
      bullet.x < 0 ||
      bullet.x > canvas.width ||
      bullet.y < 0 ||
      bullet.y > canvas.height
    ) {
      bullets.splice(index, 1);
    }
  });
}

// Move Enemies
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    // Move enemy towards the player
    const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
    enemy.x += Math.cos(angle) * enemySpeed;
    enemy.y += Math.sin(angle) * enemySpeed;

    // Check collision with player
    if (
      enemy.x < player.x + player.width &&
      enemy.x + enemy.width > player.x &&
      enemy.y < player.y + player.height &&
      enemy.y + enemy.height > player.y
    ) {
      // Collision detected
      player.health -= 1;
      if (player.health <= 0) {
        gameState = GAME_STATES.GAME_OVER;
        alert(`Game Over! Your score: ${score}`);
        document.location.reload();
      }
    }

    // Remove enemy if off screen
    if (
      enemy.x + enemy.width < 0 ||
      enemy.x > canvas.width ||
      enemy.y + enemy.height < 0 ||
      enemy.y > canvas.height
    ) {
      enemies.splice(index, 1);
    }
  });
}

// Spawn Enemies
function spawnEnemy() {
  const enemy = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    width: 20,
    height: 20,
    health: 50,
    maxHealth: 50,
  };
  enemies.push(enemy);
}

// Check Bullet Collisions with Enemies
function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // Collision detected
        bullets.splice(bulletIndex, 1);
        enemy.health -= 25; // Reduce enemy health
        if (enemy.health <= 0) {
          enemies.splice(enemyIndex, 1);
          score += 10;
        }
      }
    });
  });
}

// Draw Score
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Update Game
function update() {
  if (gameState !== GAME_STATES.PLAYING) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  moveBullets();
  moveEnemies();
  checkCollisions();

  drawPlayer();
  drawBullets();
  drawEnemies();
  drawScore();

  // Spawn enemies
  if (enemySpawnCounter % enemySpawnRate === 0) {
    spawnEnemy();
  }
  enemySpawnCounter++;

  requestAnimationFrame(update);
}

// Event Listeners for WASD Movement
window.addEventListener("keydown", (e) => {
  if (e.key === "w") player.dy = -player.speed;
  if (e.key === "s") player.dy = player.speed;
  if (e.key === "a") player.dx = -player.speed;
  if (e.key === "d") player.dx = player.speed;
});

window.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "s") player.dy = 0;
  if (e.key === "a" || e.key === "d") player.dx = 0;
});

// Event Listener for Mouse Movement
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;

  // Calculate angle to point toward the mouse
  player.angle = Math.atan2(mouse.y - (player.y + player.height / 2), mouse.x - (player.x + player.width / 2));
});

// Event Listener for Mouse Click (Shooting)
canvas.addEventListener("mousedown", () => {
  if (gameState === GAME_STATES.PLAYING) {
    // Spawn bullet in the direction of the mouse
    bullets.push({
      x: player.x + player.width / 2,
      y: player.y + player.height / 2,
      width: 10,
      height: 10,
      angle: player.angle, // Bullet moves in the direction of the mouse
    });
  }
});
 

