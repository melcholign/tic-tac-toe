const Gameboard = (function () {

    const board = [];
    const cellsPerSide = 3;
    let unmarkedCount = cellsPerSide ** 2;

    // create a 2d array of cells
    for (let row = 0; row < cellsPerSide; ++row) {
        board[row] = [];
        for (let column = 0; column < cellsPerSide; ++column) {
            board[row].push(Cell());
        }
    }

    function markCell(playerMark, cellRow, cellColumn) {
        const cell = board[cellRow][cellColumn];

        if (!cell.isEmpty()) {
            return false;
        }

        cell.mark(playerMark);
        --unmarkedCount;

        return true;
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

    return { markCell, getUnmarkedCount, getBoard, printBoard };

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

    function printNewRound() {
        console.log(`Round ${round}`);
        console.log(`${activePlayer.getName()}'s turn`);
    }

    function playRound() {

        let validationMsg;

        const validatePromptInput = promptInput => {
            if (promptInput === null || promptInput.trim() === '') {
                return 'Cancelled';
            }

            const num = +promptInput;
            if (isNaN(num) || !Number.isInteger(+num)) {
                return 'Invalid input type';
            }
            return (num <= 0 || board.length < num) ? 'Input out of range' : '';
        }

        printNewRound();
        Gameboard.printBoard();

        const cellRow = prompt('Enter cell row number: ');
        validationMsg = validatePromptInput(cellRow);
        if (validationMsg) {
            console.log(validationMsg);
            return;
        }

        const cellColumn = prompt('Enter cell column number: ');
        validationMsg = validatePromptInput(cellColumn);
        if (validationMsg) {
            console.log(validationMsg);
            return;
        }

        if (!Gameboard.markCell(activePlayer.getMark(), cellRow - 1, cellColumn - 1)) {
            console.log('Cell is already marked');
        } else if (isTie()) {
            console.log('The game is a tie');
        } else if (isWin()) {
            console.log(`${activePlayer.getName()} has won`);
        } else {
            ++round;
        }
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

    return { playRound };

})();