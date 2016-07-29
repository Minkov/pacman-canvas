/* globals window document console */
"use strict";

const maze = [
        "**** *************************",
        "**** ************** **********",
        "**** ************** **********",
        "      ** **********           ",
        "**** *** ********** **********",
        "****                **********",
        "****  * **********************",
        "**** *************************"
    ],
    ballChar = " ",
    wallChar = "*";

function createGame(pacmanSelector, mazeSelector) {
    var pacmanCanvas = document.querySelector(pacmanSelector),
        ctxPacman = pacmanCanvas.getContext("2d"),
        mazeCanvas = document.querySelector(mazeSelector),
        ctxMaze = mazeCanvas.getContext("2d"),
        isMouthOpen = false,
        pacman = {
            "x": 0,
            "y": 92,
            "size": 26,
            "speed": 2
        },
        balls = [],
        walls = [],
        dir = 0,
        keyCodeToDirs = {
            "37": 2,
            "38": 3,
            "39": 0,
            "40": 1
        };

    const dirDeltas = [{
            "x": +1,
            "y": 0
        }, {
            "x": 0,
            "y": +1
        }, {
            "x": -1,
            "y": 0
        }, {
            "x": 0,
            "y": -1
        }],
        rows = maze.length,
        columns = maze[0].length;

    mazeCanvas.width = (columns + 1) * pacman.size;
    mazeCanvas.height = (rows + 1) * pacman.size;

    pacmanCanvas.width = (columns + 1) * pacman.size;
    pacmanCanvas.height = (rows + 1) * pacman.size;
    var steps = 0;
    const stepsToChangeMouth = 10;

    function gameLoop() {
        const offset = 5;
        ctxPacman.clearRect(pacman.x - offset, pacman.y - offset, pacman.size + offset * 2, pacman.size + offset * 2);

        drawPacman();
        steps += 1;
        if (0 === (steps % stepsToChangeMouth)) {
            isMouthOpen = !isMouthOpen;
        }

        balls.forEach(function(ball, index) {
            if (areCollinding(pacman, ball)) {
                ctxMaze.clearRect(ball.x, ball.y, ball.size, ball.size);
                balls.splice(index, 1);
                console.log(`Eated ball ${JSON.stringify(ball)}`);
            }
        });

        var isPacmanCollidingWithWall = false;
        var futurePosition = {
            "x": pacman.x + dirDeltas[dir].x + 1,
            "y": pacman.y + dirDeltas[dir].y + 1,
            "size": pacman.size - 2
        };

        walls.forEach(function(wall) {
            if (areCollinding(futurePosition, wall) || areCollinding(wall, futurePosition)) {
                isPacmanCollidingWithWall = true;
            }
        });

        if (!isPacmanCollidingWithWall) {
            if (updatePacmanPosition()) {
                ctxPacman.clearRect(0, 0, pacmanCanvas.width, pacmanCanvas.height);
            }
        }

        window.requestAnimationFrame(gameLoop);
    }

    function positionToBounds(obj) {
        var sizes = {
            "top": obj.y,
            "left": obj.x,
            "bottom": obj.y + obj.size,
            "right": obj.x + obj.size
        };
        return sizes;
    }

    function isBetween(value, min, max) {
        return min <= value && value <= max;
    }

    function areCollinding(obj1, obj2) {
        var sizes1 = positionToBounds(obj1),
            sizes2 = positionToBounds(obj2);
        return (isBetween(sizes2.left, sizes1.left, sizes1.right) ||
                isBetween(sizes2.right, sizes1.left, sizes1.right)) &&
            (isBetween(sizes2.top, sizes1.top, sizes1.bottom) ||
                isBetween(sizes2.bottom, sizes1.top, sizes1.bottom));
    }

    function drawBall(ctx, ballToDraw) {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        var x = ballToDraw.x + ballToDraw.size / 2;
        var y = ballToDraw.y + ballToDraw.size / 2;
        var size = ballToDraw.size / 2;
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }

    function drawPacman() {
        var deltaRadians;
        ctxPacman.beginPath();
        ctxPacman.fillStyle = "yellow";
        if (isMouthOpen) {
            var x = pacman.x + pacman.size / 2;
            var y = pacman.y + pacman.size / 2;
            var size = pacman.size / 2;
            deltaRadians = dir * Math.PI / 2;
            ctxPacman.arc(x, y, size, deltaRadians + Math.PI / 4, deltaRadians + 7 * Math.PI / 4);
            ctxPacman.lineTo(x, y);
        } else {
            drawBall(ctxPacman, pacman);
        }

        ctxPacman.fill();
    }

    function updatePacmanPosition() {
        pacman.x += dirDeltas[dir].x * pacman.speed;
        pacman.y += dirDeltas[dir].y * pacman.speed;

        if (pacman.x < 0 || pacman.x >= pacmanCanvas.width ||
            pacman.y < 0 || pacman.y >= pacmanCanvas.height) {
            pacman.x = (pacman.x + pacmanCanvas.width) % pacmanCanvas.width;
            pacman.y = (pacman.y + pacmanCanvas.height) % pacmanCanvas.height;
            return true;
        }

        return false;
    }

    document.body.addEventListener("keydown", function(ev) {
        if (!keyCodeToDirs.hasOwnProperty(ev.keyCode)) {
            console.log("Wrong dir");
            return;
        }

        dir = keyCodeToDirs[ev.keyCode];
        console.log(dir);
    });

    function drawMazeAndGetBallsAndWalls(ctx, maze, cellSize) {
        var row,
            col,
            cell,
            obj,
            balls = [],
            walls = [],
            wallImage = document.getElementById("wallImage");

        for (row = 0; row < maze.length; row += 1) {
            for (col = 0; col < maze[row].length; col += 1) {
                cell = maze[row][col];
                if (cell === ballChar) {
                    obj = {
                        "x": col * cellSize + cellSize / 4,
                        "y": row * cellSize + cellSize / 4,
                        "size": cellSize / 2
                    };
                    balls.push(obj);

                    drawBall(ctx, obj);
                } else if (cell === wallChar) {
                    obj = {
                        "x": col * cellSize,
                        "y": row * cellSize,
                        "size": cellSize
                    };
                    ctx.drawImage(wallImage, obj.x, obj.y, cellSize, cellSize);
                    walls.push(obj);
                }
            }
        }
        return [
            balls,
            walls
        ];
    }

    return {
        "start": function() {
            [balls, walls] = drawMazeAndGetBallsAndWalls(ctxMaze, maze, pacman.size + 4);
            gameLoop();
        }
    };
}