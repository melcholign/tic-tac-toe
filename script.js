function Gameboard(boardLength) {

    let board = [];

    // builds up the board
    for (let row = 0; row < boardLength; ++row) {
        board[row] = [];
        for (let col = 0; col < boardLength; ++col) {
            board[row][col] = null;     // null is a placeholder for a cell object 
        }
    }

    function getCellMark(cellRow, cellCol) {

    }

    function markCell(mark, cellRow, cellCol) {

    }

    return { getCellMark, markCell, };
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