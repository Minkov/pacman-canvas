/* globals window document setTimeout*/

window.onload = function() {
    var canvas = document.getElementById("game-canvas");
    var scoreElement = document.getElementById("score");
    var ctx = canvas.getContext("2d");
    var speed = 1.5;
    var pacman = {
        "x": 25,
        "y": 25,
        "size": 20
    };
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

    function drawBalls() {
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
        var obj1Sizes = getSizes(obj1),
            obj2Sizes = getSizes(obj2);
        return ((obj1Sizes.left <= obj2Sizes.left && obj2Sizes.left <= obj1Sizes.right) || (obj1Sizes.left <= obj2Sizes.right && obj2Sizes.right <= obj1Sizes.right)) &&
            ((obj1Sizes.top <= obj2Sizes.top && obj2Sizes.top <= obj1Sizes.bottom) || (obj1Sizes.top <= obj2Sizes.bottom && obj2Sizes.bottom <= obj1Sizes.bottom));
    }

    function getIndexOfCollidingBall() {
        var i, ball;
        for (i = 0; i < balls.length; i += 1) {
            ball = balls[i];
            if (areColliding(ball, pacman)) {
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
        var index;
        if (window.isStopped) {
            window.requestAnimationFrame(step);
            return;
        }
        stepsCount += 1;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (stepsCount % 10 === 0) {
            isMouthOpen = !isMouthOpen;
            dir = newDir;
        }

        pacman.x += dirs[dir].x * speed;
        pacman.y += dirs[dir].y * speed;

        drawPacman(ctx, pacman.x, pacman.y, isMouthOpen);
        drawBalls();

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
        37: 2,
        38: 3,
        39: 0,
        40: 1
    };

    document.addEventListener("keydown", function(ev) {
        if (!keyCodesToDirs.hasOwnProperty(ev.keyCode)) {
            return;
        }
        newDir = keyCodesToDirs[ev.keyCode];
    });
};