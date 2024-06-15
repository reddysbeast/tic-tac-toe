let currentPlayer = "X";
let boardSize = 3; 
let board = [];
let gameOver = false;
let scores = {
  player1: 0,
  player2: 0,
};
let mode = "duo";
let player1Name = "Player 1";
let player2Name = "Player 2";
let count = 0;

function startGame() {
  mode = document.getElementById("mode").value;
  player1Name = document.getElementById("player1-name").value || "Player 1";
  document.getElementById("player1").innerText = `${player1Name}: ${scores.player1}`;
  player2Name = document.getElementById("player2-name").value || (mode === "solo" ? "Computer" : "Player 2");
  document.getElementById("player2").innerText = `${player2Name}: ${scores.player2}`;

  boardSize = parseInt(document.getElementById("board-size").value);
  if (isNaN(boardSize) || boardSize < 3 || boardSize > 10) {
    alert("Please enter a valid board size between 3 and 10.");
    return;
  }


  document.getElementById("mode-selection").style.display = "none";
  document.getElementById("game").style.display = "block";

  const boardContainer = document.getElementById("board");
  boardContainer.innerHTML = ""; 
  boardContainer.style.gridTemplateColumns = `repeat(${boardSize}, 80px)`; 
  boardContainer.style.gridTemplateRows = `repeat(${boardSize}, 80px)`; 
  board = Array.from({ length: boardSize * boardSize }, () => "");
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => makeMove(i));
    boardContainer.appendChild(cell);
  }
  updateTurnIndicator();
}

function makeMove(index) {
  if (!gameOver && board[index] === "") {
    board[index] = currentPlayer;
    const cell = document.getElementsByClassName("cell")[index];
    cell.innerText = currentPlayer;
    cell.style.backgroundColor = currentPlayer === "X" ? "rgba(255,0,0,0.412)" : "rgba(9,255,0,0.337)"; 
    count++;
    checkWinner();
    if (gameOver) return;

    if (mode === "solo" && currentPlayer === "X") {
      currentPlayer = "O";
      updateTurnIndicator();
      setTimeout(computerMove, 500); 
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateTurnIndicator();
    }
  }
}



function computerMove() {
  let emptyCells = board.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
  if (emptyCells.length > 0) {
    let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[move] = currentPlayer;
    const cell = document.getElementsByClassName("cell")[move];
    cell.innerText = currentPlayer;
    cell.style.backgroundColor = "rgba(9,255,0,0.337)";
    count++;
    checkWinner();
    if (gameOver) return;

    currentPlayer = "X";
    updateTurnIndicator();
  }
}



function checkWinner() {
  const winningCombos = generateWinningCombos();

  for (let combo of winningCombos) {
    let isWinningCombo = true;
    for (let index of combo) {
      if (board[index] !== currentPlayer) {
        isWinningCombo = false;
        break;
      }
    }

    if (isWinningCombo) {
      document.getElementById("result").innerText = `${currentPlayer === "X" ? player1Name : player2Name} wins!`;
      if(currentPlayer === "X"){
      document.body.classList.add('animate-background-red');
      const cells = document.getElementsByClassName("cell");
      for (let cell of cells) {
        cell.classList.add('animate-background-red');
      }
      }else{
        document.body.classList.add('animate-background-green');
      const cells = document.getElementsByClassName("cell");
      for (let cell of cells) {
        cell.classList.add('animate-background-green');
      }
      }
      gameOver = true;
      updateScores(currentPlayer);
      setTimeout(reset, 5000);
      return;
    }
  }

  if (!board.includes("")) {
    document.getElementById("result").innerText = "It's a draw!";
    setTimeout(reset, 5000);
    gameOver = true;
  }
}


function generateWinningCombos() {
  let winningCombos = [];

 
  for (let i = 0; i < boardSize; i++) {
    let combo = [];
    for (let j = 0; j < boardSize; j++) {
      combo.push(i * boardSize + j);
    }
    winningCombos.push(combo);
  }


  for (let i = 0; i < boardSize; i++) {
    let combo = [];
    for (let j = 0; j < boardSize; j++) {
      combo.push(j * boardSize + i);
    }
    winningCombos.push(combo);
  }

 
  let diag1 = [];
  let diag2 = [];
  for (let i = 0; i < boardSize; i++) {
    diag1.push(i * boardSize + i);
    diag2.push((i + 1) * boardSize - (i + 1));
  }
  winningCombos.push(diag1, diag2);

  return winningCombos;
}


function updateScores(player) {
  if (player === "X") {
    scores.player1++;
    document.getElementById("player1").innerText = `${player1Name}: ${scores.player1}`;
  } else {
    scores.player2++;
    document.getElementById("player2").innerText = `${player2Name}: ${scores.player2}`;
  }
}


function reset() {
  currentPlayer = "X";
  board = Array.from({ length: boardSize * boardSize }, () => "");
  gameOver = false;
  document.getElementById("result").innerText = "";
  updateTurnIndicator();
  const cells = document.getElementsByClassName("cell");
  for (let cell of cells) {
    cell.innerText = "";
    cell.style.backgroundColor = "";
    cell.classList.remove('animate-background-red');
    cell.classList.remove('animate-background-green');
  }
  document.body.classList.remove('animate-background-red');
  document.body.classList.remove('animate-background-green');
  count = 0;
}


function resetScores() {
  scores.player1 = 0;
  scores.player2 = 0;
  document.getElementById("player1").innerText = `${player1Name}: ${scores.player1}`;
  document.getElementById("player2").innerText = `${player2Name}: ${scores.player2}`;
}


function updateTurnIndicator() {
  document.getElementById("turn-indicator").innerText = `Turn: ${currentPlayer === "X" ? player1Name : player2Name}`;
}


document.getElementById("mode").addEventListener("change", function() {
  if (this.value === "duo") {
    document.getElementById("player2-name").style.display = "block";
  } else {
    document.getElementById("player2-name").style.display = "none";
  }
});
