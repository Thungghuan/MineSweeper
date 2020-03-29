var mapRow, mapColumn, mine, mineLeft;
var first = true;
var win = false;
var lost = false;

var minePosition = {};
var block = [];
var number = [];

var rightBtnStyle = ["block", "flag_block"];

var gameWindow = document.getElementById("game_window");
var menu = document.getElementById("menu");
var container = document.getElementById("container");
var scoreBar = document.getElementById("score_bar");
var map = document.getElementById('map');
var mineLeftSpan = document.getElementsByClassName("mine_left");
var timeUsedSpan = document.getElementsByClassName("time_used");

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

function createMines() {
    for (let i = 0; i < mine; ++i) {
        var mineRow, mineColumn;
        do {
            mineRow = 1 + parseInt(Math.random() * mapRow);
            mineColumn = 1 + parseInt(Math.random() * mapColumn);
        } while (number[mineRow][mineColumn] != 0);
        number[mineRow][mineColumn] = 9;
        minePosition[i] = [mineRow, mineColumn];
    }
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
                    var timeUsed = 1;
                    setInterval(() => {
                        timeUsedSpan[0].innerText = timeUsed;
                        if (!win && !lost) timeUsed++;
                    }, 1000);
                    first = false;
                }
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
    chooseDifficulty(n);
    number = [];
    searchResult = [];
    block = [];
    map.innerHTML = "";
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

    mineLeftSpan[0].innerText = String(mineLeft);
    timeUsedSpan[0].innerText = 0;
    createMines();
    createBlocks();
    findMineNumber();
}

function blockClick(btnNum, i, j) {
    switch (btnNum) {
        case 0: //左键事件
            if (block[i][j].className != 'block') break; //只有block可以左键点击
            if (number[i][j] === 9) {
                block[i][j].className = 'mine_block';
                block[i][j].innerText = "";
                gameOver();
            } //左键点击雷
            else {
                block[i][j].className = "under_block"; //左键点击安全格
                if (number[i][j] === 0) {
                    searchResult[i][j] = 1;
                    searchZero(i, j);
                    // for (let i = 1; i <= mapRow; ++i) {
                    //     var tempRow = [];
                    //     for (let j = 1; j <= mapColumn; ++j) {
                    //         tempRow.push(searchResult[i][j]);
                    //     }
                    //     console.log(tempRow);
                    // }
                } //点击0时的搜索
                else {
                    block[i][j].innerText = number[i][j];
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
            if (blockStyle === 0) {
                if (mineLeft > 0) {
                    block[i][j].className = rightBtnStyle[(blockStyle + 1) % 2];
                    block[i][j].innerText = "旗";
                    --mineLeft;
                }
            } else {
                ++mineLeft;
                block[i][j].className = rightBtnStyle[(blockStyle + 1) % 2];
                block[i][j].innerText = "";
            }
            break;
    }
    win = gameWin();
    console.log(win);
    console.log(lost);
    mineLeftSpan[0].innerText = mineLeft;
    if (lost) {
        setTimeout(() => {
            alert("Try again!");
        }, 100);
    }
    if (win) {
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
            block[tempRow][tempColumn].className = "under_block";
            if (number[tempRow][tempColumn] != 0) block[tempRow][tempColumn].innerText = number[tempRow][tempColumn];
        }
    }
}

function gameOver() {
    lost = true;
    for (let position in minePosition) {
        console.log(minePosition[position]);
        block[minePosition[position][0]][minePosition[position][1]].className = "mine_block";
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
    console.log(block);
    // console.log(minePosition);
    // console.log(number);
    // for (let i = 1; i <= mapRow; ++i) {
    //     for (let j = 1; j <= mapColumn; ++j) {
    //         blockClick(0, i, j);
    //     }
    // }
}

function restart() {
    location.reload();
}