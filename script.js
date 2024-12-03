document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const restartButton = document.getElementById('restart');
    const HUMAN_PLAYER = 'O';
    const AI_PLAYER = 'X';
    let board = Array(9).fill(null);

    function renderBoard() {
        boardElement.innerHTML = '';
        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.index = index;
            cellElement.textContent = cell;
            cellElement.addEventListener('click', handleHumanMove);
            boardElement.appendChild(cellElement);
        });
    }

    function handleHumanMove(event) {
        const index = event.target.dataset.index;
        if (board[index] || checkWin(board) || isBoardFull()) return;
        makeMove(index, HUMAN_PLAYER);
        if (!checkWin(board) && !isBoardFull()) {
            const aiMove = getBestMove(board, AI_PLAYER);
            makeMove(aiMove, AI_PLAYER);
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        renderBoard();
        if (checkWin(board, player)) {
            setTimeout(() => alert(`${player} wins!`), 100);
        } else if (isBoardFull()) {
            setTimeout(() => alert('Draw!'), 100);
        }
    }

    function getBestMove(board, player) {
        return minimax(board, player).index;
    }

    function minimax(newBoard, player) {
        const availSpots = newBoard.map((cell, index) => cell === null ? index : null).filter(v => v !== null);
        if (checkWin(newBoard, HUMAN_PLAYER)) {
            return { score: -10 };
        } else if (checkWin(newBoard, AI_PLAYER)) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if (player === AI_PLAYER) {
                const result = minimax(newBoard, HUMAN_PLAYER);
                move.score = result.score;
            } else {
                const result = minimax(newBoard, AI_PLAYER);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = null;
            moves.push(move);
        }

        let bestMove;
        if (player === AI_PLAYER) {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function checkWin(board, player) {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winConditions.some(condition => {
            return condition.every(index => board[index] === player);
        });
    }

    function isBoardFull() {
        return board.every(cell => cell !== null);
    }

    restartButton.addEventListener('click', () => {
        board = Array(9).fill(null);
        renderBoard();
    });

    renderBoard();
});
