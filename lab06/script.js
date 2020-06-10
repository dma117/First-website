'use-strict';

var canvas, ctx, figures, idTimer, currentDirection, currentSpeed, maxSize;

const directions = [
    // top
    (x, y) => {
        x += Math.floor(Math.random() * 5) - 2;
        y += Math.floor(Math.random() * 2) - currentSpeed;
        return [x, y];
    },
    // bottom
    (x, y) => {
        x += Math.floor(Math.random() * 5) - 2;
        y += Math.floor(Math.random() * 2) + currentSpeed;
        return [x, y];
    },
    // left
    (x, y) => {
        x += Math.floor(Math.random() * 2) - currentSpeed;
        y += Math.floor(Math.random() * 5) - 2;
        return [x, y];
    },
    // right
    (x, y) => {
        x += Math.floor(Math.random() * 2) + currentSpeed;
        y += Math.floor(Math.random() * 5) - 2;
        return [x, y];
    },
    // chaos
    (x, y) => {
        return directions[Math.floor(Math.random() * 4)](x, y);
    }
];

class Figure {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.radius = 5+Math.random()*(maxSize / 4);
        this.direction = randomDirection();
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
}

class Ball extends Figure {      
    draw() {
        ctx.fillStyle = this.colorFigure(ctx);
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, 2*Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
}

class Rectangle extends Figure {
    draw() {
        ctx.fillStyle = this.colorFigure(ctx);
        ctx.beginPath();
        let [x, y, radius] = [this.posX, this.posY, this.radius];
        ctx.moveTo(x - radius / 2, y - radius / 2)
        ctx.lineTo(x + radius / 2, y - radius / 2)
        ctx.lineTo(x + radius / 2, y + radius / 2)
        ctx.lineTo(x - radius / 2, y + radius / 2)
        ctx.closePath();
        ctx.fill();
    }
    getPoints() {
        let [x, y, radius] = [this.posX, this.posY, this.radius];
        return [[x - radius / 2, y - radius / 2], 
                [x + radius / 2, y - radius / 2],
                [x + radius / 2, y + radius / 2],
                [x - radius / 2, y - radius / 2]];
    }
}

class Triangle extends Figure {
    draw() {
        ctx.fillStyle = this.colorFigure(ctx);
        ctx.beginPath();
        let [x, y, radius] = [this.posX, this.posY, this.radius];
        ctx.moveTo(x - radius, y + radius);
        ctx.lineTo(x + radius, y + radius);
        ctx.lineTo(x, y - radius);
        ctx.closePath();
        ctx.fill();
    }
    getPoints() {
        let [x, y, radius] = [this.posX, this.posY, this.radius];
        return [[x - radius, y + radius],
                [x + radius, y + radius],
                [x, y - radius]];
    }
}

let typeOfFigure = [Rectangle, Ball, Triangle];

function randomFigure() {
    return Math.floor(Math.random() * typeOfFigure.length);
}

function randomDirection() {
    return Math.floor(Math.random() * 4);
}

function drawBack(ctx, col1, col2, w, h){
    // закрашиваем канвас градиентным фоном
    ctx.save();
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(1,col1);
    g.addColorStop(0,col2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
}
// инициализация работы
function init(){
    canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        currentSpeed = 4;
        maxSize = 200;

        document.getElementById("speed").addEventListener('change', setSpeed);
        document.getElementById("valueSpeed").innerHTML = currentSpeed;
        document.getElementById("size").addEventListener('change', setMaxSize);
        document.getElementById("valueSize").innerHTML = maxSize;

        ctx = canvas.getContext('2d');
        drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
        figures = [];
        for (var i = 1; i <= 30; i++){
            var item = new typeOfFigure[randomFigure()] (10+Math.random()*(canvas.width-30),
                            10+Math.random()*(canvas.height-30));
            item.draw(ctx);
            figures.push(item);
        }
    }
}
// создаем новый шарик по щелчку мыши, добавляем его в массив шариков и рисуем его
function goInput(event){
    var x = event.clientX;
    var y = event.clientY;
    var item = new typeOfFigure[randomFigure()] (x, y);
    item.draw(ctx);
    figures.push(item);
}

function moveFigures(){
    //реализация движения шариков, находящихся в массиве figures
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < figures.length; i){
        figures[i].radius++;
        
        if (figures[i].size > maxSize) {
            figures.splice(i, 1);
            continue;
        }

        [figures[i].posX, figures[i].posY] = directions[currentDirection === undefined ? figures[i].direction : currentDirection](figures[i].posX, figures[i].posY);

        figures[i].draw(ctx);

        if ((figures[i].posX > canvas.width)|| (figures[i].posY > canvas.height) || (figures[i].posX < 0) ||(figures[i].posY < 0)) {
            figures.splice(i,1);
        }
        else {
            checkCollisions(figures[i]);
            i++;
        }
    }
}

function move() {
    clearInterval(idTimer);
    idTimer = setInterval(moveFigures, 50);
}

function setDirection(direction) {
    currentDirection = direction;
    move();
}

function setSpeed() {
    currentSpeed = +document.getElementById("speed").value;
    document.getElementById("valueSpeed").innerHTML = currentSpeed;
}

function setMaxSize() {
    maxSize = +document.getElementById("size").value;
    document.getElementById("valueSize").innerHTML = maxSize;
}

function checkCollisions(figure) {
    var dx,
        dy,
        distance;

    for (let i = 0; i < figures.length; i++) {
        if (figure == figures[i]) {
            continue;
        } 
        if (figure instanceof Ball && figures[i] instanceof Ball) {;
            dx = figure.posX - figures[i].posX;
            dy = figure.posY - figures[i].posY;
            distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < figures[i].radius + figure.radius) {
                figures.splice(i, 1);
                figures.splice(figures.indexOf(figure, 0), 1);
                return;
            }
        } else if (!(figure instanceof Ball || figures[i] instanceof Ball)) {
            let [firstFigurePoints, secondFigurePoints] = [figure.getPoints(), figures[i].getPoints()];

            for (let point of secondFigurePoints) {
                if (pointInPoly(firstFigurePoints, point[0], point[1])) {
                    figures.splice(figures.indexOf(figure, 0), 1);
                    figures.splice(figures.indexOf(figures[i], 0), 1);
                    return;
                }
            }
        } else {
            var ball,
                shape;

            if (figures[i] instanceof Ball) {
                ball = figures[i];
                shape = figure;
            } else {
                ball = figure;
                shape = figures[i];
            }

            var pointsOfShapes = shape.getPoints();

            let distance = 9999999;
            for (let i = 0; i < pointsOfShapes.length; i++) {
                let dx = pointsOfShapes[i][0] - ball.posX;
                let dy = pointsOfShapes[i][1] - ball.posY;
                let tmpDistance = Math.sqrt(dx * dx + dy * dy);
                distance = tmpDistance < distance ? tmpDistance : distance;
            }
            if (ball.size >= distance || pointInPoly(pointsOfShapes, ball.posX, ball.posY)) {
                figures.splice(figures.indexOf(shape, 0), 1);
                figures.splice(figures.indexOf(ball, 0), 1);
                return;
            }
        }
    }
}

function pointInPoly(figurePoints, pointX, pointY)
{
    let destroy = 0;

    for (let i = 0, j = figurePoints.length - 1; i < figurePoints.length; j = i++)
    {
        if (((figurePoints[i][1] > pointY) != (figurePoints[j][1] > pointY)) && 
        (pointX < (figurePoints[j][0] - figurePoints[i][0]) * (pointY - figurePoints[i][1]) / 
        (figurePoints[j][1] - figurePoints[i][1]) + figurePoints[i][0]))
        {
            destroy = !destroy;
        }
    }
 
    return destroy;
}