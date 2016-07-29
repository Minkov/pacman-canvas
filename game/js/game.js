/* globals window document console */
"use strict";

function createGame(selector) {
    var canvas = document.querySelector(selector),
        ctx = canvas.getContext("2d"),
        isMouthOpen = false,
        pacman = {
            "x": 50,
            "y": 50,
            "size": 50
        },
        dir = 0,
        keyCodeToDirs = {
            "37": 2,
            "38": 3,
            "39": 0,
            "40": 1
        };
    /* 
    0   -> right
    1   -> down
    2   -> left
    3   -> up
    */

    var steps = 0;
    const stepsToChangeMouth = 10;

    function gameLoop() {
        ctx.fillStyle = "yellow";
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();

        if (isMouthOpen) {
            var deltaRadians = dir * Math.PI / 2;
            ctx.arc(pacman.x, pacman.y, pacman.size, deltaRadians + Math.PI / 4, deltaRadians + 7 * Math.PI / 4);
            ctx.lineTo(pacman.x, pacman.y);
        } else {
            ctx.arc(pacman.x, pacman.y, pacman.size, 0, 2 * Math.PI);
        }

        ctx.fill();
        steps += 1;
        if (0 === (steps % stepsToChangeMouth)) {
            isMouthOpen = !isMouthOpen;

        }
        window.requestAnimationFrame(gameLoop);
    }

    document.body.addEventListener("keydown", function(ev) {
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