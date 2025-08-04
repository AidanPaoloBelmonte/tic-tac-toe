const boardDisplay = document.querySelector("#board");

function initializeBoard() {
  const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let boardFree = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  getBoardCell = (index) => {
    return board[index];
  };
  setBoardCell = (index, value) => {
    board[index] = value;
    boardFreeIndex = boardFree.indexOf(index);
    if (boardFreeIndex > -1) {
      boardFree.splice(boardFree.indexOf(index), 1);
    }

    let cell = boardDisplay.children[index];
    if (cell != undefined) {
      cell.classList.add(value == 1 ? "player" : "computer");
    }
  };
  reset = () => {
    for (let l = 0; l < board.length; l++) {
      board[l] = 0;
      cell.classList.replace("cell");
    }

    boardFree = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  };
  getFreeCells = () => {
    return boardFree;
  };
  judge = () => {
    let winner = 0;
    const winning_cells = [];

    for (let l = 0; l < 3; l++) {
      // Horizontal Checks
      if (
        board[l * 3] == board[l * 3 + 1] &&
        board[l * 3] == board[l * 3 + 2] &&
        board[l * 3] != 0
      ) {
        winning_cells.push(l * 3);
        winning_cells.push(l * 3 + 1);
        winning_cells.push(l * 3 + 2);

        winner = board[l * 3];
      }
      // Vertical Checks
      else if (
        board[l] == board[l + 3] &&
        board[l] == board[l + 6] &&
        board[l] != 0
      ) {
        winning_cells.push(l);
        winning_cells.push(l + 3);
        winning_cells.push(l + 6);

        winner = board[l];
      }
      // Diagonal Checks
      else if (
        l < 2 &&
        board[4] == board[l * 2] &&
        board[4] == board[8 + -l * 2] &&
        board[4] != 0
      ) {
        winning_cells.push(4);
        winning_cells.push(l * 2);
        winning_cells.push(8 + -l * 2);

        winner = board[4];
      }
    }

    if (winner > 0) {
      for (let l = 0; l < boardDisplay.children.length; l++) {
        if (!winning_cells.includes(l)) {
          boardDisplay.children[l].classList.add("loser");
        } else {
          boardDisplay.children[l].classList.add("winner");
        }
      }
    } else if (boardFree.length < 1) {
      for (let l = 0; l < boardDisplay.children.length; l++) {
        boardDisplay.children[l].classList.add("loser");
      }
    }

    return winner;
  };

  return { getBoardCell, setBoardCell, reset, getFreeCells, judge };
}

function gameManager() {
  const board = initializeBoard();

  let isGameOver = false;
  const doPlayerTurn = (index) => {
    if (isGameOver || board.getBoardCell(index) != 0) {
      return;
    }

    board.setBoardCell(index, 1);
    let judgement = board.judge();

    if (board.getFreeCells().length > 0 && judgement == 0) {
      let computerMove =
        board.getFreeCells()[
          Math.floor(Math.random() * board.getFreeCells().length)
        ];
      board.setBoardCell(computerMove, 2);
    } else {
      isGameOver = true;
    }

    if (judgement == 0) {
      judgement = board.judge();
    }

    if (judgement > 0 || board.getFreeCells().length < 1) {
      isGameOver = true;
    }
  };
  const reset = () => {
    isGameOver = false;
    board.reset();
  };
  return { doPlayerTurn, reset };
}

game = gameManager();

boardDisplay.addEventListener("click", (e) => {
  let cell = parseInt(e.target.id.replace("_", ""));

  if (isNaN(cell)) {
    return;
  }

  game.doPlayerTurn(parseInt(cell));
});
