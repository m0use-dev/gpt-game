const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const spaceship = new Spaceship(canvas.width / 2 - 25, canvas.height - 50, 50, 50);
const bullets = [];
const enemies = [];

let gameState = "start";
let score = 0;

function Spaceship(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.move = function (distance) {
    this.x += distance;
  };

  this.draw = function () {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function Bullet(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.update = function () {
    this.y -= 5;
  };

  this.draw = function () {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function Enemy(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.health = 3; // 体力プロパティを追加

  this.update = function () {
    this.y += 2;
  };

  this.draw = function () {
    // 体力に応じて敵の色を変更
    if (this.health === 3) {
      ctx.fillStyle = "red";
    } else if (this.health === 2) {
      ctx.fillStyle = "yellow";
    } else if (this.health === 1) {
      ctx.fillStyle = "blue";
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function checkCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

function drawStartScreen() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("シューティングゲーム", canvas.width / 2 - 100, canvas.height / 2 - 30);
  ctx.font = "20px Arial";
  ctx.fillText("スペースキーを押して開始", canvas.width / 2 - 85, canvas.height / 2 + 10);
  drawLeaderboard();
}

function drawGameOverScreen() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("ゲームオーバー", canvas.width / 2 - 75, canvas.height / 2 - 30);
  ctx.font = "20px Arial";
  ctx.fillText("スペースキーを押してリトライ", canvas.width / 2 - 90, canvas.height / 2 + 10);
  drawLeaderboard();
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function getHighScores() {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.sort((a, b) => b - a);
  return highScores.slice(0, 3);
}

function addToLeaderboard(score) {
  const highScores = getHighScores();
  highScores.push(score);
  highScores.sort((a, b) => b - a);
  localStorage.setItem("highScores", JSON.stringify(highScores.slice(0, 3))); // JSON.setItem を localStorage.setItem に変更
}

function drawLeaderboard() {
  const highScores = getHighScores();

  ctx.font = "20px Arial";
  ctx.fillText("リーダーボード:", canvas.width / 2 - 70, canvas.height / 2 + 60);

  for (let i = 0; i < highScores.length; i++) {
    ctx.fillText(`${i + 1}. ${highScores[i]}`, canvas.width / 2 - 30, canvas.height / 2 + 90 + i * 30);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameState === "start" || gameState === "gameover") {
      gameState = "play";
      score = 0;
      spaceship.x = canvas.width / 2 - 25;
      bullets.length = 0;
      enemies.length = 0;
    } else if (gameState === "play") {
      bullets.push(new Bullet(spaceship.x + spaceship.width / 2 - 2.5, spaceship.y, 5, 10));
    }
  } else if (e.code === "ArrowLeft") {
    spaceship.move(-10);
  } else if (e.code === "ArrowRight") {
    spaceship.move(10);
  }
});

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "play") {
    spaceship.draw();

    for (const bullet of bullets) {
      bullet.update();
      bullet.draw();
    }

    for (const enemy of enemies) {
      enemy.update();
      enemy.draw();
    }

    drawScore(); // スコアを最後に描画

    if (Math.random() < 0.02) {
      enemies.push(new Enemy(Math.random() * (canvas.width - 40), 0, 40, 40));
    }

    bullets.forEach((bullet, bulletIndex) => {
      enemies.forEach((enemy, enemyIndex) => {
        if (checkCollision(bullet, enemy)) {
          enemy.health--; // 敵の体力を1減らす
          bullets.splice(bulletIndex, 1); // 弾を削除

          if (enemy.health <= 0) {
            enemies.splice(enemyIndex, 1); // 敵の体力が0以下なら敵を削除
            score += 10; // スコアを加算
          }
        }
      });
    });

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];

      if (checkCollision(spaceship, enemy)) {
        gameState = "gameover";
        addToLeaderboard(score);
      }
    }
  } else if (gameState === "gameover") {
    drawGameOverScreen();
  }

  requestAnimationFrame(update);
}

update();

