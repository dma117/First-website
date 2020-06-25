'use-strict';

// canvas
var canvas, 
    img, 
    ctx;

// process game
var interval,
    rightPressed,
    leftPressed,
    pause,
    checkedName,
    delay,
    ticks,
    coefficient;

// objects and data
var figures,
    weapons,
    score,
    level,
    player,
    playerName = " ";
    
// enemies view
var whiteBird = new Image();
whiteBird.src = "/images/white_bird/white_bird_0.png";

var dummyBird = new Image();
dummyBird.src = '/images/dummy_bird/dummy_bird0.png';

var intelligentBird = new Image();
intelligentBird.src = '/images/intelligent_bird/intelligent_bird1.png';

var enemyData = [
    {
        size: 120,
        speed: 10,
        pts: 5,
        img: whiteBird
    },
    {
        size: 100,
        speed: 18,
        pts: 5,
        img: dummyBird
    },
    {
        size: 200,
        speed: 15,
        pts: 5,
        img: intelligentBird
    }
];

function inputName() {
    var name = prompt('Введите Ваше имя:');

    if (Boolean(name)) {
        playerName = name;
    } else {
        inputName();
    }
}

function restartGame() {
    pause = false;
    weapons.length = 0;
    enemies.length = 0;
    ticks = 0;
    clearInterval(interval);
    if (canvas != undefined) {
        canvas.remove();
    }
    init();
}

function pauseGame() {
    clearInterval(interval);
    pause = true;
}

function startGame() {
    inputName();
    init();
}

function changeUser() {
    inputName();
    restartGame();
}

function showResults() {
    localStorage.setItem(playerName, score); 

    let html = "<table><th>ИМЯ</th><th>ОЧКИ</th>";
    for (let i = 0; i < localStorage.length && i < 15; i++) {
        html += "<tr aling=\"center\">";
        for (let j = 0; j < 1; j++) {
            let key = localStorage.key(i)
            html += "<td>" + localStorage.key(i) + "</td>";
            html += "<td>" + localStorage.getItem(key) + "</td>"
        }
        html += "</tr>";
    }
    html += "</table>";

    document.getElementById("results").innerHTML = html;
}

function setTimer() {
    pause = false;
    clearInterval(interval);
    interval = setInterval(drawGame, 50);
}

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
    player = new Player();
    rightPressed = false;
    leftPressed = false;
    enemies = [];
    weapons = [];
    rotate = false;
    delay = 10;
    ticks = 0;
    coefficient = 1361;
    pause = false;

    if (canvas.getContext) {
        document.addEventListener("mousemove", mouseMoveHandler, false);
        canvas.addEventListener("click", mouseClickHandler, false);
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        setTimer();
        loadBackground();
        getRandomEnemy();
    }
}

function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: "+level, 30, 50);
    ctx.fillText("Score: "+score, 30, 80);
    ctx.fillText("Health: "+player.health, 30, 110);
    ctx.fillText("Player: "+player.name, 30, 140);
}

function drawGame() {
    ticks++;
    ticks % coefficient;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawScore();
    player.rotate();
    player.draw();
    movePlayer();
    ctx.restore();

    console.log(enemies.length);

    for (let i = 0; i < weapons.length; i++) {
        if (weapons[i].isInsideCanvas()) {
            weapons[i].draw();
        } else {
            weapons.splice(i--, 1);
        }
    }

    if (ticks % delay == 0) {
        getRandomEnemy();
    }

    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].isInsideCanvas()) {
            enemies[i].draw();
            enemies[i].move();
        } else {
            player.health--;
            if (player.health == 0) {
                showResults();
            }
            enemies.splice(i--, 1);
        }
    }

    for (let i = 0; i < weapons.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (isHitted(weapons[i], enemies[j])) {
                score++;
                enemies.splice(j--, 1);
                weapons.splice(i--, 1);
                if (i == -1) {
                    break;
                }
            } 
        }
    }
}

function movePlayer() {
    if (rightPressed) {
        player.posX += player.speed;
        if (player.posX + player.radius > canvas.width){
            player.posX = canvas.width - player.radius;
        }
    }
    if (leftPressed) {
        player.posX -= player.speed;
        if (player.posX < player.radius){
            player.posX = player.radius;
        }
    }
}

function mouseMoveHandler(e) {
    if (!pause) {
        player.angle = Math.atan2((e.clientY - player.posY), (e.clientX - player.posX));
    }
}

function mouseClickHandler(e) {
    if (!pause) {
        var weapon = new Ball(player.angle);
        weapons.push(weapon);
    }
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.key.toLowerCase() == 'd' || e.key.toLowerCase() == 'в') {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft" || e.key.toLowerCase() == 'a' || e.key.toLowerCase() == 'ф') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.key.toLowerCase() == 'd' || e.key.toLowerCase() == 'в') {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft" || e.key.toLowerCase() == 'a' || e.key.toLowerCase() == 'ф') {
        leftPressed = false;
    }
}

class Player {
    constructor() {
        this.posX = 100;
        this.posY = 500;
        this.radius = 40;
        this.speed = 10;
        this.angle = Math.PI / 4;
        this.health = 100;
        this.color = '#000080';
        this.name = playerName;
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
        ctx.rotate(Math.PI / 2 + this.angle);
        ctx.translate(-this.posX, -this.posY);
        //ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

class Ball {
    constructor(angle) {
        this.posX = player.posX;
        this.posY = player.posY;
        this.radius = 10;
        this.angle = angle;
        this.speed = 30;
        this.color = 'rgb('+Math.floor(Math.random()*256)+','
                        +Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')';
    }

    colorFigure() {
        var gradient = ctx.createRadialGradient(this.posX+this.radius/4,
        this.posY-this.radius/6, this.radius/8, this.posX, this.posY, this.radius);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.85, this.color);
        return gradient;
    }

    draw() {
        ctx.fillStyle = this.colorFigure();
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fill();
        this.posX += (Math.cos(this.angle)) * this.speed;
        this.posY += (Math.sin(this.angle)) * this.speed;
    }

    isInsideCanvas() {
        if ((this.posX <= canvas.width) && (this.posY <= canvas.height) && (this.posX >= 0) && (this.posY >= 0)) {
            return true;
        } else {
            return false;
        }
    }
}

class Enemy {
    constructor(size, x, y, speed, img, pts) {
        this.size = size;
        this.posX = x;
        this.posY = y;
        this.speed = speed;
        this.img = img;
        this.pts = pts;
    }

    draw() {  
        ctx.drawImage(this.img, this.posX, this.posY, this.size, this.size);
    }

    move() {
        this.posX += Math.floor(Math.random() * 2) - this.speed;
        this.posY += Math.floor(Math.random() * 5) - 2;
    }

    isInsideCanvas() {
        if (this.posX <= canvas.width && this.posX + this.size >= 0) {
            return true;
        } else {
            return false;
        }
    }
}

function getRandomEnemy() {
    var enemy = enemyData[Math.floor(Math.random() * enemyData.length)];

    var posX = canvas.width;
    var posY = canvas.height - Math.floor(Math.random() * (canvas.height + 200)); //TODO

    enemies.push(new Enemy(enemy.size, posX, posY, enemy.speed, enemy.img, enemy.pts));
}

function isHitted(item1, item2) {
    if (item1.posX >= item2.posX && item1.posX <= item2.posX + item2.size &&
        item1.posY >= item2.posY && item1.posY <= item2.posY + item2.size) {
        return true;
    } else {
        return false;
    }
}