function createGameBoard() {
    let gameBoardTiles = [];
    let index = 0;
    for (let x = 0; x < 3; x++) {
        gameBoardTiles[x] = new Array(3);
        for (let y = 0; y < 3; y++) {
            gameBoardTiles[x][y] = createTile(x, y, index, null, null);
            index++;
        }
    }
    const getGameBoardTiles = () => gameBoardTiles;
    const storeMove = (x, y, pPlayer) => {
        gameBoardTiles[x][y].storeMove(pPlayer);
    };
    const isVacantTile = (x, y) => gameBoardTiles[x][y] == null;
    return {storeMove, isVacantTile, getGameBoardTiles};
}

function createTile(x, y, index, player, streakOwner) {
    const storeMove = (player) => {
        let element = document.querySelector(`.gameTile:nth-child(${index + 1})`);
        if (player != null) {
            element.innerHTML = player.icon;
            gameController.getGameBoard().getGameBoardTiles()[x][y].player = player;
        }
    };
    const retrieveCorrespondingElement = () => {
        let element = document.querySelector(`.gameTile:nth-child(${index + 1})`);
        console.log('retrieveCorrespondingElement', {element});
        return element;
    };
    return {x, y, index, player, streakOwner, storeMove, retrieveCorrespondingElement};
}

let gameController = (function () {
    const gameStates = () => Object.freeze({
        NOT_STARTED: "NOT_STARTED",
        IN_PROGRESS: "IN_PROGRESS",
        FINISHED: "FINISHED",
        PLAYER_ONE_WINS: "PLAYER_ONE_WINS",
        PLAYER_TWO_WINS: "PLAYER_TWO_WINS",
        STALEMATE: "STALEMATE"
    })

    let gameState = gameStates().NOT_STARTED
    const playerOneName = document.getElementById("player-one-name").value
    const playerTwoName = document.getElementById("player-two-name").value

    const playerOneIcon = `<svg class="svg-x" width="200" height="200"><rect x="0" y="0" width="200" height="200" class="x"/></svg>`;
    const playerTwoIcon = `<svg class="svg-o" width="200" height="200"><circle cx="100" cy="100" r="100" class="o"/></svg>`;

    const playerOne = createPlayer(playerOneName, playerOneIcon);
    const playerTwo = createPlayer(playerTwoName, playerTwoIcon);

    let activePlayer = playerOne;
    const gameBoard = createGameBoard();

    const getGameBoard = () => gameBoard;
    const setGameState = (state) => gameState = state;
    const endPlayerTurn = () => {
        activePlayer === playerOne ? activePlayer = playerTwo : activePlayer = playerOne;
    };

    const getStreaksForPlayer = (player) => {
        return streaks.filter(streak => streak.player === player);
    }

    const updateScore = () => {

        let playerOneStreaks = getStreaksForPlayer(playerOne);
        let playerTwoStreaks = getStreaksForPlayer(playerTwo);
        let allStreaks = [...playerOneStreaks, ...playerTwoStreaks];

        playerOne.score = playerOneStreaks.length;
        playerTwo.score = playerTwoStreaks.length;

        document.getElementById("player-one-score").innerText = playerOne.score;
        document.getElementById("player-two-score").innerText = playerTwo.score;

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                let tile = gameController.getGameBoard().getGameBoardTiles()[x][y];
                let tileElement = tile.retrieveCorrespondingElement();
                tileElement.className = 'gameTile';
            }

        }

        for (streak of allStreaks) {
            for (tile of streak.tileArray) {
                let tileElement = tile.retrieveCorrespondingElement();
                if (tile.streakOwner === playerOne) {
                    if (!tileElement.classList.contains('streak-x')) {
                        tileElement.classList.toggle(`streak-x`);
                    }
                } else if (tile.streakOwner === playerTwo) {
                    if (!tileElement.classList.contains('streak-o')) {
                        tileElement.classList.toggle(`streak-o`);
                    }
                }
                console.log({tileElement});
            }
        }
    };

    const getTilesInColumn = (columnIndex) => {
        let tiles = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (x === columnIndex) {
                    let tile = gameController.getGameBoard().getGameBoardTiles()[x][y];
                    tiles.push(tile);
                }
            }
        }
        return tiles;
    };

    const getTilesInRow = (rowIndex) => {
        let tiles = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (y === rowIndex) {
                    let tile = gameController.getGameBoard().getGameBoardTiles()[x][y];
                    tiles.push(tile);
                }
            }
        }
        return tiles;
    }

    const getTilesInDiagonal = (x1, y1, x2, y2, x3, y3) => {
        let tiles = [];
        let tileOne = gameController.getGameBoard().getGameBoardTiles()[x1][y1];
        let tileTwo = gameController.getGameBoard().getGameBoardTiles()[x2][y2];
        let tileThree = gameController.getGameBoard().getGameBoardTiles()[x3][y3];
        tiles = tiles.concat(tileOne, tileTwo, tileThree);
        return tiles;
    }

    const processStreaks = () => {
        streaks = [];
        processVerticalStreaks();
        processHorizontalStreaks();
        processDiagonalStreaks();
    }

    const isStreak = (tileArray) => {
        let players = tileArray.map(tile => tile.player);
        return players[0] != null && players[0] === players[1] && players[1] === players[2];
    }

    const processVerticalStreaks = () => {
        let tilesInColumnOne = getTilesInColumn(0);
        let tilesInColumnTwo = getTilesInColumn(1);
        let tilesInColumnThree = getTilesInColumn(2);

        if (isStreak(tilesInColumnOne)) {
            streaks.push(createStreak(tilesInColumnOne, tilesInColumnOne[0].player));
        }
        if (isStreak(tilesInColumnTwo)) {
            streaks.push(createStreak(tilesInColumnTwo, tilesInColumnTwo[0].player));
        }
        if (isStreak(tilesInColumnThree)) {
            streaks.push(createStreak(tilesInColumnThree, tilesInColumnThree[0].player));
        }
    }

    const processHorizontalStreaks = () => {
        let tilesInRowOne = getTilesInRow(0);
        let tilesInRowTwo = getTilesInRow(1);
        let tilesInRowThree = getTilesInRow(2);

        if (isStreak(tilesInRowOne)) {
            streaks.push(createStreak(tilesInRowOne, tilesInRowOne[0].player));
        }
        if (isStreak(tilesInRowTwo)) {
            streaks.push(createStreak(tilesInRowTwo, tilesInRowTwo[0].player));
        }
        if (isStreak(tilesInRowThree)) {
            streaks.push(createStreak(tilesInRowThree, tilesInRowThree[0].player));
        }
    }

    const processDiagonalStreaks = () => {
        let tilesInLeftToRightDiagonal = getTilesInDiagonal(0, 2, 1, 1, 2, 0)
        let tilesInRightToLeftDiagonal = getTilesInDiagonal(0, 0, 1, 1, 2, 2);

        if (isStreak(tilesInLeftToRightDiagonal)) {
            streaks.push(createStreak(tilesInLeftToRightDiagonal, tilesInLeftToRightDiagonal[0].player));
        }
        if (isStreak(tilesInRightToLeftDiagonal)) {
            streaks.push(createStreak(tilesInRightToLeftDiagonal, tilesInRightToLeftDiagonal[0].player));
        }
    }
    const createStreak = (tileArray, player) => {
        for (tile of tileArray) {
            tile.streakOwner = player;
            console.log(`Adding streakOwner to tile for player ${player.name} at tile[x,y] ${tile.x},${tile.y}`);
        }
        return {tileArray, player};
    }
    const getActivePlayer = () => activePlayer;
    const setActivePlayer = (player) => activePlayer = player;
    const storeMove = (x, y, player) => {
        getGameBoard().storeMove(x, y, player);
    };
    const startGame = () => {
        setGameState(gameStates().IN_PROGRESS);
        document.getElementById('start-game-btn').style.visibility = 'hidden';
        document.getElementById('reset-game-btn').style.visibility = 'visible';
    };
    return {playerOne, playerTwo, getGameBoard, gameState, gameStates, setGameState, endPlayerTurn, getActivePlayer, setActivePlayer, storeMove, updateScore, getTilesInColumn, getTilesInRow, processStreaks, startGame};
})();

function createPlayer(name, icon) {
    return {name, icon};
}

let tileNodeList = document.querySelectorAll('div.gameTile');

for (let x = 1; x < 4; x++) {
    for (let y = 1; y < 4; y++) {
        let tile = gameController.getGameBoard().getGameBoardTiles()[x - 1][y - 1];
        let element = tileNodeList[tile.index];
        element.addEventListener('click', function () {
            gameController.storeMove(tile.x, tile.y, gameController.getActivePlayer());
            gameController.processStreaks();
            gameController.updateScore();
            gameController.endPlayerTurn();
        });
    }
}
