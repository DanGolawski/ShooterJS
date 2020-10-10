window.onload = () => {
    let canvas = document.querySelector('#canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 500;

    let shooterImage = new Image();
    shooterImage.src = 'images/hero.png';
    let shooterReady = false;
    let shooterImageWidth;
    let shooterImageHeight;
    shooterImage.onload = () => {
        shooterImageWidth = shooterImage.width;
        shooterImageHeight = shooterImage.height;
        createShooter();
        shooterReady = true;
    }

    let monsterImage = new Image();
    monsterImage.src = 'images/monster.png';
    let monsterReady = false;
    let monsterImageWidth;
    let monsterImageHeight;
    let allowNextMonster = true;
    let shooter;
    monsterImage.onload = () => {
        monsterImageWidth = monsterImage.width;
        monsterImageHeight = monsterImage.height;
        monsterReady = true;
    }

    // the list where shoots objects are stored 
    // let shoots = [];
    let shooterShoots = [];
    let monsterShoots = [];
    // allows to shoot only when the key is up
    let shootAllowed = true;
    // the list where monsters objects are stored
    let monsters = [];
    // time when next monster appears
    let monsterInterval = 10000;


    // keys pressed
    let rightKeyPressed = false;
    let leftKeyPressed = false;
    let upKeyPressed = false;
    let downKeyPressed = false;

    handleKeyActions();
    allowMonsterAppear();
    render();

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        changeShooterPosition();
        drawShooter();
        drawShoots();
        addMonsters();
        drawMonsters();
        checkIfMonstersShot();
        requestAnimationFrame(render);
    }

    function createShooter() {
        shooter = {
            type: 'shooter',
            x: canvas.width / 2,
            y: canvas.height / 2,
            width: shooterImageWidth,
            height: shooterImageHeight,
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
        console.log(shooterObj.width, shooterObj.height)
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
        // console.log('shooter : ', shooterShoots.length, 'monsters : ', monsterShoots.length);
    }

    function checkShootPos(shoot) {
        const currX = shoot.getX();
        const currY = shoot.getY();
        const canvW = canvas.width;
        const canvH = canvas.height;
        return (currX > 0 && currX < canvW) && (currY > 0 && currY < canvH);
    }

    function allowMonsterAppear() {
        setInterval(() => { allowNextMonster = true }, monsterInterval);
    }

    function addMonsters() {
        if (allowNextMonster && monsterReady) {
            addNewMonster();
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
            shootBlock: false,
            move() {
                this.x = this.x > shooter.x ? this.x - 1 : this.x + 1;
                this.y = this.y > shooter.y ? this.y - 1 : this.y + 1;
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

            }

        }
    }

    function checkIfMonstersShot() {
        for (let monster of monsters) {
            const monstX1 = monster.x;
            const monstX2 = monster.x + monsterImage.width;
            const monstY1 = monster.y;
            const monstY2 = monster.y + monsterImage.height;
            ctx.beginPath();
            ctx.moveTo(monstX1, monstY1);
            ctx.lineTo(monstX2, monstY2);
            ctx.stroke();
            // monster.life -= countShoots(monster.x, monster.y, tolleranceX, tolleranceY);
        }
    }

    function countShoots(objX, objY, tolleranceX, tolleranceY) {
        let shotCounter = 0;
        for (let shoot of shooterShoots) {
            const distanceX = shoot.x - objX;
            const distanceY = shoot.y - objY;
            if (distanceX <= tolleranceX && distanceY < tolleranceY) {
                shotCounter++;
            }
        }
        console.log(shotCounter);
        return shotCounter;
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