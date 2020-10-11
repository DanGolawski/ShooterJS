window.onload = () => {
    // CANVAS
    let canvas = document.querySelector('#canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
    ctx.font = "30px Georgia";

    let gameIsOver = false;
    let monsterTimer;

    // SHOOTER
    let shooterImage = new Image();
    shooterImage.src = 'images/hero.png';
    let shooterReady = false;
    let shooterImageWidth;
    let shooterImageHeight;
    let shooter;
    shooterImage.onload = () => {
        shooterImageWidth = shooterImage.width;
        shooterImageHeight = shooterImage.height;
        createShooter();
        shooterReady = true;
    }

    // MONSTERS
    let monsterImage = new Image();
    monsterImage.src = 'images/monster.png';
    let monsterReady = false;
    let monsterImageWidth;
    let monsterImageHeight;
    let allowNextMonster = true;
    let monstersKilled = 0;
    monsterImage.onload = () => {
        monsterImageWidth = monsterImage.width;
        monsterImageHeight = monsterImage.height;
        monsterReady = true;
    }

    // the lists where shoots objects are stored 
    let shooterShoots = [];
    let monsterShoots = [];
    // allows to shoot only when the key is up
    let shootAllowed = true;
    // the list where monsters objects are stored
    let monsters = [];
    // time when next monster appears
    let monsterInterval = 10000;
    let monsterNumber = 1.0;


    // keys pressed
    let rightKeyPressed = false;
    let leftKeyPressed = false;
    let upKeyPressed = false;
    let downKeyPressed = false;

    startGame();

    function startGame() {
        handleKeyActions();
        allowMonsterAppear();
        render();
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (gameIsOver) {
            return;
        }
        changeShooterPosition();
        drawShooter();
        drawShoots();
        addMonsters();
        drawMonsters();
        checkIfMonstersShot();
        checkIfShooterShot();
        printGameState();
        requestAnimationFrame(render);
    }

    function printGameState() {
        if (shooter) {
            ctx.fillText(`Life : ${shooter.life}`, 35, 20);
        }

    }

    function checkIfShooterShot() {
        if (!shooter) {
            return;
        }
        const x1 = shooter.x;
        const x2 = shooter.x + shooter.width;
        const y1 = shooter.y;
        const y2 = shooter.y + shooter.height;
        shooter.life -= countShootsForShooter(x1, x2, y1, y2);
        if (shooter.life === 0) {
            finishGame();
        }
    }

    function countShootsForShooter(x1, x2, y1, y2) {
        let shotCounter = 0;
        for (let idx in monsterShoots) {
            if (monsterShoots[idx].x > x1 && monsterShoots[idx].x < x2 && monsterShoots[idx].y > y1 && monsterShoots[idx].y < y2) {
                shotCounter++
                monsterShoots.splice(idx, 1);
            }
        }
        return shotCounter;
    }

    function finishGame() {
        gameIsOver = true;
        canvas.style.visibility = 'hidden';
        document.querySelector('#gameOverWindow').style.visibility = 'visible';
        clearInterval(monsterTimer);
    }

    // creates shooter when image is already loaded
    function createShooter() {
        shooter = {
            type: 'shooter',
            x: canvas.width / 2,
            y: canvas.height / 2,
            width: shooterImageWidth,
            height: shooterImageHeight,
            life: 50,
            speed: 10
        }
    }

    function handleKeyActions() {
        document.addEventListener('keydown', event => {
            handleKeys(event, true);
        }, false);
        document.addEventListener('keyup', event => {
            handleKeys(event, false);
        }, false);
    }

    function handleKeys(event, pressed) {
        if (event.key === 'Right' || event.key === 'ArrowRight') {
            rightKeyPressed = pressed;
            return;
        }
        if (event.key === 'Left' || event.key === 'ArrowLeft') {
            leftKeyPressed = pressed;
            return;
        }
        if (event.key === 'Up' || event.key === 'ArrowUp') {
            upKeyPressed = pressed;
            return;
        }
        if (event.key === 'Down' || event.key === 'ArrowDown') {
            downKeyPressed = pressed;
            return;
        }
        if (event.key === "w" && shootAllowed) {
            addNewShoot(shooter, 0, -15);
        }
        if (event.key === "s" && shootAllowed) {
            addNewShoot(shooter, 0, 15);
        }
        if (event.key === "a" && shootAllowed) {
            addNewShoot(shooter, -15, 0);
        }
        if (event.key === "d" && shootAllowed) {
            addNewShoot(shooter, 15, 0);
        }
        shootAllowed = !pressed;
    }

    function drawShooter() {
        if (shooterReady) {
            ctx.drawImage(shooterImage, shooter.x, shooter.y);
        }
    }

    function changeShooterPosition() {
        if (rightKeyPressed && shooter.x < canvas.width - shooterImage.width) {
            shooter.x += shooter.speed;
        }
        if (leftKeyPressed && shooter.x > 0) {
            shooter.x -= shooter.speed;
        }
        if (upKeyPressed && shooter.y > 0) {
            shooter.y -= shooter.speed;
        }
        if (downKeyPressed && shooter.y < canvas.height - shooterImage.height) {
            shooter.y += shooter.speed;
        }
    }

    function addNewShoot(shooterObj, speedX, speedY) {
        const newShoot = createNewShoot(shooterObj, speedX, speedY);
        switch (shooterObj.type) {
            case 'shooter': shooterShoots.push(newShoot); break;
            case 'monster': monsterShoots.push(newShoot); break;
        }
    }

    function createNewShoot(shooterObj, speed_x, speed_y) {
        return {
            x: shooterObj.x + shooterObj.width / 2,
            y: shooterObj.y + shooterObj.height / 2,
            speedX: speed_x,
            speedY: speed_y,
            changePosition() {
                this.x += this.speedX;
                this.y += this.speedY;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            },
            getX() {
                return this.x;
            },
            getY() {
                return this.y;
            }
        }
    }

    function drawShoots() {
        for (let idx in shooterShoots) {
            if (checkShootPos(shooterShoots[idx])) {
                shooterShoots[idx].changePosition();
            }
            else {
                shooterShoots.splice(idx, 1);
            }
        }
        for (let idx in monsterShoots) {
            if (checkShootPos(monsterShoots[idx])) {
                monsterShoots[idx].changePosition();
            }
            else {
                monsterShoots.splice(idx, 1);
            }
        }
    }

    function checkShootPos(shoot) {
        const currX = shoot.getX();
        const currY = shoot.getY();
        const canvW = canvas.width;
        const canvH = canvas.height;
        return (currX > 0 && currX < canvW) && (currY > 0 && currY < canvH);
    }

    // allows creating monsters when its time to do it
    function allowMonsterAppear() {
        monsterTimer = setInterval(() => { allowNextMonster = true }, monsterInterval);
    }

    // adds new monster when flag is on 'true' and image is loaded
    function addMonsters() {
        if (allowNextMonster && monsterReady) {
            const maxNumber = Math.floor(monsterNumber)
            for (let i = 0; i < maxNumber; i++) {
                addNewMonster();
            }
            allowNextMonster = false;
        }
    }

    function addNewMonster() {
        const newMonster = createMonster();
        monsters.push(newMonster);
    }

    function drawMonsters() {
        for (let idx in monsters) {
            monsters[idx].move();
            monsters[idx].draw();
            monsters[idx].shoot();
        }
    }

    function createMonster() {
        const startXPos = [0, canvas.width];
        const startYPos = [0, canvas.height];
        const tableChoice = Math.floor(Math.random() * 2);
        const sideChoice = Math.floor(Math.random() * 2);
        let monsterX;
        let monsterY;
        if (tableChoice % 2 === 0) {
            monsterX = startXPos[sideChoice];
            monsterY = Math.floor(Math.random() * canvas.height);
        }
        else {
            monsterY = startYPos[sideChoice];
            monsterX = Math.floor(Math.random() * canvas.width);
        }
        return {
            type: 'monster',
            x: monsterX,
            y: monsterY,
            width: monsterImageWidth,
            height: monsterImageHeight,
            life: 10,
            motion: true,
            shootBlock: false,
            move() {
                if (this.motion) {
                    this.x = this.x > shooter.x ? this.x - 1 : this.x + 1;
                    this.y = this.y > shooter.y ? this.y - 1 : this.y + 1;
                }
            },
            shoot() {
                if (Math.abs(this.x - shooter.x) >= Math.abs(this.y - shooter.y)) {
                    if ((this.x - shooter.x) > -3 && !this.shootBlock) {
                        addNewShoot(this, -15, 0);
                        this.shootBlock = true;
                        setTimeout(() => { this.shootBlock = false }, 1000);
                    }
                    if ((this.x - shooter.x) < 3 && !this.shootBlock) {
                        addNewShoot(this, 15, 0);
                        this.shootBlock = true;
                        setTimeout(() => { this.shootBlock = false }, 1000);
                    }
                }
                else {
                    if ((this.y - shooter.y) > -3 && !this.shootBlock) {
                        addNewShoot(this, 0, -15);
                        this.shootBlock = true;
                        setTimeout(() => { this.shootBlock = false }, 1000);
                    }
                    if ((this.y - shooter.y) < 3 && !this.shootBlock) {
                        addNewShoot(this, 0, 15);
                        this.shootBlock = true;
                        setTimeout(() => { this.shootBlock = false }, 1000);
                    }
                }
            },
            draw() {
                if (monsterReady) {
                    ctx.drawImage(monsterImage, this.x, this.y);
                }
            },
            stop() {
                this.motion = false;
                setTimeout(() => this.motion = true, 200);
            }

        }
    }

    function checkIfMonstersShot() {
        for (let idx in monsters) {
            const x1 = monsters[idx].x;
            const x2 = monsters[idx].x + monsters[idx].width;
            const y1 = monsters[idx].y;
            const y2 = monsters[idx].y + monsters[idx].height;
            const shotCount = countShootsForMonster(x1, x2, y1, y2);
            if (shotCount > 0) {
                monsters[idx].life -= shotCount;
                monsters[idx].stop();
            }
            if (monsters[idx].life === 0) {
                monsters.splice(idx, 1);
                monstersKilled += 1;
                changeMonsterNumber();
            }
        }
    }

    function countShootsForMonster(x1, x2, y1, y2) {
        let shotCounter = 0;
        for (let idx in shooterShoots) {
            // console.log(x1, x2, shoot.x, '----', y1, y2, shoot.y)
            if (shooterShoots[idx].x > x1 && shooterShoots[idx].x < x2 && shooterShoots[idx].y > y1 && shooterShoots[idx].y < y2) {
                shotCounter++;
                shooterShoots.splice(idx, 1);
            }
        }
        return shotCounter;
    }

    function changeMonsterNumber() {
        if (monsterNumber < 5) {
            monsterNumber = Math.ceil(0.1 * monstersKilled + 1);
        }
    }
}

// https://www.codemahal.com/javascript-and-html5-canvas-game-tutorial-code/

// window.onload = () => {
//     let canvas = document.querySelector('#canvas');
//     let ctx = canvas.getContext('2d');
//     canvas.width = 512;
//     canvas.height = 480;

//     let bgReady = false;
//     let bgImage = new Image();
//     bgImage.onload = () => {
//         bgReady = true;
//     }
//     bgImage.src = 'images/background.png';

//     let heroReady = false;
//     let heroImage = new Image();
//     heroImage.onload = () => {
//         heroReady = true;
//     }
//     heroImage.src = 'images/hero.png';

//     let monsterReady = false;
//     let monsterImage = new Image();
//     monsterImage.onload = () => {
//         monsterReady = true;
//     }
//     monsterImage.src = 'images/monster.png';

//     let hero = {
//         speed: 10
//     }

//     let monster = {};
//     let monstersCaught = 0;

//     let keysDown = {};

//     addEventListener('keydown', key => {
//         keysDown[key.key] = true;
//     }, false);

//     addEventListener('keyup', key => {
//         delete keysDown[key.key];
//     }, false);

//     let reset = () => {
//         hero.x = canvas.width / 2;
//         hero.y = canvas.height / 2;
//         monster.x = `${32 + (Math.random() + (canvas.width - 64))}px`;
//         monster.y = `${32 + (Math.random() + (canvas.height - 64))}px`;
//     }

//     let update = (modifier) => {
//         if ('ArrowUp' in keysDown) {
//             hero.y -= hero.speed + modifier;
//         }
//         if ('ArrowDown' in keysDown) {
//             hero.y += hero.speed + modifier;
//         }
//         if ('ArrowLeft' in keysDown) {
//             hero.x -= hero.speed + modifier;
//         }
//         if ('ArrowRight' in keysDown) {
//             hero.x += hero.speed + modifier;
//         }

//     }

//     let render = () => {
//         if (bgReady) {
//             ctx.drawImage(bgImage, 0, 0);
//         }
//         if (heroReady) {
//             ctx.drawImage(heroImage, hero.x, hero.y);
//         }
//     }

//     let count = 100;
//     let finished = false;
//     let counter = () => {
//         count -= 1;
//         if (count <= 0) {
//             clearInterval(counter);
//             finished = true;
//             count = 0;
//             monsterReady = false;
//             heroReady = false;
//         }
//     }

//     setInterval(counter, 1000);
//     let main = () => {
//         update(0.02);
//         render();
//         requestAnimationFrame(main)
//     }

//     var w = window;
//     requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

//     reset();
//     main();


// }