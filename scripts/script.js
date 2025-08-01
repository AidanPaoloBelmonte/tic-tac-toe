function initializeBoard() {
  const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  getBoardCell = (index) => {
    board[index];
  };
  setBoardCell = (index, value) => {
    board[index] = value;
  };
  judge = () => {
    for (let l = 0; l < 3; l++) {
      // Horizontal Checks
      if (
        board[l * 3] == board[l * 3 + 1] &&
        board[l * 3] == board[l * 3 + 2] &&
        board[l * 3] != 0
      ) {
        return board[l * 3];
      }
      // Vertical Checks
      else if (
        board[l] == board[l + 3] &&
        board[l] == board[l + 6] &&
        board[l] != 0
      ) {
        return board[l];
      }
      // Diagonal Checks
      else if (
        l < 2 &&
        board[4] == board[l * 2] &&
        board[4] == board[8 + -l * 2] &&
        board[4] != 0
      ) {
        return board[4];
      }
    }

    return 0;
  };

  return { getBoardCell, setBoardCell, judge };
}

gameboard = initializeBoard();

gameManager = (function () {
  const doPlayerTurn = () => {};
  const doComputerTurn = () => {};
  const playGame = () => {};
  return { playGame };
})();

function createPlayer() {}

console.log(gameboard.judge());
