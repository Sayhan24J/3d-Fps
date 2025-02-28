const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  color: "blue",
  speed: 5,
  dx: 0,
  health: 100,
  maxHealth: 100,
};

// Bullets
const bullets = [];
const bulletSpeed = 7;

// Enemy Bullets
const enemyBullets = [];
const enemyBulletSpeed = 4;

// Enemies
const enemies = [];
const enemySpeed = 2;
const enemySpawnRate = 60; // Frames between enemy spawns
let enemySpawnCounter = 0;

// Power-ups
const powerUps = [];
const powerUpSpeed = 2;
const powerUpSpawnRate = 300; // Frames between power-up spawns
let powerUpSpawnCounter = 0;

// Score
let score = 0;
let level = 1;

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

// Draw Enemy Bullets
function drawEnemyBullets() {
  ctx.fillStyle = "orange";
  enemyBullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// Draw Enemies
function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// Draw Power-ups
function drawPowerUps() {
  ctx.fillStyle = "lime";
  powerUps.forEach((powerUp) => {
    ctx.beginPath();
    ctx.arc(powerUp.x, powerUp.y, powerUp.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Move Player
function movePlayer() {
  player.x += player.dx;

  // Boundary detection
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
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

// Move Enemy Bullets
function moveEnemyBullets() {
  enemyBullets.forEach((bullet, index) => {
    bullet.y += enemyBulletSpeed;

    // Remove bullet if off screen
    if (bullet.y > canvas.height) {
      enemyBullets.splice(index, 1);
    }
  });
}

// Move Enemies
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemySpeed;

    // Remove enemy if off screen
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }

    // Enemy shooting
    if (Math.random() < 0.01) {
      enemyBullets.push({
        x: enemy.x + enemy.width / 2 - 5,
        y: enemy.y + enemy.height,
        width: 10,
        height: 20,
      });
    }
  });
}

// Move Power-ups
function movePowerUps() {
  powerUps.forEach((powerUp, index) => {
    powerUp.y += powerUpSpeed;

    // Remove power-up if off screen
    if (powerUp.y > canvas.height) {
      powerUps.splice(index, 1);
    }
  });
}

// Spawn Enemies
function spawnEnemy() {
  const enemy = {
    x: Math.random() * (canvas.width - 50),
    y: 0,
    width: 50,
    height: 50,
  };
  enemies.push(enemy);
}

// Spawn Power-ups
function spawnPowerUp() {
  const powerUp = {
    x: Math.random() * (canvas.width - 20),
    y: 0,
    radius: 10,
    type: Math.random() < 0.5 ? "health" : "speed",
  };
  powerUps.push(powerUp);
}

// Check Collisions
function checkCollisions() {
  // Bullets hitting enemies
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
        enemies.splice(enemyIndex, 1);
        score += 10;
      }
    });
  });

  // Enemy bullets hitting player
  enemyBullets.forEach((bullet, bulletIndex) => {
    if (
      bullet.x < player.x + player.width &&
      bullet.x + bullet.width > player.x &&
      bullet.y < player.y + player.height &&
      bullet.y + bullet.height > player.y
    ) {
      // Collision detected
      enemyBullets.splice(bulletIndex, 1);
      player.health -= 10;
      if (player.health <= 0) {
        alert(`Game Over! Your score: ${score}`);
        document.location.reload();
      }
    }
  });

  // Power-ups hitting player
  powerUps.forEach((powerUp, index) => {
    if (
      powerUp.x < player.x + player.width &&
      powerUp.x + powerUp.radius * 2 > player.x &&
      powerUp.y < player.y + player.height &&
      powerUp.y + powerUp.radius * 2 > player.y
    ) {
      // Collision detected
      powerUps.splice(index, 1);
      if (powerUp.type === "health") {
        player.health = Math.min(player.health + 20, player.maxHealth);
      } else if (powerUp.type === "speed") {
        player.speed += 2;
        setTimeout(() => (player.speed -= 2), 5000); // Reset speed after 5 seconds
      }
    }
  });
}

// Draw Score and Level
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Level: ${level}`, 10, 60);
}

// Update Game
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  moveBullets();
  moveEnemyBullets();
  moveEnemies();
  movePowerUps();
  checkCollisions();

  drawPlayer();
  drawBullets();
  drawEnemyBullets();
  drawEnemies();
  drawPowerUps();
  drawScore();

  // Spawn enemies
  if (enemySpawnCounter % enemySpawnRate === 0) {
    spawnEnemy();
  }
  enemySpawnCounter++;

  // Spawn power-ups
  if (powerUpSpawnCounter % powerUpSpawnRate === 0) {
    spawnPowerUp();
  }
  powerUpSpawnCounter++;

  // Increase level
  if (score >= level * 100) {
    level++;
    enemySpeed += 0.5;
    enemySpawnRate = Math.max(30, enemySpawnRate - 10);
  }

  requestAnimationFrame(update);
}

// Event Listeners
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.dx = -player.speed;
  if (e.key === "ArrowRight") player.dx = player.speed;
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
});

// Start Game
update();
