class Shooter {

    type = 'shooter';
    x;
    y;
    width;
    height;
    speed = 10;
    life = 50;
    canvas;
    ctx;
    image;
    imageReady = false;
    shootManager;

    constructor(canvas, ctx, shootManager) {
        this.canvas = canvas;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.ctx = ctx;
        this.shootManager = shootManager;
        this.initializeImage();
    }

    run() {
        this.draw();
        this.checkIfShot();
    }

    initializeImage() {
        this.image = new Image();
        this.image.src = 'images/hero.png';
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
            this.imageReady = true;
        }
    }

    draw() {
        if (this.imageReady) {
            this.ctx.drawImage(this.image, this.x, this.y);
        }
    }

    changeShooterPosition(direction) {
        if (direction === 'right' && this.x < this.canvas.width - this.width) {
            this.x += this.speed;
        }
        if (direction === 'left' && this.x > 0) {
            this.x -= this.speed;
        }
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        }
        if (direction === 'down' && this.y < canvas.height - this.height) {
            this.y += this.speed;
        }
    }

    checkIfShot() {
        let shoots = this.shootManager.monsterShoots;
        for (let idx in shoots) {
            if (this.checkIfHit(shoots[idx])) {
                this.manageHit(idx, shoots);
            }
        }
    }

    checkIfHit(shoot) {
        if (shoot.x < this.x || shoot.x > this.x + this.width) {
            return false;
        }
        if (shoot.y < this.y || shoot.y > this.y + this.height) {
            return false;
        }
        return true;
    }

    manageHit(idx, array) {
        array.splice(idx, 1);
        this.life -= 1;
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.life = 50;
    }
}