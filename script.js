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
        return board[cellRow][cellCol];
    }

    function markCell(mark, cellRow, cellCol) {
        if (cellRow <= boardLength && cellCol <= boardLength) {
            board[cellRow][cellCol].setMark(mark);
        }
    }

    function printBoard() {
        board.forEach(row => console.log(row.map(cell => cell.getMark() || '_')));
    }

    return { getCellMark, markCell, printBoard};
}

function Cell() {
    const cell = {};

    function isUnmarked() {
        return 'mark' in cell;
    }

    // cell value is immutable after setting it once
    function setMark(mark) {
        if (isUnmarked()) {
            cell.mark = mark;
        }
    }

    function getMark() {
        return cell.mark || null;
    }

    return { isUnmarked, setMark, getMark, };
}