window.onload = () => {
    // CANVAS
    let canvas = document.querySelector('#canvas');
    let ctx = canvas.getContext('2d');
    ctx.font = '80px Georgia';
    handleCanvasSize();

    const startWindow = document.querySelector('#startWindow');
    const gameOverWindow = document.querySelector('#gameOverWindow');
    const startButton = document.querySelector('#startButton');
    const retryButton = document.querySelector('#retryButton');
    const gameInfo = document.querySelector('#gameInfo');

    let shootManager;
    let shooter;
    let monsterManager;

    let shootAllowed = true;

    let rightKeyPressed = false;
    let leftKeyPressed = false;
    let upKeyPressed = false;
    let downKeyPressed = false;

    startButton.addEventListener('click', () => startGame());
    retryButton.addEventListener('click', () => retryGame());



    function startGame() {
        shootManager = new ShootManager(canvas, ctx);
        shooter = new Shooter(canvas, ctx, shootManager);
        monsterManager = new MonsterManager(ctx, shootManager, shooter);
        handleKeyActions();
        startWindow.style.visibility = 'hidden';
        render();
    }

    function render() {
        if (shooter.life <= 0) {
            stopGame();
            return;
        }
        console.log(shooter.life)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shooter.run();
        changeShooterPosition();
        shootManager.manage();
        monsterManager.manage();
        printGameState();
        requestAnimationFrame(render);
    }

    function stopGame() {
        gameInfo.innerHTML = `Your Score : ${monsterManager.monstersKilled}`;
        canvas.style.visibility = 'hidden';
        gameOverWindow.style.visibility = 'visible';
    }

    function retryGame() {
        shooter.reset();
        shootManager.reset();
        monsterManager.reset();
        canvas.style.visibility = 'visible';
        gameOverWindow.style.visibility = 'hidden';
        render();
    }

    function printGameState() {
        if (shooter) {
            gameInfo.innerHTML = `Life : ${shooter.life}  Score : ${monsterManager.monstersKilled}`
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
            shootManager.addNewShoot(shooter, 'up');
        }
        if (event.key === "s" && shootAllowed) {
            shootManager.addNewShoot(shooter, 'down');
        }
        if (event.key === "a" && shootAllowed) {
            shootManager.addNewShoot(shooter, 'left');
        }
        if (event.key === "d" && shootAllowed) {
            shootManager.addNewShoot(shooter, 'right');
        }
        shootAllowed = !pressed;
    }

    function changeShooterPosition() {
        if (rightKeyPressed) {
            shooter.changeShooterPosition('right');
        }
        if (leftKeyPressed) {
            shooter.changeShooterPosition('left');
        }
        if (upKeyPressed) {
            shooter.changeShooterPosition('up');
        }
        if (downKeyPressed) {
            shooter.changeShooterPosition('down');
        }
    }

    function handleCanvasSize() {
        setCanvasSize();
        window.addEventListener('resize', () => setCanvasSize());
    }

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

}

