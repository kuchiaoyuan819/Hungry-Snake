const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext() 會回傳一個canvas的drawing context
//drawing context可用於canvas內畫圖
const unit = 20;
const row = canvas.height / unit; //蛇的身體可擺放320/20=16格
const column = canvas.width / unit; //蛇的身體可擺放320/20=16格

//【snake的設定設置】
//array中的每個元素都是一個物件，物件工作是儲存身體的x&y座標
let snake = [];
function creatSenake() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

//【果實設定 使用class】
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "#bfff00";
    ctx.fillRect(this.x, this.y, unit, unit);
    ctx.strokeStyle = "black";
    ctx.strokeRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    //與蛇的位置做比較
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = ture;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

//初始設定
creatSenake();
let myFruit = new Fruit();

// 【方向鍵設定】
window.addEventListener("keydown", changeDirection);

let d = "Right";
function changeDirection(e) {
  if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }

  //每按下上下左右鍵之後，在下一幀被畫出來前
  //程式碼不接受任何keydown事件
  //可防止連續案件導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}
let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("game-score").innerHTML = "game score :" + " " + score;
document.getElementById("top-record").innerHTML =
  "highest score :" + " " + highestScore;

function draw() {
  //每次畫圖前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("GAME OVER!!");
      return;
    }
  }

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();

  //【畫出蛇】
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "#ff78ff";
    } else {
      ctx.fillStyle = "#ffb1ff";
    }
    ctx.strokeStyle = "black";

    //【蛇的穿牆功能】
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }

    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }

    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }

    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); //x, y, width, height
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // 以目前d變數方向，決定蛇的下一幀
  let snakeX = snake[0].x;
  // snake[0]是object,但snake[0]是number,所以不影響snakeX
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //【確認蛇是否有吃到果實】
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //重新選定一個果實隨機位置
    myFruit.pickALocation();
    //畫出新果實
    //更新分數
    score++;
    setHighestScore(score);
    document.getElementById("game-score").innerHTML =
      "game score :" + " " + score;
    document.getElementById("top-record").innerHTML =
      "highest score :" + " " + highestScore;
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
