/* globals window document setTimeout*/

window.onload = function() {
    var canvas = document.getElementById("game-canvas");
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "yellow";


    function drawPacman(ctx, x, y, isMouthOpen) {
        isMouthOpen = !!isMouthOpen;
        ctx.save();

        ctx.beginPath();
        if (isMouthOpen) {
            ctx.arc(x, y, 50, 1.8 * Math.PI, 2.2 * Math.PI, true);
            ctx.lineTo(x, y);
        } else {
            ctx.arc(x, y, 50, 0, 2 * Math.PI, true);

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
            drawPacman(ctx, 50, 50, isMouthOpen);
        }
        window.requestAnimationFrame(step);
    }
    step();
};