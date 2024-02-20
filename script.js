const Gameboard = (function () {

    const board = [];
    const cellsPerSide = 3;
    let unmarkedCount = cellsPerSide ** 2;

    // create a 2d array of cells
    function resetBoard() {
        for (let row = 0; row < cellsPerSide; ++row) {
            board[row] = [];
            for (let column = 0; column < cellsPerSide; ++column) {
                board[row].push(Cell());
            }
        }
    }

    function markCell(playerMark, cellRow, cellColumn) {
        const cell = board[cellRow][cellColumn];

        cell.mark(playerMark);
        --unmarkedCount;
    }

    // this will be useful in the determination of a tie
    function getUnmarkedCount() {
        return unmarkedCount;
    }

    // the board will be required to check for a winner, and provide cell information for the UI to display
    function getBoard() {
        return board;
    }

    function printBoard() {
        board.forEach(row => console.log(row.map(cell => cell.getValue())));
    }

    resetBoard();

    return { markCell, getUnmarkedCount, getBoard, printBoard, resetBoard };

})();

function Cell() {
    const EMPTY_CELL = ' ';
    let value = EMPTY_CELL;

    function isEmpty() {
        return value === EMPTY_CELL;
    }

    function mark(playerMark) {
        value = playerMark;
    }

    function getValue() {
        return value;
    }

    return { isEmpty, mark, getValue, };
}

function Player(playerName, playerMark) {
    const name = playerName;
    const mark = playerMark;

    function getName() {
        return name;
    }

    function getMark() {
        return mark;
    }

    return { getName, getMark };
}

const GameController = (function (
    playerOne = Player('P1', 'x'),
    playerTwo = Player('P2', 'o')
) {

    const board = Gameboard.getBoard();

    let activePlayer = playerOne;
    let round = 1;

    function switchActivePlayer() {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    function getRoundInfo() {
        return { round, playerName: activePlayer.getName() };
    }

    function playRound(cellRow, cellCol) {
        const cell = board[cellRow][cellCol];
        let roundOutcome;

        if (!cell.isEmpty()) {
            return null;
        }

        Gameboard.markCell(activePlayer.getMark(), cellRow, cellCol);

        if (isWin()) {
            roundOutcome = `${activePlayer.getName()} has won`;
            round = 0;
        }

        if (isTie()) {
            roundOutcome = `The game is a tie`;
            round = 0;
        }

        ++round;
        switchActivePlayer();

        return roundOutcome;
    }

    function isTie() {
        return board.getUnmarkedCount <= 1;
    }

    function isWin() {
        const playerMark = activePlayer.getMark();
        const cellsPerSide = board.length;

        const hasEqualMark = (cell) => cell.getValue() === playerMark;
        const hasReachedEndCell = (endCellCoord) => endCellCoord === cellsPerSide;
        const isCongruentGroup = (onLocatedCell) => {
            let cellCoord;
            for (cellCoord = 0; cellCoord < cellsPerSide && hasEqualMark(onLocatedCell(cellCoord)); ++cellCoord);
            return hasReachedEndCell(cellCoord);
        };

        // check each row and column
        let row;
        const getRowGroup = isHorizontal => cellCoord => (isHorizontal ? board[row][cellCoord] : board[cellCoord][row]);
        for (row = 0; row < cellsPerSide; ++row) {
            if (isCongruentGroup(getRowGroup(true)) || isCongruentGroup(getRowGroup(false))) {
                return true;
            }
        }

        // check primary and second diagonal (row value is used for column index as well)
        return isCongruentGroup(cellCoord => board[cellCoord][cellCoord])
            || isCongruentGroup(cellCoord => board[cellCoord][cellsPerSide - cellCoord - 1]);
    }

    return { getRoundInfo, playRound };

})();

const displayController = (function () {
    const board = Gameboard.getBoard();
    const startButton = document.querySelector('#start-button');
    const cellButtons = document.querySelectorAll('.cell button');
    const gameEventDisplay = document.querySelector('#event-display');

    // starts game
    startButton.addEventListener('click', () => {
        clearEventDisplay();
        startButton.disabled = true;
        clearCellMarks();
        toggleCellButtons();
        setRoundDisplay();
    });

    cellButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!button.disabled) {
                console.log('click')
                const value = button.value - 1;
                const cellRow = Math.floor(value / 3);
                const cellCol = value % 3;
                const roundOutcome = GameController.playRound(cellRow, cellCol);

                if (roundOutcome === null) {
                    return;
                }

                button.textContent = board[cellRow][cellCol].getValue();

                if (roundOutcome !== undefined) {
                    clearEventDisplay();
                    Gameboard.resetBoard();

                    const gameOutcome = document.createElement('h1');
                    gameOutcome.textContent = roundOutcome;
                    gameEventDisplay.appendChild(gameOutcome);

                    toggleCellButtons();
                    startButton.disabled = false;

                } else {
                    setRoundDisplay();
                }
            }
        });
    });

    function setRoundDisplay() {
        const roundInfo = GameController.getRoundInfo();

        const roundNumber = gameEventDisplay.querySelector('.round-number') || addNewDisplayElement('h3', 'round-number');
        roundNumber.textContent = `Round ${roundInfo.round}`;

        const playerTurn = gameEventDisplay.querySelector('.player-turn') || addNewDisplayElement('h2', 'player-turn');
        playerTurn.textContent = `${roundInfo.playerName}'s turn`;
    }

    function addNewDisplayElement(elementType, className) {
        const element = document.createElement(elementType);
        element.className = className;
        gameEventDisplay.appendChild(element);
        return element;
    }

    function toggleCellButtons() {
        cellButtons.forEach(button => button.disabled = !button.disabled);
    }

    function clearCellMarks() {
        cellButtons.forEach(button => button.textContent = '');
    }

    function clearEventDisplay() {
        while (gameEventDisplay.firstChild) {
            gameEventDisplay.removeChild(gameEventDisplay.lastChild);
        }
    }

})();