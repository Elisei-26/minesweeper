const table = new Array(16).fill(0).map(() => new Array(16).fill(0));
for (let i = 0; i < 16; ++i) {
    for (let j = 0; j < 16; ++j) {
        if (i == 0 || j == 0 || i == 15 || j == 15) {
            table[i][j] = 1;
        } else {
            table[i][j] = 0;
        }
    }
}
var nrBombs = 30, x, y;
while (nrBombs > 0) { // choose the elements in the matrix that contain bombs
    x = Math.floor(Math.random() * Math.floor(14));
    y = Math.floor(Math.random() * Math.floor(14));
    if (table[x][y] == 0) {
        table[x][y] = 4;
        --nrBombs;
    }
}
for (let m = 1; m < 15; ++m) { // generate the game board
    $('#table').append('<tr></tr>');
    for (let n = 1; n < 15; ++n) {
        $('#table').append('<td align="center" valign="middle"><button type="button" class="btn btn-outline-dark btn-primary" id="' + m + " " + n + '"  onmousedown="whichButton(event, id);"><font size="5">⛝</font></button></td>');
    }
}
var gameStatus = 0;

function whichButton(event, id) {
    if (gameStatus == '0') { // if game is not over
        let length = id.length;
        let x = 0, y = 0;
        for (let i = 0; i < length; ++i) { // convert the id into x and y coordinates of the matrix
            if (id[i] !== ' ') {
                y = ((y * 10) + (id[i] - '0'));
            } else {
                x = y;
                y = 0;
            }
        }
        if (event.buttons == '2' && table[x][y] != '1') { // if the right click was clicked and the box that was right clicked is undiscovered
            document.getElementById(id).innerHTML = ('🚩');
        } else if (event.buttons == '4' && table[x][y] != '1') { // if the mouse wheel was clicked and the box clicked is undiscovered
            document.getElementById(id).innerHTML = ('?');
        } else { // if left click was clicked
            if (table[x][y] == '4') { // if left click was clicked on a box with a bomb
                for (let i = 0; i < 16; ++i) {
                    for (let j = 0; j < 16; ++j) {
                        if (table[i][j] == '4') {
                            document.getElementById(i + " " + j).style.backgroundColor = 'red';
                            document.getElementById(i + " " + j).innerHTML = ('💣');
                        }
                    }
                }
                ++gameStatus;
                document.getElementById("message").innerHTML = ('You lost! Click on RESTART to try again!');
            } else { // if left click was clicked on a box without a bomb
                return leftClick(x, y);
            }
        }
    } else { // if game is over but player still click on boxes
        document.getElementById("message").innerHTML = ('Click on restart!');
    }
}

var arrayLine;
var arrayColumn;

function leftClick(line, column) { 
    arrayLine = new Array(1000).fill(0); // in this string I save the lines on which the boxes without bombs are
    arrayColumn = new Array(1000).fill(0); // in this string I save the columns on which the boxes without bombs are
    let length = 0;
    arrayLine[length] = line;
    arrayColumn[length] = column;
    ++length;
    for (let i = 0; i < length; ++i) { // go through the two strings
        let bombs = 0;
        let m = arrayLine[i] - 1, n = arrayColumn[i] - 1;
        let x = arrayLine[i] + 1, y = arrayColumn[i] + 1;
        for (let length2 = n + 2; n < length2; ++n, --y) { // starting from here...
            if (table[m][n] == '4') {
                ++bombs;
            }
            if (table[x][y] == '4') {
                ++bombs;
            } 
        }
        for (let length2 = m + 2; m < length2; ++m, --x) {
            if (table[m][n] == '4') {
                ++bombs;
            }
            if (table[x][y] == '4') {
                ++bombs;
            } 
        } // until here, check all neighbors of the boxe to see if one of them has a bomb
        if (bombs > '0') { // if one of the neighbors has a bomb
            document.getElementById(arrayLine[i] + " " + arrayColumn[i]).innerHTML = (bombs);
        } else { // if no one of the neighbors has a bomb
            m = arrayLine[i] - 1, n = arrayColumn[i] - 1;
            x = arrayLine[i] + 1, y = arrayColumn[i] + 1;
            for (let length2 = n + 2; n < length2; ++n, --y) { // starting from here...
                if (table[m][n] == '0') {
                    length = saveCoordinates(length, m, n);
                } 
                if (table[x][y] == '0') {
                    length = saveCoordinates(length, x, y);
                }
            }
            for (let length2 = m + 2; m < length2; ++m, --x) {
                if (table[m][n] == '0') {
                    length = saveCoordinates(length, m, n);
                }
                if (table[x][y] == '0') {
                    length = saveCoordinates(length, x, y);
                }
            }// until here, save the coordinates of the neighboring boxes in arrayLine and arrayColumn
            document.getElementById(arrayLine[i] + " " + arrayColumn[i]).innerHTML = ('');
        }
        document.getElementById(arrayLine[i] + " " + arrayColumn[i]).style.backgroundColor = '#66ffff';
        table[arrayLine[i]][arrayColumn[i]] = 1;
        let check = 0;
        for (let x = 0; x < 15; ++x) { // check if the game is over
            for (let y = 0; y < 15; ++y) {
                if (table[x][y] == '0') {
                    x = 15;
                    y = 15;
                    check = 1;
                }
            }
        }
        if (check == '0') { // if game is over
            ++gameStatus;
            document.getElementById("message").innerHTML = ('Congratulation! You win!');
        }
    }
}

function saveCoordinates(length, m, n) {
    arrayLine[length] = m;
    arrayColumn[length] = n;
    return ++length;
}

function restart() {
    window.location.reload(true);
}
