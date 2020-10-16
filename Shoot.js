class Shoot {

    x;
    y;
    speedX;
    speedY;
    radius = 4;

    constructor(x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    changePosition() {
        this.x += this.speedX;
        this.y += this.speedY;
        return {
            x: this.x,
            y: this.y,
            r: this.radius
        }
    }
}