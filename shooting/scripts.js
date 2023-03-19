const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

class Spaceship {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(dx) {
    this.x += dx;
  }
}

class Bullet {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y -= 5;
  }
}

class Enemy {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += 1;
  }
}

const spaceship = new Spaceship(canvas.width / 2 - 25, canvas.height - 50, 50, 50);
const bullets = [];
const enemies = [];

let gameState = "start";

function drawStartScreen() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("シューティングゲーム", canvas.width / 2 - 100, canvas.height / 2 - 30);
  ctx.font = "20px Arial";
  ctx.fillText("スペースキーを押して開始", canvas.width / 2 - 85, canvas.height / 2 + 10);
}

function drawGameOverScreen() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("ゲームオーバー", canvas.width / 2 - 75, canvas.height / 2 - 30);
  ctx.font = "20px Arial";
  ctx.fillText("スペースキーを押してリトライ", canvas.width / 2 - 90, canvas.height / 2 + 10);
}

function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 50);
  const enemy = new Enemy(x, 0, 50, 50);
  enemies.push(enemy);
  setTimeout(spawnEnemy, 2000);
}

spawnEnemy();

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "play") {
    spaceship.draw();

    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i];
      bullet.update();
      bullet.draw();

      if (bullet.y < 0) {
        bullets.splice(i, 1);
        i--;
      }
    }

    for(let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      enemy.update();
      enemy.draw();

      if (enemy.y > canvas.height) {
        enemies.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i];

      for (let j = 0; j < enemies.length; j++) {
        const enemy = enemies[j];

        if (checkCollision(bullet, enemy)) {
          bullets.splice(i, 1);
          i--;
          enemies.splice(j, 1);
          j--;
          break;
        }
      }
    }

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];

      if (checkCollision(spaceship, enemy)) {
        gameState = "gameover";
        return;
      }
    }
  } else if (gameState === "gameover") {
    drawGameOverScreen();
  }

  requestAnimationFrame(update);
}

function resetGame() {
  spaceship.x = canvas.width / 2 - 25;
  spaceship.y = canvas.height - 50;
  bullets.length = 0;
  enemies.length = 0;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" && spaceship.x > 0) {
    spaceship.move(-10);
  } else if (e.code === "ArrowRight" && spaceship.x < canvas.width - spaceship.width) {
    spaceship.move(10);
  } else if (e.code === "Space") {
    if (gameState === "start") {
      gameState = "play";
    } else if (gameState === "gameover") {
      gameState = "start";
      resetGame();
    } else if (gameState === "play") {
      bullets.push(new Bullet(spaceship.x + spaceship.width / 2 - 2.5, spaceship.y, 5, 15));
    }
  }
});

update();

