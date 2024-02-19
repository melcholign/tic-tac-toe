const gameBoard = (function () {

    const board = [];
    const cellsPerSide = 3;
    const unmarkedCount = cellsPerSide ** 2;

    // create a 2d array of cells
    for (let row = 0; row < cellsPerSide; ++row) {
        board[row] = [];
        for (let column = 0; column < cellsPerSide; ++column) {
            // push a cell into the row
        }
    }

    function markCell(playerMark, cellRow, cellColumn) {
        // check if the cell located by the row and columns values is already marked.
        // early return if true;

        // mark cell
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

    return { markCell, getUnmarkedCount, getBoard };

})();