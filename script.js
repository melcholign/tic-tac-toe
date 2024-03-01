function Gameboard(boardLength = 3) {

    // builds up the board
    let board = [];
    for (let row = 0; row < boardLength; ++row) {
        board[row] = [];
        for (let col = 0; col < boardLength; ++col) {
            board[row][col] = Cell();
        }
    }

    function getCellMark(cellRow, cellCol) {
        return board[cellRow][cellCol].getMark();
    }

    function markCell(mark, cellRow, cellCol) {
        if (cellRow <= boardLength && cellCol <= boardLength) {
            board[cellRow][cellCol].setMark(mark);
        }
    }

    function printBoard() {
        board.forEach(row => console.log(row.map(cell => cell.getMark() || '_')));
    }

    return { getCellMark, markCell, printBoard };
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

    const board = Gameboard();
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

    function getBoard() {
        return board;
    }

    return { playRound, getBoard };
}