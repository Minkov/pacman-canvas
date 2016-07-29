/* globals window document console */
"use strict";

const maze = [
        "**** ************** *******",
        "**** ************** *******",
        "**** ************** *******",
        "      ** **********        ",
        "**** *** ********** *******",
        "****                *******",
        "***** * *******************",
        "*****   *******************"
    ],
    ballChar = " ",
    wallChar = "*";

function createGame(pacmanSelector, mazeSelector) {
    var pacmanCanvas = document.querySelector(pacmanSelector),
        ctxPacman = pacmanCanvas.getContext("2d"),
        isMouthOpen = false,
        pacman = {
            "x": 0,
            "y": 0,
            "size": 30,
            "speed": 2
        },
        ball = {
            "x": 200,
            "y": 100,
            "size": 10
        },
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
    }];

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

        drawBall(ball);

        if (areCollinding(pacman, ball)) {
            ball = {
                "x": (Math.random() * 200) | 0,
                "y": (Math.random() * 100) | 0,
                "size": ball.size
            };
        }

        if (updatePacmanPosition()) {
            ctxPacman.clearRect(0, 0, pacmanCanvas.width, pacmanCanvas.height);
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

    function drawBall(ballToDraw) {
        ctxPacman.fillStyle = "yellow";
        ctxPacman.beginPath();
        var x = ballToDraw.x + ballToDraw.size / 2;
        var y = ballToDraw.y + ballToDraw.size / 2;
        var size = ballToDraw.size / 2;
        ctxPacman.arc(x, y, size, 0, 2 * Math.PI);
        ctxPacman.fill();
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
            drawBall(pacman);
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
        ev.preventDefault();
        if (!keyCodeToDirs.hasOwnProperty(ev.keyCode)) {
            console.log("Wrong dir");
            return;
        }

        dir = keyCodeToDirs[ev.keyCode];
        console.log(dir);
    });

    return {
        "start": function() {
            gameLoop();
        }
    };
}