class Monster {

    type = 'monster';
    x;
    y;
    width;
    height;
    life = 10;
    speed = 1;
    motionAllowed = true;
    shootBlock = false;
    manager;
    target;
    shootDelay = 1000;

    constructor(monstersManager, x, y, width, height) {
        this.manager = monstersManager;
        this.target = monstersManager.shooter;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    move() {
        if (this.motionAllowed) {
            if (Math.abs(this.x - this.target.x) > 40 || Math.abs(this.y - this.target.y) > 40) {
                this.x = this.x > this.target.x ? this.x - this.speed : this.x + this.speed;
                this.y = this.y > this.target.y ? this.y - this.speed : this.y + this.speed;
            }
        }
    }

    checkIfCanShoot() {
        if (this.shootBlock) {
            return;
        }
        const xDist = this.x - this.manager.shooter.x;
        const yDist = this.y - this.manager.shooter.y;
        if (xDist >= 0 && xDist < this.target.width * 2 && yDist < 0) {
            this.shoot('down')
            return;
        }
        if (xDist <= 0 && xDist > -this.target.width * 2 && yDist > 0) {
            this.shoot('up')
            return;
        }
        if (yDist >= 0 && yDist < this.target.height * 2 && xDist < 0) {
            this.shoot('right')
            return;
        }
        if (yDist <= 0 && yDist > -this.target.height * 2 && xDist > 0) {
            this.shoot('left')
            return;
        }
    }

    shoot(direction) {
        this.manager.shootManager.addNewShoot(this, direction);
        this.shootBlock = true;
        setTimeout(() => this.shootBlock = false, this.shootDelay);
    }

    stop() {
        this.motionAllowed = false;
        setTimeout(() => this.motionAllowed = true, 100);
    }


}