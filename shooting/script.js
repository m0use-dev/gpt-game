const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
    }

    moveLeft() {
        this.x -= 5;
        if (this.x < 0) {
            this.x = 0;
        }
    }

    moveRight() {
        this.x += 5;
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 15;
    }

    update() {
        this.y -= 5;
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
    }

    update() {
        this.y += 1;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const player = new Player(canvas.width / 2 - 15, canvas.height - 50);
const bullets = [];
const enemies = [];
let score = 0;

function spawnEnemy() {
    const x = Math.random() * (canvas.width - 30);
    const y = 0;
    enemies.push(new Enemy(x, y));
}

function checkCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

let enemySpawnInterval = setInterval(spawnEnemy, 1500);

function update() {
    if (keys['ArrowLeft']) {
        player.moveLeft();
    }
    if (keys['ArrowRight']) {
        player.moveRight();
    }

    for (const bullet of bullets) {
        bullet.update();
    }

    for (const enemy of enemies) {
        enemy.update();
    }

    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (checkCollision(bullet, enemy)) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;
            }
        });
    });

    bullets.forEach((bullet, index) => {
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });

    enemies.forEach((enemy, index) => {
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();

    for (const bullet of bullets) {
        bullet.draw();
    }

    for (const enemy of enemies) {
        enemy.draw();
    }

    drawScore();
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 10, 30);
}

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ') {
        bullets.push(new Bullet(player.x + 12, player.y - 20));
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
