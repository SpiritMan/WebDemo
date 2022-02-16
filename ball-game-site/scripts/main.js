const canvas = document.querySelector('canvas');
const ballsNum = document.querySelector('p');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
console.log('width:' + width + ' height:' + height);

let balls = [];

while (balls.length < 35) {
    let size = random(10, 20);
    let ball = new Ball(random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomColor(),
        size, true);
    balls.push(ball);
}

let evilCircle = new EvilCircle(random(0 + 10, width - 10),
    random(0 + 10, height - 10), true);

loop();

function loop() {
    ctx.fillStyle = 'rgba(0,0,0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.setControls();
    evilCircle.collisionDetect();

    let num = 0;
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            num++;
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }
    ballsNum.textContent = '剩余球球数量:' + num;
    requestAnimationFrame(loop);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
    return 'rgb(' +
        random(0, 255) + ', ' +
        random(0, 255) + ', ' +
        random(0, 255) + ')';
}

//黑洞
function EvilCircle(x, y, exists) {
    this.x = x;
    this.y = y;
    this.velX = 20;
    this.velY = 20;
    this.color = 'white';
    this.size = 10;
    this.exists = exists;

    EvilCircle.prototype.draw = function() {
        console.log('draw:' + this.color)
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }

    EvilCircle.prototype.checkBounds = function() {
        if ((this.x + this.size) >= width) {
            this.x = width - this.size;
        }

        if ((this.x - this.size) <= 0) {
            this.x = this.size;
        }

        if ((this.y + this.size) >= height) {
            this.y = height - this.size;
        }

        if ((this.y - this.size) <= 0) {
            this.y = this.size;
        }
    }

    EvilCircle.prototype.setControls = function() {
        window.onkeydown = e => {
            switch (e.key) {
                case 'a':
                    this.x -= this.velX;
                    break;
                case 'd':
                    this.x += this.velX;
                    break;
                case 'w':
                    this.y -= this.velY;
                    break;
                case 's':
                    this.y += this.velY;
                    break;
            }
        };
    }

    //有接触的球将会被吸收吃掉
    EvilCircle.prototype.collisionDetect = function() {
        for (let j = 0; j < balls.length; j++) {
            if (balls[j].exists) {
                const dx = this.x - balls[j].x;
                const dy = this.y - balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + balls[j].size) {
                    balls[j].exists = false;
                }
            }
        }
    }
}

function Ball(x, y, velX, velY, color, size, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.exists = exists;
    Ball.prototype.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    Ball.prototype.update = function() {
        if ((this.x + this.size) >= width) {
            this.velX = -(this.velX);
        }

        if ((this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }

        if ((this.y + this.size) >= height) {
            this.velY = -(this.velY);
        }

        if ((this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    Ball.prototype.collisionDetect = function() {
        for (let j = 0; j < balls.length; j++) {
            if (this !== balls[j]) {
                const dx = this.x - balls[j].x;
                const dy = this.y - balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + balls[j].size) {
                    balls[j].color = this.color = randomColor();
                }
            }
        }
    }
}