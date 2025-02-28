export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.size = 20;
        this.health = 100;
        this.weapon = "Pistol"; // Default weapon
    }

    move(event) {
        if (event.key === "w") this.y -= this.speed;
        if (event.key === "s") this.y += this.speed;
        if (event.key === "a") this.x -= this.speed;
        if (event.key === "d") this.x += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    update() {
        this.x = Math.max(this.size / 2, Math.min(this.x, 800 - this.size / 2));
        this.y = Math.max(this.size / 2, Math.min(this.y, 600 - this.size / 2));
    }
}
