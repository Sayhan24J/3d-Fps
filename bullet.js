export class Bullet {
    constructor(x, y, targetX, targetY, weapon) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.speed = 7;

        let dx = targetX - x;
        let dy = targetY - y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.velocityX = (dx / distance) * this.speed;
        this.velocityY = (dy / distance) * this.speed;

        this.weapon = weapon;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    draw(ctx) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    collidesWith(enemy) {
        return Math.abs(this.x - enemy.x) < 10 && Math.abs(this.y - enemy.y) < 10;
    }
}
