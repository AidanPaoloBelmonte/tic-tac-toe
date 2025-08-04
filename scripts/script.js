const boardDisplay = document.querySelector("#board");
const resultsDesc = document.querySelector("#desc");
const resultsWinner = document.querySelector("#winner");
const restartButton = document.querySelector("#restart");
const dialog = document.querySelector("dialog");
const form = document.querySelector("form");
const nameSubmitButton = document.querySelector("#name-submit");

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
      boardDisplay.children[l].className = "";
      boardDisplay.children[l].classList.add("cell");
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

        break;
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

        break;
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

        break;
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
  let player1 = "player1";
  let turn = 1;

  let isGameOver = false;

  let previousWinner = -1;
  let consecutiveWins = 0;

  const doPlayerTurn = (index) => {
    if (isGameOver || board.getBoardCell(index) != 0) {
      if (isGameOver && consecutiveWins < 3) {
        reset();
        return;
      } else {
        return;
      }
    }

    board.setBoardCell(index, turn);
    let judgement = board.judge();
    turn = turn == 1 ? 2 : 1;

    if (judgement == 0) {
      judgement = board.judge();
    }

    if (judgement > 0 || board.getFreeCells().length < 1) {
      isGameOver = true;

      if (previousWinner != judgement) {
        consecutiveWins = 1;
        previousWinner = judgement;
      } else {
        consecutiveWins++;
      }

      if (judgement == 0) {
        resultsWinner.classList.add("display");
        resultsWinner.classList.add("tie");

        if (consecutiveWins >= 3) {
          resultsWinner.textContent = "COMPLETE TIE";
          resultsWinner.classList.add("definitive");
        } else {
          resultsWinner.textContent = "TIE!";
        }
      } else {
        resultsWinner.classList.add("display");
        resultsWinner.textContent =
          judgement == 1 ? `${player1}` : `${player2}`;

        if (consecutiveWins >= 3) {
          resultsDesc.textContent = "ABSOLUTE WINNER";
          resultsWinner.classList.add("definitive");
        } else {
          resultsDesc.textContent = "WINNER!";
        }
      }

      if (consecutiveWins >= 3) {
        restartButton.classList.add("alert");
      }
    }
  };

  const reset = (full = false) => {
    isGameOver = false;
    board.reset();

    resultsDesc.textContent = "";
    resultsDesc.className = "";
    resultsWinner.textContent = "";
    resultsWinner.className = "";

    if (full) {
      previousWinner = -1;
      consecutiveWins = 0;
    }

    restartButton.className = "";
  };

  const setPlayerName = (name, player) => {
    if (player == 1) {
      player1 = name;
    } else {
      player2 = name;
    }
  };

  return { doPlayerTurn, reset, setPlayerName };
}

game = gameManager();

nameSubmitButton.addEventListener("click", (e) => {
  if (!form.reportValidity()) {
    return;
  }

  const newForm = new FormData(form);

  game.setPlayerName(newForm.get("player1"), 1);
  game.setPlayerName(newForm.get("player2"), 2);

  dialog.close();
  form.reset();

  e.preventDefault();
});

boardDisplay.addEventListener("click", (e) => {
  let cell = parseInt(e.target.id.replace("_", ""));

  if (isNaN(cell)) {
    return;
  }

  game.doPlayerTurn(parseInt(cell));
});

restart.addEventListener("click", (e) => {
  game.reset(true);
});
