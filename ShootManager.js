class ShootManager {

    shooterShoots = [];
    monsterShoots = [];
    canvas;
    ctx;

    shootSpeed = 15;

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    manage() {
        this.drawShoots();
        this.cleanArrays();

    }

    addNewShoot(shooterObj, direction) {
        const encodedDir = this.encodeDirection(direction)
        const newShoot = this.createNewShoot(shooterObj, encodedDir.x, encodedDir.y);
        switch (shooterObj.type) {
            case 'shooter': this.shooterShoots.push(newShoot); break;
            case 'monster': this.monsterShoots.push(newShoot); break;
        }
    }

    encodeDirection(direction) {
        switch (direction) {
            case 'left': return { x: -this.shootSpeed, y: 0 };
            case 'right': return { x: this.shootSpeed, y: 0 };
            case 'up': return { x: 0, y: -this.shootSpeed };
            case 'down': return { x: 0, y: this.shootSpeed };
        }
    }

    createNewShoot(shooterObj, speedX, speedY) {
        const x = shooterObj.x + shooterObj.width / 2;
        const y = shooterObj.y + shooterObj.height / 2;
        return new Shoot(x, y, speedX, speedY);
    }

    drawShoots() {
        this.drawShootsForArray(this.shooterShoots);
        this.drawShootsForArray(this.monsterShoots);
    }

    drawShootsForArray(array) {
        if (array.lenth === 0) {
            return;
        }
        for (let idx in array) {
            const shootData = array[idx].changePosition();
            this.drawShoot(shootData);
        }
    }

    drawShoot(shootData) {
        this.ctx.beginPath();
        this.ctx.arc(shootData.x, shootData.y, shootData.r, 0, Math.PI * 2);
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fill();
        this.ctx.closePath();
    }

    cleanArrays() {
        this.cleanArray(this.shooterShoots);
        this.cleanArray(this.monsterShoots);
    }

    cleanArray(array) {
        for (let idx in array) {
            this.checkPosition(idx, array);
        }
    }

    checkPosition(idx, array) {
        if (array[idx].x < 0 || array[idx].x > this.canvas.width) {
            array.splice(idx, 1);
            return;
        }
        if (array[idx].y < 0 || array[idx].y > this.canvas.height) {
            array.splice(idx, 1);
            return;
        }
    }

    reset() {
        this.shooterShoots = [];
        this.monsterShoots = [];
    }
}