'use-strict';

// canvas && background
var canvas, 
    img, 
    ctx,
    background;

// process game
var interval,
    rightPressed,
    leftPressed,
    pause,
    checkedName,
    delay,
    ticks,
    coefficient,
    levelUp,
    mouseX,
    mouseY,
    gotResult = false;

// objects and data
var figures,
    weapons,
    score,
    level,
    player,
    playerName = " ",
    hearts;

// enemies view

// white bird
var wb1 = new Image();
wb1.src = "/images/white_bird/white_bird_0.png";
var wb2 = new Image();
wb2.src = '/images/white_bird/white_bird_1.png';
var wb3 = new Image();
wb3.src = '/images/white_bird/white_bird_2.png';
var wb4 = new Image();
wb4.src = '/images/white_bird/white_bird_3.png';

// dummy bird
var db1 = new Image();
db1.src = '/images/dummy_bird/dummy_bird0.png';
var db2 = new Image();
db2.src = '/images/dummy_bird/dummy_bird1.png';
var db3 = new Image();
db3.src = '/images/dummy_bird/dummy_bird2.png';
var db4 = new Image();
db4.src = '/images/dummy_bird/dummy_bird3.png';

// intellegent bird
var ib1 = new Image();
ib1.src = '/images/intelligent_bird/intellegent_bird0.png';
var ib2 = new Image();
ib2.src = '/images/intelligent_bird/intellegent_bird1.png';
var ib3 = new Image();
ib3.src = '/images/intelligent_bird/intelligent_bird2.png';
var ib4 = new Image();
ib4.src = '/images/intelligent_bird/intelligent_bird3.png';

// green bird
var gb1 = new Image();
gb1.src = '/images/green/flying/green_bird0.png';
var gb2 = new Image();
gb2.src = '/images/green/flying/green_bird1.png';
var gb3 = new Image();
gb3.src = '/images/green/flying/green_bird2.png';
var gb4 = new Image();
gb4.src = '/images/green/flying/green_bird3.png';
var gb5 = new Image();
gb5.src = '/images/green/flying/green_bird4.png';

// heart
var heart1 = new Image();
heart1.src = '/images/heart/heart0.png';
var heart2 = new Image();
heart2.src = '/images/heart/heart1.png';
var heart3 = new Image();
heart3.src = '/images/heart/heart2.png';
var heart4 = new Image();
heart4.src = '/images/heart/heart3.png';
var heart5 = new Image();
heart5.src = '/images/heart/heart4.png';

var heartData = [
    {
        img: heart1,
        health: 3,
        size: 15,
        speed: 4
    },
    {
        img: heart2,
        health: 4,
        size: 18,
        speed: 5
    },
    {
        img: heart3,
        health: 5,
        size: 22,
        speed: 6
    },
    {
        img: heart4,
        health: 6,
        size: 25,
        speed: 7
    },
    {
        img: heart5,
        health: 7,
        size: 30,
        speed: 8
    }
]

var enemyData = [
    {
        size: 120,
        speed: 8,
        pts: 5,
        animation:
        [
            wb1,
            wb2,
            wb3,
            wb4
        ],
        delay: 6,
        health: false
    },
    {
        size: 100,
        speed: 10,
        pts: 7,
        animation:
        [
            db1,
            db2,
            db3,
            db4
        ],
        delay: 4,
        health: false
    },
    {
        size: 140,
        speed: 13,
        pts: 9,
        animation:
        [
            ib1,
            ib2,
            ib3,
            ib4
        ],
        delay: 3,
        health: false
    },
    {
        size: 120,
        speed: 11,
        pts: 3, 
        animation:
        [
            gb1,
            gb2,
            gb3,
            gb4,
            gb5
        ],
        delay: 4,
        health: true
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
    if (gotResult) {
        results.firstChild.remove();
        gotResult = false;
        background.classList.remove('background');
    }
    canvas.style.display = "block"; 
    pause = false;
    weapons.length = 0;
    enemies.length = 0;
    hearts.length = 0;
    ticks = 0;
    level = 1;
    player.health = 100;
    score = 0;
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
    canvas.style.display = "block"; 
    saveRecord();
    inputName();
    restartGame();
}

function saveRecord() {
    localStorage.setItem(playerName, score); 
}

function sortRecords() {
    var records = [];

    for (let i = 0; i < localStorage.length; i++) {
        let obj = {};
        let name = localStorage.key(i);
        obj["name"] = name;
        obj["score"] = localStorage.getItem(localStorage.key(i));
        records.push(obj);
    }

    records.sort(function(a, b) {
        return b.score - a.score;
    });


    return records;
}

function showResults() {
    saveRecord(); 
    var sortedRecords = sortRecords();

    canvas.style.display = "none";  
    gotResult = true;

    background = document.getElementById('set_background');
    background.classList.add('background');
    
    let html = "<table><th>ИМЯ</th><th>ОЧКИ</th>";
    for (let i = 0; i < sortedRecords.length && i < 8; i++) {
        html += "<tr aling=\"center\">";
        for (let j = 0; j < 1; j++) {
            html += "<td>" + sortedRecords[i].name + "</td>";
            html += "<td>" + sortedRecords[i].score + "</td>";
        }
        html += "</tr>";
    }
    html += "</table>";

    document.getElementById("results").innerHTML = html;
}

function setTimer() {
    pause = false;
    clearInterval(interval);
    interval = setInterval(playGame, 50);
}

function loadBackground() {
    img = new Image();

    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        playGame();
    };

    img.src = "/images/background4.jpg";
}

function init(){
    canvas = document.createElement("canvas");
    canvas.width = 1260;
    canvas.height = 600;
    level = 1;
    score = 0;
    player = new Player();
    rightPressed = false;
    leftPressed = false;
    enemies = [];
    weapons = [];
    rotate = false;
    delay = 40;
    ticks = 0;
    coefficient = 1361;
    pause = false;
    levelUp = 30;
    hearts = [];

    if (canvas.getContext) {
        document.addEventListener("mousemove", mouseMoveHandler, false);
        canvas.addEventListener("click", mouseClickHandler, false);
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        setTimer();
        loadBackground();
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

function drawBack() {
    ticks++;
    ticks %= coefficient;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    player.rotate();
    player.draw();
    movePlayer();
    ctx.restore();
}

function setDifficult() {
    if (delay != 10) {
        delay -= 5;
    }
    if (player.delay > 6) {
        player.delay -= 2;
    }
}

function playGame() {
    drawBack();
    drawScore();

    for (let i = 0; i < weapons.length; i++) {
        if (weapons[i].isInsideCanvas()) {
            weapons[i].draw();
        } else {
            weapons.splice(i--, 1);
        }
    }

    drawPlayer();    

    if (ticks % delay == 0) {
        getRandomEnemy();  
    }

    if (ticks % player.delay == 0) {
        player.state =  true;
    }

    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].isInsideCanvas()) {
            enemies[i].draw();
            enemies[i].move();
        } else {
            player.health -= enemies[i].pts;
            if (player.health <= 0) {
                showResults();
            }
            enemies.splice(i--, 1);
        }
    }

    for (let i = 0; i < weapons.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (isHitted(weapons[i], enemies[j])) {
                if (enemies[j].health) {
                    getRandomHeart(enemies[j].posX, enemies[j].posY + enemies[j].size / 2);
                }
                score += enemies[j].pts;
                if (Math.floor(score / levelUp) + 1 - level > 0) {
                    setDifficult();
                    level++;
                }
                enemies.splice(j--, 1);
                weapons.splice(i--, 1);
                if (i == -1) {
                    break;
                }
            } 
        }
    }

    for (let i = 0; i < hearts.length; i++) {
        if (hearts[i].isInsideCanvas()) {
            hearts[i].draw();
            hearts[i].move();
        } else {
            hearts.splice(i--, 1);
        }
    }

    for (let i = 0; i < hearts.length; i++) {
        if (getCollision(player, hearts[i])) {
            player.health += hearts[i].health;
            hearts.splice(i--, 1);
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

    mouseX = e.clientX;
    mouseY = e.clientY;
}

function mouseClickHandler(e) {
    if (!pause && player.state) {
        var weapon = new Ball(player.angle);
        console.log("HERE");
        weapons.push(weapon);
        player.state = false;
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
        this.posY = 480;
        this.radius = 40;
        this.speed = 10;
        this.angle = Math.PI / 4;
        this.health = 100;
        this.color = '#000080';
        this.name = playerName;
        this.delay = 18;
        this.state = true; //заряжен
    }

    draw() {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        let [x, y] = [this.posX, this.posY];
        ctx.moveTo(x, y + 13);
        ctx.lineTo(x + 90, y + 13);
        ctx.lineTo(x + 90, y - 26);
        ctx.lineTo(x, y - 26);
        ctx.closePath();
        ctx.fill();

        if (this.state) {
            ctx.fillStyle = "#FF6347"; //tomato
        } else {
            ctx.fillStyle = "#4682B4"; //steel blue
        }
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fill();

        if (this.state) {
            ctx.fillStyle = "#A52A2A"; //brown
        } else {
            ctx.fillStyle = "#4B0082"; //indigo
        }
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius - 5, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }

    rotate() {
        ctx.translate(this.posX, this.posY);
        ctx.rotate(this.angle);
        ctx.translate(-this.posX, -this.posY);
    }
}

class Ball {
    constructor(angle) {
        this.posX = player.posX;
        this.posY = player.posY - 5;
        this.radius = 15;
        this.angle = angle;
        this.speed = 35;
        this.color = "#8B4513";
        if (mouseX > this.posX) {
            this.coef = 1;
        } else {
            this.coef = -1;
        }
    }

    draw() {
        ctx.fillStyle = "#8B4513"; //saddle brown
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fill();
        this.posX += (Math.cos(this.angle)) * this.speed;
        this.posY += (Math.sin(this.angle)) * this.speed;  
        this.angle += 2 * Math.PI / 180 * this.coef; 
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
    constructor(size, x, y, speed, pts, animation, delay, health) {
        this.size = size;
        this.posX = x;
        this.posY = y;
        this.speed = speed;
        this.img = animation[0];
        this.pts = pts;
        this.animation = animation;
        this.indexImg = 0;
        this.delay = delay;
        this.health = health;
    }

    draw() {  
        if (ticks % this.delay == 0) {
            this.img = this.animation[++this.indexImg % this.animation.length];
        }
        ctx.drawImage(this.img, this.posX, this.posY, this.size, this.size);
    }

    move() {
        this.posX += Math.floor(Math.random() * 2) - this.speed;
    }

    isInsideCanvas() {
        if (this.posX <= canvas.width && this.posX + this.size >= 0) {
            return true;
        } else {
            return false;
        }
    }
}

function getRandomHeart(x, y) {
    var heart = heartData[Math.floor(Math.random() * heartData.length)];
    hearts.push(new Heart(heart.img, x, y, heart.speed, heart.health, heart.size));
}

class Heart {
    constructor(img, x, y, speed, health, size) {
        this.size = size;
        this.posX = x;
        this.posY = y;
        this.img = img;
        this.speed = speed;
        this.health = health;
    }

    draw() {  
        ctx.drawImage(this.img, this.posX, this.posY, this.size, this.size);
        this.size = this.size + 2*(-1)**(ticks);
    }

    move() {
        this.posX += Math.floor(Math.random() * 5) - 2;
        this.posY += Math.floor(Math.random() * 2) + this.speed;
    }

    isInsideCanvas() { 
        if (this.posX <= canvas.width && this.posY + this.size <= canvas.height) {
            return true;
        } else {
            return false;
        }
    }
}

function getRandomEnemy() {
    var enemy;
    var greenBirdDelay = 200; 

    if (level < 5) {
        enemy = enemyData[Math.floor(Math.random() * (enemyData.length - 2))]
    } else {
        enemy = enemyData[Math.floor(Math.random() * (enemyData.length - 1))];
    }

    if (ticks % greenBirdDelay == 0) {
        enemy = enemyData[3];
    }

    var posX = canvas.width;
    var posY = 200 - Math.floor(Math.random() * (canvas.height - 400));

    enemies.push(new Enemy(enemy.size, posX, posY, enemy.speed, enemy.pts, enemy.animation, enemy.delay, enemy.health));
}

function isHitted(item1, item2) {
    if (item1.posX >= item2.posX && item1.posX <= item2.posX + item2.size &&
        item1.posY >= item2.posY && item1.posY <= item2.posY + item2.size) {
        return true;
    } else {
        return false;
    }
}

function getCollision(item1, item2) {
    let dx = item1.posX - item1.radius/2 - item2.posX;
    let dy = item1.posY - item2.posY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < item1.radius + item2.size) {
        return true;
    } else {
        return false;
    }
}