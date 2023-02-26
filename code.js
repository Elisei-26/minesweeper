const table = new Array(16).fill(0).map(() => new Array(16).fill(0));
generateGameBoard();

function generateGameBoard() {
    for (let i = 0; i < 16; ++i) { // generates game board and creates a "fence" around the matrix
        if (0 < i && i < 15) {
            $('#table').append('<tr></tr>');
        }
        for (let j = 0; j < 16; ++j) {
            if (i == 0 || j == 0 || i == 15 || j == 15) {
                table[i][j] = 1;
            }
            if (i != 0 && j != 0 && i != 15 && j != 15) {
                $('#table').append('<td align="center" valign="middle"><button type="button" class="btn btn-outline-dark btn-primary" id="' + i + " " + j + '" onmousedown="whichButton(event, id);"></button></td>');
            }
        }
    }
    var nrBombs = 33, o, u;
    while (nrBombs > 0) { // choose the elements in the matrix that contain bombs
        o = Math.floor(Math.random() * Math.floor(15));
        u = Math.floor(Math.random() * Math.floor(15));
        if (table[o][u] == 0) {
            table[o][u] = 40;
            --nrBombs;
        }
    }
    return false;
}

var gameStatus = 0;

function whichButton(event, id) {
    if (gameStatus == '0') { // if game is not over
        let coordonates = id.split(" "); // here and ...
        let x = parseInt(coordonates[0]), y = parseInt(coordonates[1]); // here, convert the id into x and y coordinates of the matrix
        if (event.buttons == '2' && table[x][y] != 1) { // if the right click was clicked and the square that was right clicked is undiscovered
            document.getElementById(id).innerHTML = ('🚩');
        } else if (event.buttons == '4' && table[x][y] != 1) { // if the mouse wheel was clicked and the square clicked is undiscovered
            document.getElementById(id).innerHTML = ('?');
        } else { // if left click was clicked
            if (table[x][y] == '40') { // if left click was clicked on a square with a bomb
                for (let i = 0; i < 16; ++i) {
                    for (let j = 0; j < 16; ++j) {
                        if (table[i][j] == '40') {
                            document.getElementById(i + " " + j).style.backgroundColor = 'red';
                            document.getElementById(i + " " + j).innerHTML = ('💣');
                        }
                    }
                }
                ++gameStatus;
                document.getElementById("message").innerHTML = ('You lost! Click on RESTART to try again!');
            } else { // if left click was clicked on a square without a bomb
                return leftClick(x, y);
            }
        }
    } else { // if game is over but player still click on squares
        document.getElementById("message").innerHTML = ('Click on restart!');
    }
    return false;
}

var arrayLine;
var arrayColumn;

function leftClick(line, column) { 
    arrayLine = new Array(1000).fill(0); // in this string I save the lines on which the squares without bombs are
    arrayColumn = new Array(1000).fill(0); // in this string I save the columns on which the squares without bombs are
    let length = 0;
    arrayLine[length] = line;
    arrayColumn[length] = column;
    ++length;
    for (let i = 0; i < length; ++i) { // go through the two strings
        let bombs = 0, x, y;
        for (x = arrayLine[i] - 1; x < arrayLine[i] + 2; ++x) { // check all neighbors of the square to see if one of them has a bomb
            for (y = arrayColumn[i] - 1; y < arrayColumn[i] + 2; ++y) {
                bombs += table[x][y];
            }
        }
        bombs = parseInt(bombs /= 40);
        if (bombs > 0) { // if one of the neighbors has a bomb
            document.getElementById(arrayLine[i] + " " + arrayColumn[i]).innerHTML = (bombs);
            bombs = 0;
        } else { // if no one of the neighbors has a bomb
            let m = arrayLine[i] - 1, n = arrayColumn[i] - 1;
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
            } // until here, save the coordinates of the neighboring squares in arrayLine and arrayColumn
            document.getElementById(arrayLine[i] + " " + arrayColumn[i]).innerHTML = ('');
        }
        document.getElementById(arrayLine[i] + " " + arrayColumn[i]).style.backgroundColor = '#66ffff';
        table[arrayLine[i]][arrayColumn[i]] = 1;
    }
    return checkStatus();
}

function checkStatus() {
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
    return false;
}

function saveCoordinates(length, m, n) {
    arrayLine[length] = m;
    arrayColumn[length] = n;
    return ++length;
}