'use-strict';

var canvas, 
    img, 
    ctx,  
    figures,
    idTimer,
    score,
    health,
    level,
    player,
    rightPressed,
    leftPressed,
    dx,
    dy,
    enemyBall,
    enemies,
    rotate;

function loadBackground() {
    img = new Image();

    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawGame();
    };

    img.src = "/images/background3.jpg";
}

function init(){
    canvas = document.createElement("canvas");
    canvas.width = 1260;
    canvas.height = 600;
    level = 0;
    score = 0;
    health = 100;
    player = new Player();
    rightPressed = false;
    leftPressed = false;
    //dx = 2;
    dy = -2;
    enemyBall = new Ball();
    enemies = [];
    enemies.push(enemyBall);
    rotate = false;

    if (canvas.getContext) {
        document.addEventListener("mousemove", mouseMoveHandler, false);
        document.addEventListener("click", mouseClickHandler, false);
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        loadBackground();
    }
}

function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: "+level, 30, 50);
    ctx.fillText("Score: "+score, 30, 80);
    ctx.fillText("Health: "+health, 30, 110);
    ctx.fillText("Player: "+player.name, 30, 140);
}

function drawGame() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawScore();
    player.rotate();
    player.draw();
    enemyBall.draw();
    movePlayer();
    ctx.restore();
}

function movePlayer() {
    if(rightPressed) {
        player.posX += 7;
        if (player.posX + player.radius > canvas.width){
            player.posX = canvas.width - player.radius;
        }
    }
    else if(leftPressed) {
        player.posX -= 7;
        if (player.posX < player.radius){
            player.posX = player.radius;
        }
    }
}

function mouseMoveHandler(e) {
    player.angle = Math.atan2((e.clientY - player.posY), (e.clientX - player.posX));
}

function mouseClickHandler(e) {
    var posX = e.clientX;
    var posY = e.clientY;
    
    dx = posX;
    dy = posY;
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

class Player {
    constructor() {
        this.posX = 100;
        this.posY = 500;
        this.radius = 40;
        this.angle = Math.PI / 4;
        this.color = '#000080';
        this.name = "dma";
    }

    colorPlayer(ctx){
        var gradient = ctx.createRadialGradient(this.posX+this.radius/5,
        this.posY-this.radius/2, this.radius/10, this.posX, this.posY, this.radius);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.85, this.color);
        return gradient;
    }

    draw() {
        ctx.fillStyle = this.colorPlayer(ctx);
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        let [x, y, radius] = [this.posX, this.posY, this.radius];
        ctx.moveTo(x - radius / 6, y - radius * 1.8);
        ctx.lineTo(x + radius / 6, y - radius * 1.8);
        ctx.lineTo(x + radius / 6, y - radius + 1);
        ctx.lineTo(x - radius / 6, y - radius + 1);
        ctx.closePath();
        ctx.fill();
    }

    rotate() {
        ctx.translate(this.posX, this.posY);
        //ctx.rotate(Math.PI / 2 - this.angle);
        ctx.rotate(Math.PI/2 + this.angle);
        ctx.translate(-this.posX, -this.posY);
    }
}

class Ball {
    constructor() {
        this.posX = player.posX;
        this.posY = player.posY;
        this.radius = 10;
        this.color = 'rgb('+Math.floor(Math.random()*256)+','
                        +Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')';
    }

    colorFigure(ctx){
        // формируем градиентную заливку для шарика
        var gradient = ctx.createRadialGradient(this.posX+this.radius/4,
        this.posY-this.radius/6, this.radius/8, this.posX, this.posY, this.radius);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.85, this.color);
        return gradient;
    }

    draw() {
        ctx.fillStyle = this.colorFigure(ctx);
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fill();
        //this.posX += dx;
        this.posY += dy;
    }
}

var interval = setInterval(drawGame, 10);