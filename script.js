const Gameboard = (function () {

    const board = [];
    const cellsPerSide = 3;
    const unmarkedCount = cellsPerSide ** 2;

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
            return;
        }

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

    return { markCell, getUnmarkedCount, getBoard, };

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