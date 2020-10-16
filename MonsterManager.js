class MonsterManager {

    monsters = [];
    nextMonsterInterval = 10000;
    image;
    monsterReady = false;
    monsterWidth;
    monsterHeight;
    monsterNumber = 1.0;
    monstersKilled = 0;
    ctx;
    shootManager;
    shooter;
    monstersTimer;

    constructor(ctx, shootManager, shooter) {
        this.ctx = ctx;
        this.shootManager = shootManager;
        this.shooter = shooter;
        this.createImage();
    }

    manage() {
        for (let monster of this.monsters) {
            monster.move();
            monster.checkIfCanShoot()
            this.draw(monster);
        }
        this.checkIfMonstersShot();
    }

    createImage() {
        this.image = new Image();
        this.image.src = 'images/monster.png';
        this.image.onload = () => {
            this.monsterWidth = this.image.width;
            this.monsterHeight = this.image.height;
            this.monsterReady = true;
            this.manageMonsterAppearing();
        }
    }

    manageMonsterAppearing() {
        this.addNewMonsters();
        this.monstersTimer = setInterval(() => {
            this.addNewMonsters();
        }, this.nextMonsterInterval)
    }

    addNewMonsters() {
        if (this.monsterReady) {
            const maxNumber = Math.floor(this.monsterNumber);
            for (let i = 0; i < maxNumber; i++) {
                this.addNewMonster();
            }
        }
    }

    addNewMonster() {
        const newMonster = this.createMonster();
        this.monsters.push(newMonster);
    }

    createMonster() {
        const startXPos = [0, canvas.width];
        const startYPos = [0, canvas.height];
        const tableChoice = Math.floor(Math.random() * 2);
        const sideChoice = Math.floor(Math.random() * 2);
        let monsterX;
        let monsterY;
        const monsterWidth = this.image.width;
        const monsterHeight = this.image.height;
        if (tableChoice % 2 === 0) {
            monsterX = startXPos[sideChoice];
            monsterY = Math.floor(Math.random() * canvas.height);
        }
        else {
            monsterY = startYPos[sideChoice];
            monsterX = Math.floor(Math.random() * canvas.width);
        }
        return new Monster(this, monsterX, monsterY, monsterWidth, monsterHeight);
    }

    draw(monster) {
        if (this.monsterReady) {
            this.ctx.drawImage(this.image, monster.x, monster.y);
        }
    }

    checkIfMonstersShot() {
        for (let idx in this.monsters) {
            this.checkIfMonsterShot(this.monsters[idx]);
            if (this.monsters[idx].life === 0) {
                this.monsters.splice(idx, 1);
                this.monstersKilled += 1;
                this.changeMonsterNumber()
            }
        }
    }

    checkIfMonsterShot(monster) {
        let shoots = this.shootManager.shooterShoots;
        for (let idx in shoots) {
            if (this.checkIfHit(shoots[idx], monster)) {
                monster.life -= 1;
                monster.stop();
                this.manageHit(idx, shoots);
            }
        }
    }

    checkIfHit(shoot, monster) {
        if (shoot.x < monster.x || shoot.x > monster.x + monster.width) {
            return false;
        }
        if (shoot.y < monster.y || shoot.y > monster.y + monster.height) {
            return false;
        }
        return true;
    }

    manageHit(idx, array) {
        array.splice(idx, 1);
    }

    changeMonsterNumber() {
        if (this.monsterNumber < 4) {
            this.monsterNumber = Math.ceil(0.1 * this.monstersKilled + 1);
        }
    }

    reset() {
        this.monsters = [];
        clearInterval(this.monstersTimer);
        this.monsterNumber = 1.0;
        this.monstersKilled = 0
        this.manageMonsterAppearing();
    }
}