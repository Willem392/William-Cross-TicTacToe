var board = [];

var p1 = 'X';
var p2 = 'O';
var curPlayer;
var slash = 0;

var minCalled = 0;
var prvared = false;

var gameOver;

var available = [];

function setup() {  
  button = createButton("Restart");
  button.mousePressed(reset);
  var canvas = createCanvas(600, 600);
  canvas.parent('sketch-holder');
  for(var i = 0; i < 3; i++){
    board[i] = [];
    available[i] = [];
  }
  curPlayer = p1;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      available[i][j] = 1;
      board[i][j] = ' ';
    }
  }
  reset();
}

function draw() {
  background(255);
  determineTitle();
  drawBoard();
  if (curPlayer == p2) {
    if (gameOver == 0) {
      bestMove(); 
      checkWinner();
    }
  }
  if(!prvared && gameOver != 0){
    console.log(minCalled);
    prvared = true;
  }
}

function nextTurn() {
  var x = random(3);
  var y = random(3);
  if (available[x][y] == 1) {
    available[x][y] = 0;
    board[x][y] = curPlayer;
    if (curPlayer == 'X') {
      curPlayer = 'O';
    } else {
      curPlayer = 'X';
    }
  } else {
    nextTurn();
  }
}

function bestMove() {
  var bestScore = -999;
  var bestMoveI = 0;
  var bestMoveJ = 0;
  var alpha = -999;
  var beta = 999;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (available[i][j] == 1) {
        minCalled++;
        board[i][j] = p2;
        available[i][j] = 0;
        var score = minimax(board, 0, false, -999, 999);
        board[i][j] = ' ';
        available[i][j] = 1;
        if (score > bestScore) {
          bestScore = score;
          bestMoveI = i;
          bestMoveJ = j;
        }
        alpha = max(alpha, score);
        if (beta <= alpha) {
          break;
        }
      }
    }
  }
  board[bestMoveI][bestMoveJ] = p2;
  available[bestMoveI][bestMoveJ] = 0;
  curPlayer = p1;
}

function minimax(board, depth, isMaxing, alpha, beta) {
  minCalled++;
  checkWinner();
  var score = 0;
  if (gameOver != 0) {
    if (gameOver == 1) {
      score = -1;
    } else if (gameOver == 2) {
      score = 1;
    } else if (gameOver == 3) {
      score = 0;
    }
    gameOver = 0;
    slash = 0;
    return score;
  }
  if (isMaxing) {
    var bestScore = -999;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (available[i][j] == 1) {
          board[i][j] = p2;
          available[i][j] = 0;
          score = minimax(board, depth+1, false, alpha, beta);
          board[i][j] = ' ';
          available[i][j] = 1;
          bestScore = max(score, bestScore);
          alpha = max(alpha, score);
          if (beta <= alpha)
            break;
        }
      }
    } 
    slash = 0;
    return bestScore;
  } else {
    var bestScore = 999;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (available[i][j] == 1) {
          board[i][j] = p1;
          available[i][j] = 0;
          score = minimax(board, depth+1, true, alpha, beta);
          board[i][j] = ' ';
          available[i][j] = 1;
          bestScore = min(score, bestScore);
          beta = min(beta, score);
          if (beta <= alpha)
            break;
        }
      }
    }
    slash = 0;
    return bestScore;
  }
}

function checkWinner() {
  var num = 0;
  for (var i = 0; i < 3; i++) {
    if (board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
      if (board[i][0] == 'X') {
        slash = 1 + i;
        gameOver = 1;
      } else if (board[i][0] == 'O') {
        slash = 1 + i;
        gameOver = 2;
      }
    }
    if (board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
      if (board[0][i] == 'X') {
        slash = 4 + i;
        gameOver = 1;
      } else if (board[0][i] == 'O') {
        slash = 4 + i;
        gameOver = 2;
      }
    }
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
      if (board[0][0] == 'X') {
        slash = 7;
        gameOver = 1;
      } else if (board[0][0] == 'O') {
        slash = 7;
        gameOver = 2;
      }
    }
    if (board[2][0] == board[1][1] && board[1][1] == board[0][2]) {
      if (board[2][0] == 'X') {
        slash = 8;
        gameOver = 1;
      } else if (board[2][0] == 'O') {
        slash = 8;
        gameOver = 2;
      }
    }
    for (var j = 0; j < 3; j++) {
      if (available[i][j] == 0) {
        num++;
      }
    }
  }
  if (num == 9 && gameOver == 0) {
    slash = 0;
    gameOver = 3;
  }
}

function drawBoard() {
  strokeWeight(10);
  var w = width/3;
  var h = height/3;
  line(0, h, width, h);
  line(0, h*2, width, h*2);
  line(w, 0, w, height);
  line(w*2, 0, w*2, height);
  noFill();
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] == p1) {
        line(i*w + 50, j*h + 50, (i+1)*w - 50, (j+1)*h - 50);
        line((i+1)*w - 50, j*h + 50, (i)*w + 50, (j+1)*h - 50);
      } else if (board[i][j] == p2) {
        ellipse(i*w + w/2, j*h + h/2, w - 50, h - 50);
      }
    }
  }
  stroke(255, 0, 0);
  strokeWeight(5);
  if (slash < 4) {
    line((slash - 1)*(width/3) + (width/3)/2, 20, (slash - 1)*(width/3) + (width/3)/2, height - 20);
  } else if (slash < 7) {
    line(20, (slash - 4)*(height/3) + (height/3)/2, width - 20, (slash - 4)*(height/3) + (height/3)/2);
  } else if (slash == 7) {
    line(20, 20, width-20, height-20);
  } else if (slash == 8) {
    line(20, width-20, height-20, 20);
  }
  stroke(0);
  strokeWeight(1);
}

function determineTitle() {
  // if (gameOver == 0) {
  //   surface.setTitle("TicTacToe - Press 'SPACE' to restart - " + curPlayer + "'s turn");
  // } else if (gameOver == 1) {
  //   surface.setTitle("TicTacToe - Press 'SPACE' to restart - X wins");
  // } else if (gameOver == 2) {
  //   surface.setTitle("TicTacToe - Press 'SPACE' to restart - O wins");
  // } else if (gameOver == 3) {
  //   surface.setTitle("TicTacToe - Press 'SPACE' to restart - It's a tie!");
  // }
}

function mousePressed() {
  if (curPlayer == p1 && gameOver == 0) {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (mouseX > i*(width/3) && mouseX < (i+1)*(width/3)) {
          if (mouseY > j*(height/3) && mouseY < (j+1)*(height/3)) {
            if (available[i][j] == 1) {
              available[i][j] = 0;
              board[i][j] = curPlayer;
              if (curPlayer == p1) {
                curPlayer = p2;
              } else {
                curPlayer = p1;
              }
              checkWinner();
            }
          }
        }
      }
    }
  }
}

function keyPressed() {
  if (key == ' ') {
    reset();
  }
}

function reset(){
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      available[i][j] = 1;
      board[i][j] = ' ';
      gameOver = 0;
      slash = 0;
      minCalled = 0;
      prvared = false;
    }
  }
}