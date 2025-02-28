const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
};

// Bullets
const bullets = [];
const bulletSpeed = 7;

// Enemies
const enemies = [];
const enemySpeed = 1.5;
const enemySpawnRate = 60; // Frames between enemy spawns
let enemySpawnCounter = 0;

// Score
let score = 0;

// Draw Player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

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
    bullet.y -= bulletSpeed;

    // Remove bullet if off screen
    if (bullet.y + bullet.height < 0) {
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

// Event Listeners
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.dx = -player.speed;
  if (e.key === "ArrowRight") player.dx = player.speed;
  if (e.key === "ArrowUp") player.dy = -player.speed;
  if (e.key === "ArrowDown") player.dy = player.speed;
  if (e.key === " " && bullets.length < 5) {
    // Spacebar to shoot (limit 5 bullets)
    bullets.push({
      x: player.x + player.width / 2 - 5,
      y: player.y,
      width: 10,
      height: 20,
    });
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
  if (e.key === "ArrowUp" || e.key === "ArrowDown") player.dy = 0;
});

// Start Game
update();
