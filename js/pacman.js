/* globals window document setTimeout*/

window.onload = function() {
    var canvas = document.getElementById("game-canvas");
    var ctx = canvas.getContext("2d");
    var size = 20;
    var speed = 1.5;
    var position = {
        "x": 25,
        "y": 25
    };

    var dir = 0;
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

    function drawPacman(ctx, x, y, isMouthOpen) {
        isMouthOpen = !!isMouthOpen;
        ctx.save();

        ctx.fillStyle = "yellow";
        ctx.beginPath();

        if (isMouthOpen) {
            ctx.arc(x, y, size, (dir / 2) * Math.PI + 1.8 * Math.PI, (dir / 2) * Math.PI + 2.2 * Math.PI, true);
            ctx.lineTo(x, y);
        } else {
            ctx.arc(x, y, size, 0, 2 * Math.PI, true);

        }
        ctx.closePath();
        ctx.fillStyle = "yello";
        ctx.fill();
        ctx.restore();
    }

    var isMouthOpen = false;

    var stepsCount = 0;

    function step() {
        stepsCount += 1;
        if (stepsCount % 7 === 0) {
            isMouthOpen = !isMouthOpen;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            drawPacman(ctx, position.x, position.y, isMouthOpen);
        }

        position.x += dirs[dir].x * speed;
        position.y += dirs[dir].y * speed;

        window.requestAnimationFrame(step);
    }
    step();

    var keyCodesToDirs = {
        37: 2,
        38: 3,
        39: 0,
        40: 1
    };

    document.addEventListener("keydown", function(ev) {
        console.log(ev.keyCode);
        if (!keyCodesToDirs.hasOwnProperty(ev.keyCode)) {
            return;
        }
        dir = keyCodesToDirs[ev.keyCode];
    });
};