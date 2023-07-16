// Global variables
const gameboard = [];

// Convert the gameboard to a 2D array containing only the values
const flatBoard = (board) => board.map(row => row.map(cell => cell.getValue()));
const copyBoard = (board) => {
  return JSON.parse(JSON.stringify(board));
};

// Create the gameboard 2D array with 3 columns x 3 rows and fill each array with cell()
const newBoard = () => {
  const row = 3,
    column = 3;
  for (let i = 0; i < row; i++) {
    gameboard[i] = [];
    for (let j = 0; j < column; j++) {
      gameboard[i].push(cell());
    }
  }
}

// Create the function for each grid cell
function cell() {
  let _value = 0;
  const addValue = (player) => _value = player;
  const getValue = () => _value;
  return { addValue, getValue };
}

// Check how many cells are empty by filtering the board for "0" and returning the length of the array
const emptyCells = (board) => {
  return board.flatMap(row => row).filter(obj => obj === 0).length;
}

// Create the main iheritance object for players
const player = (name, value, symbol, score) => {
  return { name, value, symbol, score };
}

// Create players with function inheritance
const player1 = player('Player 1', 1, 'X', 0);
const player2 = player('Player 2', -1, 'O', 0);

// Set default beggining player
let activePlayer = player1;

// Switch turns
const switchTurns = () => {
  activePlayer = activePlayer === player1 ? player2 : player1;
  turnSymbol();
}

// Calls minimax algorithm and plays AI's choice 
playAI = () => {
  const minmax = minimax(flatBoard(gameboard), 6, true)
  const row = minmax[1][0],
        col = minmax[1][1],
        button = document.querySelector(`button[row="${row}"][col="${col}"]`);
  playRound(gameboard[row][col], button);
}

// Insert active player symbol and check if there is a winner after each round
const playRound = (cell, button) => {
  if (cell.getValue() === 0) {
    cell.addValue(activePlayer.value);
    button.textContent = activePlayer.symbol;
    checkWinner();
    switchColor();
    switchTurns();    
  } else {
    console.warn('Invalid move, replay.');
  }
}

// Defines winning condition with magic square algorithm
const whoWins = (board) => {
  let sums = [0, 0, 0, 0];

  for (let row = 0; row < 3; row++) {

    sums[2] = 0;
    sums[3] = 0;

    // Check vertical and horizontal
    for (let col = 0; col < 3; col++) {
      sums[2] += board[row][col];
      sums[3] += board[col][row];
    }

    // Check both diogonals
    sums[0] += board[row][row];
    sums[1] += board[2 - row][row];

    if (sums.includes(3)) {
      return player1;
    } else if (sums.includes(-3)) {
      return player2;
    }
  }
  return null
}

// Checks if there is a win and returns the name of the winner
checkWinner = () => {
  const winner = whoWins(flatBoard(gameboard));

  if (winner) {
    winner.score++;
    score();
    sayResult('win', winner);
    console.log(`${winner.name} wins!`);
  } else if (emptyCells(flatBoard(gameboard)) === 0) {
    sayResult();
    console.log(`It's a draw!`);
  } else if (emptyCells(flatBoard(gameboard)) !== 0) {
    console.log('No winner yet');
  }
}


// Get grid cell position on click and play Player's Choice and AI's Choice straight after
const cellNum = document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener('click', () => {
    const empty = cell.textContent === '' ? true : false;
    const row = cell.getAttribute('row');
    const col = cell.getAttribute('col');
    playRound(gameboard[row][col], cell);
    if (empty) { playAI() };
  });
});

// Switch hover and text color based on active player
const switchColor = () => document.querySelectorAll(".cell").forEach((cell) => {
  const hover = ['hover1', 'hover2'];
  const color = ['color1', 'color2']
  const cellClass = cell.classList;
  const cellText = cell.textContent;
  if (cellText === '' && cellClass.contains(hover[0])) {
    cellClass.replace(hover[0], hover[1]);
  } else if (cellText === '' && cellClass.contains(hover[1])) {
    cellClass.replace(hover[1], hover[0]);
  } else if (cell.textContent === 'X') {
    cellClass.remove(...hover);
    cellClass.add(color[0])
  } else if (cell.textContent === 'O') {
    cellClass.remove(...hover);
    cellClass.add(color[1])
  }
});

// Show the score and update each turn
const score = () => {
  const scoreName1 = document.querySelector(".scoreName1"),
    scoreName2 = document.querySelector(".scoreName2"),
    scoreNumber1 = document.querySelector(".scoreNumber1"),
    scoreNumber2 = document.querySelector(".scoreNumber2");
  scoreName1.textContent = `${player1.name}`
  scoreName2.textContent = `${player2.name}`
  scoreNumber1.textContent = `${player1.score}`
  scoreNumber2.textContent = `${player2.score}`
}

// Assign player names on submit and start the game and reset previous board and score
const startGame = (event) => {
  const intro = document.querySelector(".intro");
  const name1 = document.getElementById('player1').value,
    name2 = document.getElementById('player2').value
  event.preventDefault();
  player1.name = name1 ? name1 : 'Player 1';
  player2.name = name2 ? name2 : 'Player 2';
  resetScore()
  reset();
  intro.style.display = 'none';
}

document.getElementById("formBtn").addEventListener("click", startGame);

// Change score's symbol based on active player
const turnSymbol = () => {
  const turnDiv = document.querySelector('.turn');
  turnDiv.textContent = `${activePlayer.symbol} TURN`
}

// Reset current board and active player to default
const resetBoard = () => {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = '';
    cell.classList.remove('hover1', 'hover2', 'color1', 'color2');
    cell.classList.add('hover1');
  })
  activePlayer = player1;
  newBoard();
}

// Reset the score of both players
const resetScore = () => {
  player1.score = 0;
  player2.score = 0;
  score();
}

// Reset the board and player turn
const reset = () => {
  resetBoard();
  turnSymbol();
}

document.querySelector(".reset").addEventListener("click", reset);

// Announce results and show Quit and Next round buttons
const sayResult = (result, winner) => {
  const winnerPar = document.querySelector('.winner')
  if (result === 'win') {
    winnerPar.textContent = `${winner.name} wins this round!`
  } else {
    winnerPar.textContent = `It's a draw!`
  }
  document.querySelector('.results-container').style.display = 'block'
}

// Quit event listener
document.querySelector(".quit").addEventListener("click", () => {
  document.querySelector('.results-container').style.display = 'none';
  document.querySelector(".intro").style.display = 'flex';
  document.getElementById('player1').value = '';
  document.getElementById('player2').value = '';
})

document.querySelector('.next-round').addEventListener('click', () => {
  document.querySelector('.results-container').style.display = 'none';
  resetBoard();
  turnSymbol();
})


// Calculate utility of the board based on Tic Tac Toe rules (3 of the same, 2 of the same etc) 
const getUtility = (board, ai) => {

  const playerNum = (n) => {
    return ai ? -n : n;
  }

  let result = [0, 0, 0, 0, 0, 0, 0, 0]
  let utility = [0];

  // Get row and col utility
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {

      result[row] += board[row][col] === 0 ? playerNum(0.2) : board[row][col];

      result[row + 3] += board[col][row] === 0 ? playerNum(0.2) : board[col][row];
    }
  }

  // Get both diagonals utility
  for (let i = 0; i < 3; i++) {

    result[6] += board[i][i] === 0 ? playerNum(0.2) : board[i][i];

    result[7] += board[2 - i][i] === 0 ? playerNum(0.2) : board[2 - i][i];
  }

  roundedResult = result.map(num => parseFloat(num.toFixed(2)));

  // Calculate utility based on results
  if (roundedResult.includes(playerNum(3))) {
    utility[0] = playerNum(-Infinity);
  } else if (roundedResult.includes(playerNum(-3))) {
    utility[0] = playerNum(Infinity);   
  } else if (roundedResult.includes(playerNum(2.2))) {
    const sum = roundedResult.filter(num => num === playerNum(2.2)).length;
    utility[0] = sum === 2 ? 0.4 : 0.2;
  } else { utility[0] = 0; }  
  return utility;
}

// Use minimax algorithm and utility to make optimal choice  
const minimax = (board, depth, ai) => {
  // If there is winner/board in terminal stage/tree bottom return the utility of current board 
  if (depth === 0 || !!whoWins(board) || emptyCells(board) === 0) {    
    return getUtility(board, ai)
  }

  // If it's ai's turn play the maximizer's choice
  if (ai) {
    let max = [-Infinity, null];
    let eval = [];    
    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          let newBoard = copyBoard(board);
          newBoard[rowIndex][cellIndex] = -1;
          eval = minimax(newBoard, depth - 1, false)
          if (eval[0] > max[0]) {
            max[0] = eval[0];
            max[1] = [rowIndex, cellIndex];
          }
        }
      });
    });    
    return max
  } else {
    // If it's player's turn play the minimizer's choice
    let min = [Infinity, null];
    let eval = [];   
    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          let newBoard = copyBoard(board);
          newBoard[rowIndex][cellIndex] = 1;
          eval = minimax(newBoard, depth - 1, true)
          if (eval[0] < min[0]) {
            min[0] = eval[0];
            min[1] = [rowIndex, cellIndex];
          }
        }
      });
    });    
    return min
  }
}