function Gameboard(boardSize = 3) {

    // builds up the board
    let board = [];
    for (let row = 0; row < boardSize; ++row) {
        board[row] = [];
        for (let col = 0; col < boardSize; ++col) {
            board[row][col] = Cell();
        }
    }

    function getCellMark(cellRow, cellCol) {
        return board[cellRow][cellCol].getMark();
    }

    function markCell(mark, cellRow, cellCol) {
        if (cellRow <= boardSize && cellCol <= boardSize) {
            board[cellRow][cellCol].setMark(mark);
        }
    }

    function printBoard() {
        board.forEach(row => console.log(row.map(cell => cell.getMark() || '_')));
    }

    // a cell group contains exactly boardSize number of cells in a line
    // it is homogeneous when all its cells have the same mark
    function isHomogeneousCellGroup(mark, onCellRow, onCellCol) {
        let i;
        for (i = 0; i < boardSize && board[onCellRow(i)][onCellCol(i)].getMark() === mark; ++i);
        return i === boardSize;
    }

    return { getCellMark, markCell, printBoard, isHomogeneousCellGroup };
}

function Cell() {
    const cell = {};

    function isMarked() {
        return 'mark' in cell;
    }

    // cell value is immutable after setting it once
    function setMark(mark) {
        if (!isMarked()) {
            cell.mark = mark;
        }
    }

    function getMark() {
        return cell.mark || null;
    }

    return { isMarked, setMark, getMark, };
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

function GameController(
    playerOne = Player('P1', 'X'),
    playerTwo = Player('P2', 'O')
) {

    const boardSize = 3;
    const board = Gameboard(boardSize);

    let activePlayer = playerOne;
    let roundNumber = 1;

    function switchActivePlayer() {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    function playRound(cellRow, cellCol) {
        if (board.getCellMark(cellRow, cellCol) !== null) {
            return;
        }

        board.markCell(activePlayer.getMark(), cellRow, cellCol);

        switchActivePlayer();
        ++roundNumber;
    }

    function checkWin(cellRow, cellCol) {
        const playerMark = activePlayer.getMark();
        // checks for homogeneity of the following groups
        return board.isHomogeneousCellGroup(playerMark, () => cellRow, col => col)      // row
            || board.isHomogeneousCellGroup(playerMark, row => row, () => cellCol)      // column
            || (cellRow === cellCol) && board.isHomogeneousCellGroup(playerMark, row => row, col => col)                                // main-axis diagonal
            || (cellRow === boardSize - cellCol) && board.isHomogeneousCellGroup(playerMark, row => row, col => boardSize - col - 1);   // cross-axis diagonal 
    }

    function checkTie() {
        return roundNumber === (boardSize * boardSize);
    }

    function getBoard() {
        return board;
    }

    return { playRound, getBoard, checkWin, checkTie };
}