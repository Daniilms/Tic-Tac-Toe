const gameFieldWrp = document.querySelector(".game-field");
const gameFieldListWrp = document.querySelector(".game-field-list-wrp");
const gameName = document.querySelector(".game-name");
const gameField = document.querySelector(".game-field-list");
const settingsButtons = document.querySelectorAll(".game-settings-button");
const score = document.querySelector(".game-field-score");
const playerTurnHeader = document.querySelector(".game-field-player-turn");
const resetButton = document.querySelector(".game-reset-button");
const playButton = document.querySelectorAll(".game-field-play-button");
const playButtonWrp = document.querySelector(".game-field-play-button-wrp");
let isWhichPlayerTurn = false;
let isGameStarted = false;
let xWins = 0;
let zeroWins = 0;
let allMoves = [];
let isPC = "click";

resetButton.disabled = true;

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  isPC = "touchend";
}

const createGameCell = () => {
  const oneCell = document.createElement("li");
  oneCell.classList.add("cell-element");
  gameField.append(oneCell);
  return oneCell;
};

const createGameField = (quantityOfCells) => {
  const cells = [];
  for (let i = 0; i < quantityOfCells * quantityOfCells; i++) {
    cells.push(createGameCell());
  }
  playerMove();
  getStyled(quantityOfCells, cells);

  return cells;
};

const findAllCells = () => {
  const cellElement = document.querySelectorAll(".cell-element");
  return cellElement;
};

const playerMove = () => {
  findAllCells().forEach((el) => {
    el.dataset.content = "";
    el.addEventListener(
      `${isPC}`,
      (evt) => {
        if (!isWhichPlayerTurn && evt.target.textContent === "") {
          isWhichPlayerTurn = true;
          evt.target.dataset.content = "cross";
          evt.target.style.backgroundImage = `url(img/cross-mark.svg)`;
        } else if (isWhichPlayerTurn && evt.target.textContent === "") {
          isWhichPlayerTurn = false;
          evt.target.dataset.content = "zero";
          evt.target.style.backgroundImage = `url(img/circle.svg)`;
        }

        getValidate();
        writeWhichPlayerTurn();
        allMoves.push(evt.target.dataset.content);
        isGame();
        if (checkForWin(evt.target.dataset.content)) {
          gameOver();
          whoWins();
          setTimeout(() => {
            resetFunction();
          }, 2000);
        }
        if (checkForDraw()) {
          gameOver();
          setTimeout(() => {
            resetFunction();
          }, 2000);
        }
      },
      { once: true }
    );
  });
};
const whoWins = () => {
  if (allMoves[allMoves.length - 1] === "zero") {
    zeroWins++;
    playerTurnHeader.textContent = `zero-wins! : ${zeroWins} ${checkForEven(
      zeroWins
    )}`;
    isWhichPlayerTurn = true;
  } else if (allMoves[allMoves.length - 1] === "cross") {
    xWins++;
    playerTurnHeader.textContent = `x-wins! : ${xWins} ${checkForEven(xWins)}`;
    isWhichPlayerTurn = false;
  }
  score.textContent = `${xWins} : ${zeroWins}`;
};
const checkForEven = (number) => {
  if (number === 1) {
    return "time";
  } else {
    return "times";
  }
};
const writeWhichPlayerTurn = () => {
  !isWhichPlayerTurn
    ? (playerTurnHeader.textContent = "first player turn...")
    : (playerTurnHeader.textContent = "second player turn...");
};

const checkForDraw = () => {
  if (!checkForWin() && allMoves.length === returnSize() * returnSize()) {
    isWhichPlayerTurn = false;
    playerTurnHeader.textContent = "Draw";
    return true;
  }
};

const checkForDataContent = () => {
  let data = "";
  if (isWhichPlayerTurn) {
    data = "zero";
  } else {
    data = "cross";
  }

  return data;
};

const getValidate = () => {
  if (checkForWin()) {
    resetButton.disabled = true;
  } else if (allMoves.length === 0) {
    resetButton.disabled = false;
  } else {
    resetButton.disabled = false;
  }
};

const getStyled = (quantityOfCells, cells) => {
  gameField.style.gridTemplateColumns = `repeat(${quantityOfCells}, 1fr)`;

  for (let i = 0; i < cells.length; i++) {
    if ([i + 1] % Number(quantityOfCells) !== 0) {
      cells[i].style.borderRight = "none";
    }
    if (i < cells.length - Number(quantityOfCells)) {
      cells[i].style.borderBottom = "none";
    }
  }
  cells.forEach((cell) => {
    cell.addEventListener("mouseover", (evt) => {
      if (cell.dataset.content === "") {
        if (!isWhichPlayerTurn) {
          evt.target.classList.add("cell-element-mod-cross");
          evt.target.classList.remove("cell-element-mod-zero");
        } else {
          evt.target.classList.add("cell-element-mod-zero");
          evt.target.classList.remove("cell-element-mod-cross");
        }
        cell.addEventListener("mouseout", () => {
          evt.target.classList.remove("cell-element-mod-zero");
          evt.target.classList.remove("cell-element-mod-cross");
        });
      }
    });
  });
};

const resetFunction = () => {
  let currentData = returnSize();
  findAllCells().forEach((cell) => {
    cell.remove();
  });
  allMoves = [];
  isGameStarted = false;
  createGameField(currentData);
  writeWhichPlayerTurn();
};
const gameOver = () => {
  gameField.classList.add("game-field-list-modifier-2");
  setTimeout(() => {
    gameFieldListWrp.classList.add(
      `game-field-list-wrp-mod`,
      `game-field-list-wrp-mod-2`
    );
  }, 1500);
  setTimeout(() => {
    gameField.classList.remove("game-field-list-modifier-2");
    gameFieldListWrp.classList.remove(
      `game-field-list-wrp-mod`,
      `game-field-list-wrp-mod-2`
    );
  }, 2000);
};
let quantityOfDiagonalTruesReturned = 0;
const checkForWin = (evt) => {
  const copyAllMoves = [...findAllCells()];
  const size = returnSize();
  const winningComboArray = [];
  let array = [];
  let action = "";
  for (let i = 0; i < size; i++) {
    let elem = copyAllMoves.splice(0, size);
    array.push(elem);
  }
  let quantityOfTotalTruesReturned = 0;
  let quantityOfTotalTruesReturned2 = 0;
  let returnedFunc = 0;

  // проверка по горизонтали и вертикали
  for (let k = 0; k < size; k++) {
    let colWin = true;
    let rowWin = true;
    for (let j = 0; j < size - 1; j++) {
      if (
        array[k][j].dataset.content !== array[k][j + 1].dataset.content ||
        array[k][j].dataset.content === "" ||
        array[k][j].dataset.content !==
          array[k][array.length - (j + 1)].dataset.content ||
        array[k][array.length - 1].dataset.content === ""
      ) {
        rowWin = false;
      } else {
        quantityOfTotalTruesReturned++;
        action = "rowWin";
        if (returnSize() === 4) {
          if (rowWin && quantityOfTotalTruesReturned > 2) {
            returnedFunc++;
            winningComboArray.push([k, j]);
            winningCombo(winningComboArray, array, action, rowWin);
          }
        } else {
          if (rowWin && quantityOfTotalTruesReturned > 1) {
            returnedFunc++;
            winningComboArray.push([k, j]);
            winningCombo(winningComboArray, array, action, rowWin);
          }
        }
      }
      if (
        array[j][k].dataset.content !== array[j + 1][k].dataset.content ||
        array[j][k].dataset.content === "" ||
        array[j][k].dataset.content !==
          array[array.length - j - 1][k].dataset.content ||
        array[array.length - j - 1][k].dataset.content !==
          array[array.length - j - 2][k].dataset.content
      ) {
        colWin = false;
      } else {
        quantityOfTotalTruesReturned2++;
        console.log(
          quantityOfTotalTruesReturned,
          quantityOfTotalTruesReturned2
        );
        if (
          quantityOfTotalTruesReturned2 > 1 &&
          colWin &&
          array[j][k].dataset.content ===
            array[array.length - j - 1][k].dataset.content
        ) {
          action = "colWin";
          winningComboArray.push([k, j]);
          winningCombo(winningComboArray, array, action, colWin);
        }
      }
    }
    if (colWin || rowWin) {
      return true;
    }
  }

  // проверка по диагонали

  for (let v = 0; v < size; v++) {
    let diagonalWin = 0;
    let diagonalWin2 = 0;
    let diagonal1Win = false;
    let diagonal2Win = false;
    for (let i = 1; i < size; i++) {
      if (
        array[v][v].dataset.content === array[i][i].dataset.content &&
        array[v][v].dataset.content !== "" &&
        array[array.length - i][array.length - i].dataset.content ===
          array[v][v].dataset.content
      ) {
        diagonalWin++;
        if (size === 3) {
          if (diagonalWin === size - 1) {
            diagonal1Win = true;
            action = "diagonal1Win";
            winningCombo(winningComboArray, array, action, diagonal1Win);
          }
        }
        if (size === 4) {
          if (diagonalWin === size - 1) {
            diagonal1Win = true;
            action = "diagonal1Win";
            winningCombo(winningComboArray, array, action, diagonal1Win);
          }
        }
        if (size === 5) {
          if (diagonalWin === size - 1) {
            diagonal1Win = true;
            action = "diagonal1Win";
            winningCombo(winningComboArray, array, action, diagonal1Win);
          }
        }
      }
      if (
        array[i - 1][array.length - v - i].dataset.content ===
          array[array.length - 1][0].dataset.content &&
        array[array.length - 1][0].dataset.content !== "" &&
        array[array.length - 1][0].dataset.content ===
          array[array.length - 2][1].dataset.content
      ) {
        diagonalWin2++;
        if (size === 3) {
          if (diagonalWin2 === size - 1) {
            diagonal2Win = true;
            action = "diagonal2Win";
            winningCombo(winningComboArray, array, action, diagonal2Win);
          }
        }
        if (size === 4) {
          if (diagonalWin2 === size - 1) {
            diagonal2Win = true;

            action = "diagonal2Win";
            winningCombo(winningComboArray, array, action, diagonal2Win);
          }
        }
        if (size === 5) {
          if (diagonalWin === size - 1) {
            diagonal2Win = true;
            action = "diagonal2Win";
            winningCombo(winningComboArray, array, action, diagonal2Win);
          }
        }
      }
    }

    if (diagonal1Win || diagonal2Win) {
      return true;
    }

    return false;
  }
};

const winningCombo = (winArray, allMoves, action, actionValue) => {
  for (let index = 0; index < returnSize(); index++) {
    if (actionValue && action === "colWin") {
      let k = winArray[0][0];
      if (k > 0) {
        setTimeout(() => {
          allMoves[index][k].classList.add("cell-element-mod-cross-4");
        }, index * 200);
      } else {
        setTimeout(() => {
          allMoves[index][k].classList.add("cell-element-mod-cross-4");
        }, index * 200);
      }
    }
    if (action === "rowWin" && actionValue) {
      let k = winArray[0][0];

      if (k > 0) {
        setTimeout(() => {
          allMoves[k][index].classList.add("cell-element-mod-cross-5");
        }, index * 200);
      } else {
        setTimeout(() => {
          allMoves[k][k + index].classList.add("cell-element-mod-cross-5");
        }, index * 200);
      }
    }
    if (action === "diagonal1Win" && actionValue) {
      setTimeout(() => {
        allMoves[index][index].classList.add("cell-element-mod-cross-2");
      }, index * 200);
    }
    if (action === "diagonal2Win" && actionValue) {
      setTimeout(() => {
        allMoves[index][allMoves.length - index - 1].classList.add(
          "cell-element-mod-cross-3"
        );
      }, index * 200);
    }
  }
};

const returnSize = () => {
  const sizeOfField = findAllCells().length;
  if (sizeOfField === 9) {
    return 3;
  }
  if (sizeOfField === 16) {
    return 4;
  }
  if (sizeOfField === 25) {
    return 5;
  }
};

const isGame = () => {
  if (allMoves.length !== 0) {
    isGameStarted = true;
  }
};
playButton.forEach((button) => {
  button.addEventListener(
    "click",
    () => {
      if (button.dataset.content === "Cross") {
        isWhichPlayerTurn = false;
      } else {
        isWhichPlayerTurn = true;
      }
      gameName.classList.add("game-name-modifier");
      playButtonWrp.classList.add("game-field-play-button-invisible");
      setTimeout(() => {
        gameFieldWrp.classList.add("game-field-modifier");
      }, 1000);
      for (let i = 0; i < settingsButtons.length; i++) {
        setTimeout(() => {
          settingsButtons[i].classList.add("game-settings-button-modifier");
        }, 400 * i);
      }
      setTimeout(() => {
        settingsButtons[settingsButtons.length - 1].style.opacity = "0.5";
        /* settingsButtons[settingsButtons.length - 1].disabled = "false"; */
      }, 800);
      setTimeout(() => {
        score.textContent = `0 : 0`;
        writeWhichPlayerTurn();
        isGame();
        createGameField(3);
        gameField.classList.add("game-field-list-modifier");
        playerTurnHeader.classList.add("game-field-player-turn-modifier");
        score.classList.add("game-field-score-modifier");
        resetButton.classList.add("game-reset-button-modifier");
      }, 1400);
    },
    { once: true }
  );
});

resetButton.addEventListener("click", () => {
  gameOver();
  gameFieldListWrp.classList.add(
    `game-field-list-wrp-mod`,
    `game-field-list-wrp-mod-2`
  );
  resetButton.disabled = true;
  setTimeout(() => {
    resetFunction();
    score.textContent = `0 : 0`;
    xWins = 0;
    zeroWins = 0;
  }, 1000);
});

settingsButtons.forEach((button) => {
  button.addEventListener("click", (evt) => {
    document.querySelectorAll(".cell-element").forEach((el) => {
      if (!isGameStarted) {
        el.remove();
      }
    });
    if (!isGameStarted) {
      setTimeout(() => {
        gameField.classList.add("game-field-list-modifier");
        playerTurnHeader.classList.add("game-field-player-turn-modifier");
        score.classList.add("game-field-score-modifier");
      }, 1400);
      createGameField(evt.target.dataset.value);
    }
    writeWhichPlayerTurn();
    isGame();
  });
});
