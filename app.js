var mapRow, mapColumn, mine, mineLeft;
var first = true;
var win = false;
var lost = false;
var difficultyNum;
var timeUsed;
var timeInterval;
var missFlagged = true;

var minePosition = {};
var block = [];
var number = [];

var rightBtnStyle = ["block", "flag_block", "question_block"];

var gameWindow = document.getElementById("game_window");
var menu = document.getElementById("menu");
var container = document.getElementById("container");
var scoreBar = document.getElementById("score_bar");
var restartBtn = document.getElementById("restart_btn");
var map = document.getElementById('map');

var mineLeftDisplay = document.getElementById("mine_left");
var timeUsedDisplay = document.getElementById("time_used");

var searchMove = [
    [-1, 0], //往上搜索
    [-1, 1], //往右上搜索
    [0, 1], //往右搜索
    [1, 1], //往右下搜索
    [1, 0], //往下搜索
    [1, -1], //往左下搜索
    [0, -1], //往左搜索
    [-1, -1] //往左上搜索
]
var searchResult = [];

var difficulty = {
    1: {
        row: 9,
        column: 9,
        mine: 10
    },
    2: {
        row: 16,
        column: 16,
        mine: 40
    },
    3: {
        row: 16,
        column: 30,
        mine: 99
    }

}

function createMines(firstRow, firstColumn) {
    for (let i = 0; i < mine; ++i) {
        var mineRow, mineColumn;
        do {
            mineRow = 1 + parseInt(Math.random() * mapRow);
            mineColumn = 1 + parseInt(Math.random() * mapColumn);
        } while (number[mineRow][mineColumn] != 0 || (mineRow === firstRow && mineColumn === firstColumn));
        number[mineRow][mineColumn] = 9;
        minePosition[i] = [mineRow, mineColumn];
    }
    // console.log(minePosition);
}

function createBlocks() {
    for (let i = 1; i <= mapRow; ++i) {
        block[i] = [];
        var blockTop = 20 * (i - 1);
        for (let j = 1; j <= mapColumn; ++j) {
            var blockLeft = 20 * (j - 1);
            block[i][j] = document.createElement('div');
            block[i][j].className = "block";
            block[i][j].style.left = String(blockLeft) + "px";
            block[i][j].style.top = String(blockTop) + "px";
            block[i][j].addEventListener("mousedown", ((e) => {
                if (first) {
                    createMines(i, j);
                    findMineNumber();
                    timeInterval = setInterval(() => {
                        if (!win && !lost) ++timeUsed;
                        displayTimeUsed();
                    }, 1000);
                    first = false;
                }
                // setInterval(() => {
                //     if (first) timeUsed = 0;
                // }, 100);
                if (!lost && !win) blockClick(e.button, i, j);
            }))
            map.appendChild(block[i][j]);
        }
    }
}

function findMineNumber() {
    for (let index = 0; index < mine; ++index) {
        var row = minePosition[index][0];
        var column = minePosition[index][1];
        for (let i = row - 1; i <= row + 1; ++i) {
            for (let j = column - 1; j <= column + 1; ++j) {
                if (number[i][j] != 9) number[i][j]++;
            }
        }
    }
}

function chooseDifficulty(n) {
    mapRow = difficulty[n]['row'];
    mapColumn = difficulty[n]['column'];
    mine = difficulty[n]['mine'];
    mineLeft = mine;
}

function init(n) {
    document.oncontextmenu = ((e) => { e.preventDefault(); });
    window.clearInterval(timeInterval);
    chooseDifficulty(n);
    number = [];
    searchResult = [];
    block = [];
    map.innerHTML = "";
    // mineLeftDisplay.innerHTML = "";
    // timeUsedDisplay.innerHTML = "";
    for (let i = 0; i < mapRow + 2; ++i) {
        number[i] = [];
        searchResult[i] = [];
        block[i] = [];
        for (let j = 0; j < mapColumn + 2; ++j) {
            number[i][j] = 0;
            searchResult[i][j] = 0;
            block[i][j] = 0;
        }
    }
    gameWindow.style.width = String(20 + mapColumn * 20) + "px";
    gameWindow.style.height = String(105 + mapRow * 20) + "px";
    container.style.width = String(10 + mapColumn * 20) + "px";
    container.style.height = String(50 + mapRow * 20) + "px";
    scoreBar.style.width = String(mapColumn * 20) + "px";
    map.style.width = String(mapColumn * 20) + "px";
    map.style.height = String(mapRow * 20) + "px";

    restartBtn.style.backgroundImage = "url(img/smile.png)";
    // mineLeftSpan[0].innerText = String(mineLeft);
    // timeUsedSpan[0].innerText = 0;
    win = false;
    lost = false;
    first = true;
    timeUsed = 0;
    displayMineLeft();
    displayTimeUsed();
    createBlocks();
}

function blockClick(btnNum, i, j) {
    switch (btnNum) {
        case 0: //左键事件
            if (block[i][j].className != 'block') break; //只有block可以左键点击
            if (number[i][j] === 9) {
                // block[i][j].className = 'mine_block';
                // block[i][j].innerText = "";
                gameOver(i, j);
            } //左键点击雷
            else {
                block[i][j].className = "under_block"; //左键点击安全格
                if (number[i][j] === 0) {
                    searchResult[i][j] = 1;
                    searchZero(i, j)
                } else {
                    // block[i][j].innerText = number[i][j];
                    block[i][j].style.backgroundImage = "url(/img/open" + number[i][j] + ".png)";
                }
            }
            break;
        case 2: //右键事件
            if (block[i][j].className === "under_block" || block[i][j].className === "under_block") break; //只有已点开的格子无法右键点击
            // if (block[i][j].className === "block") {
            //     block[i][j].innerText = "旗";
            //     block[i][j].className = "flag_block";
            //     // block[i][j].removeEventListener("mousedown", ((e) => {
            //     //     blockClick(e.button, i, j);
            //     // }))
            // } else {
            //     block[i][j].className = "block";
            //     block[i][j].innerText = "";
            // }
            var blockStyle;
            for (let index = 0; index < rightBtnStyle.length; ++index) {
                if (block[i][j].className === rightBtnStyle[index]) blockStyle = index;
            }
            block[i][j].className = rightBtnStyle[(blockStyle + 1) % 3];
            if (blockStyle === 0) {
                if (mineLeft > 0) {
                    --mineLeft;
                }
            } else if (blockStyle === 1) {
                ++mineLeft;
            }
            break;
    }
    win = gameWin();
    // console.log(win);
    // console.log(lost);
    // mineLeftSpan[0].innerText = mineLeft;
    displayMineLeft();
    if (lost) {
        restartBtn.style.backgroundImage = "url(img/dead.png)";
        setTimeout(() => {
            alert("Try again!");
        }, 100);
    }
    if (win) {
        restartBtn.style.backgroundImage = "url(img/win.png)";
        setTimeout(() => {
            alert("Good job!");
        }, 100);
    }
}

function searchZero(row, column) {
    zeroClick(row, column);
    var nextRow, nextColumn;
    for (let i = 0; i < 8; ++i) {
        nextRow = row + searchMove[i][0];
        nextColumn = column + searchMove[i][1];
        if (nextRow === 0 || nextRow === mapRow + 1 || nextColumn === 0 || nextColumn === mapColumn + 1) {
            continue;
        } //当前位于边界 不操作
        // if (number[nextRow][nextColumn] != 0) {
        //     searchResult[nextRow][nextColumn] = 1;
        //     continue;
        // }
        if (number[nextRow][nextColumn] === 0 && searchResult[nextRow][nextColumn] === 0) {
            searchResult[nextRow][nextColumn] = 1;
            searchZero(nextRow, nextColumn);
        } //下一块为0则继续搜索
    }
    return;
}

function zeroClick(row, column) {
    for (let i = 0; i < 8; ++i) {
        var tempRow = row + searchMove[i][0];
        var tempColumn = column + searchMove[i][1];
        if (tempRow === 0 || tempRow === mapRow + 1 || tempColumn === 0 || tempColumn === mapColumn + 1) {
            continue;
        }
        if (block[tempRow][tempColumn].className === "block") {
            // block[tempRow][tempColumn].className = "under_block";
            // if (number[tempRow][tempColumn] != 0) block[tempRow][tempColumn].innerText = number[tempRow][tempColumn];
            blockClick(0, tempRow, tempColumn);
        }
    }
}

function gameOver(clickRow, clickColumn) {
    lost = true;
    for (let position in minePosition) {
        if (minePosition[position][0] === clickRow && minePosition[position][1] === clickColumn) {
            block[minePosition[position][0]][minePosition[position][1]].className = "mine_death";
        } else if (block[minePosition[position][0]][minePosition[position][1]].className != "flag_block") {
            block[minePosition[position][0]][minePosition[position][1]].className = "mine_block";
        }
    }
    for (let i = 1; i <= mapRow; ++i) {
        for (let j = 1; j <= mapColumn; ++j) {
            if (block[i][j].className === "flag_block") {
                missFlagged = true;
                for (let position in minePosition) {
                    if (minePosition[position][0] === i && minePosition[position][1] === j) missFlagged = false;
                }
                if (missFlagged) block[i][j].className = "miss_flagged";
            }
        }
    }
}

function gameWin() {
    for (let i = 1; i <= mapRow; ++i) {
        for (let j = 1; j <= mapColumn; ++j) {
            if (number[i][j] === 9) continue;
            else if (block[i][j].className != "under_block") return false;
        }
    }
    return true;
}

function main(n = 1) {
    init(n);
    difficultyNum = n;
    // console.log(block);
    // console.log(number);
    // for (let i = 1; i <= mapRow; ++i) {
    //     for (let j = 1; j <= mapColumn; ++j) {
    //         blockClick(0, i, j);
    //     }
    // }
}

function restart() {
    init(difficultyNum);
}

function displayMineLeft() {
    mineLeftDisplay.innerHTML = "";
    var digitImg;
    var digit = [];
    digit[0] = parseInt(mineLeft / 100);
    digit[1] = parseInt(mineLeft % 100 / 10);
    digit[2] = parseInt(mineLeft % 10);
    for (let i = 0; i < 3; ++i) {
        digitImg = document.createElement('img');
        digitImg.src = "/img/digit" + digit[i] + ".png";
        digitImg.className = "mine_left";
        mineLeftDisplay.appendChild(digitImg);
    }
}

function displayTimeUsed() {
    timeUsedDisplay.innerHTML = "";
    var digitImg;
    var digit = [];
    if (timeUsed <= 999) {
        digit[0] = parseInt(timeUsed / 100);
        digit[1] = parseInt(timeUsed % 100 / 10);
        digit[2] = parseInt(timeUsed % 10);
    } else digit = [9, 9, 9];
    for (let i = 2; i >= 0; --i) {
        digitImg = document.createElement('img');
        digitImg.src = "/img/digit" + digit[i] + ".png";
        digitImg.className = "time_used";
        timeUsedDisplay.appendChild(digitImg);
    }
}