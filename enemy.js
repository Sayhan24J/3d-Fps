export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.speed = 1.5;
    }

    update(playerX, playerY) {
        let dx = playerX - this.x;
        let dy = playerY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    collidesWith(player) {
        return Math.abs(this.x - player.x) < 20 && Math.abs(this.y - player.y) < 20;
    }
}
