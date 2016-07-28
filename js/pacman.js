/* globals window document setTimeout*/

window.onload = function() {
    var labyrinthCanvas = document.getElementById("labyrinth-canvas");
    var gameCanvas = document.getElementById("game-canvas");
    var scoreElement = document.getElementById("score");
    var gameCtx = gameCanvas.getContext("2d");
    var labyrinthCtx = labyrinthCanvas.getContext("2d");

    var speed = 1;
    var pacman = {
        "x": 60,
        "y": 80,
        "size": 20
    };

    var nextPosition;

    var bounds = {
        "width": gameCanvas.width,
        "height": gameCanvas.height
    };

    var rows = bounds.height / (pacman.size + 2);
    var cols = bounds.width / (pacman.size + 2);

    var obstacles = [],
        obstacle;

    var isMouthOpen = false;

    var stepsCount = 0;

    var score = 0;

    var balls = [{
        "x": 150,
        "y": 150,
        "size": 10
    }];

    var dir = 0;
    var newDir = 0;
    var dirs = [{
        "x": 1,
        "y": 0
    }, {
        "x": 0,
        "y": 1
    }, {
        "x": -1,
        "y": 0
    }, {
        "x": 0,
        "y": -1
    }];

    var stepsForDirChange = 0;

    drawLabyrinth(labyrinthCtx);

    function drawLabyrinth(ctx) {

        //30x20
        var lab = [
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", " ", " ", " ", " ", " ", " ", " ", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", " ", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", " ", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", " ", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", " ", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", " ", " ", " ", " ", " ", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"]
            ],
            row, col, size = pacman.size * 2;

        ctx.save();
        ctx.fillStyle = "black";
        for (row = 0; row < rows; row += 1) {
            for (col = 0; col < cols; col += 1) {
                if (!lab[row] || !lab[row][col]) {
                    continue;
                }
                if (lab[row][col] === "*") {
                    obstacles.push({
                        "x": col * size - size / 2 + size + 1,
                        "y": row * size - size / 2 + size + 1,
                        "size": size / 2
                    });
                    ctx.fillRect(col * size, row * size, size, size);
                }
            }
        }

        ctx.restore();
    }

    function drawPacman(ctx, x, y, isMouthOpen) {
        isMouthOpen = !!isMouthOpen;
        ctx.save();

        ctx.fillStyle = "yellow";
        ctx.beginPath();

        if (isMouthOpen) {
            ctx.arc(x, y, pacman.size, (dir / 2) * Math.PI + 1.8 * Math.PI, (dir / 2) * Math.PI + 2.2 * Math.PI, true);
            ctx.lineTo(x, y);
        } else {
            ctx.arc(x, y, pacman.size, 0, 2 * Math.PI, true);

        }
        ctx.closePath();
        ctx.fillStyle = "yello";
        ctx.fill();
        ctx.restore();
    }

    function drawBalls(ctx) {
        ctx.save();
        ctx.beginPath();

        ctx.fillStyle = "yellow";

        balls.forEach(function(ball) {
            ctx.moveTo(ball.x, ball.y);
            ctx.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
            ctx.fill();
        });
        ctx.restore();
    }

    function getSizes(rect) {
        return {
            "top": rect.y - rect.size,
            "right": rect.x + rect.size,
            "bottom": rect.y + rect.size,
            "left": rect.x - rect.size
        };
    }

    function areColliding(obj1, obj2) {
        var sizes1 = getSizes(obj1),
            sizes2 = getSizes(obj2);

        return ((sizes1.left <= sizes2.left && sizes2.left <= sizes1.right) || (sizes1.left <= sizes2.right && sizes2.right <= sizes1.right)) &&
            ((sizes1.top <= sizes2.top && sizes2.top <= sizes1.bottom) || (sizes1.top <= sizes2.bottom && sizes2.bottom <= sizes1.bottom));
    }

    function getIndexOfCollidingBall() {
        var i, ball;
        for (i = 0; i < balls.length; i += 1) {
            ball = balls[i];
            if (areColliding(pacman, ball)) {
                return i;
            }
        }

        return -1;
    }

    function updateScore() {
        scoreElement.innerHTML = `Score: ${score}`;
    }

    isMouthOpen = false;
    stepsCount = 0;

    function step() {

        if (stepsCount > (1 << 10)) {
            stepsCount = 0;
        }

        var index;
        if (!window.isRunning) {
            window.requestAnimationFrame(step);
            return;
        }
        stepsCount += 1;
        gameCtx.clearRect(0, 0, gameCtx.canvas.width, gameCtx.canvas.height);

        if (stepsCount % 10 === 0) {
            isMouthOpen = !isMouthOpen;
        }

        stepsForDirChange += 1;

        nextPosition = {
            "x": pacman.x + dirs[dir].x * speed,
            "y": pacman.y + dirs[dir].y * speed,
            "size": pacman.size
        };

        var areCollidingWithObstracle;

        for (obstacle of obstacles) {
            if (areColliding(nextPosition, obstacle)) {
                areCollidingWithObstracle = true;
                break;
            }
        }

        if (!areCollidingWithObstracle) {
            pacman.x += dirs[dir].x * speed;
            pacman.y += dirs[dir].y * speed;
        }

        drawPacman(gameCtx, pacman.x, pacman.y, isMouthOpen);
        drawBalls(gameCtx);

        index = getIndexOfCollidingBall();
        if (index >= 0) {
            balls.splice(index, 1);
            score += 1;
        }

        updateScore();
        window.requestAnimationFrame(step);
    }
    step();

    var keyCodesToDirs = {
        "37": 2,
        "38": 3,
        "39": 0,
        "40": 1
    };

    document.addEventListener("keydown", function(ev) {
        if (!keyCodesToDirs.hasOwnProperty(ev.keyCode)) {
            return;
        }
        dir = keyCodesToDirs[ev.keyCode];
    });
};