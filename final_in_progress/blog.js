// cellular automata code used from this link
// https://p5js.org/examples/simulate-game-of-life.html


// CELLULAR AUTOMATA ------------------------------------------------------

let w;
let columns;
let rows;
let board;
let next;
let fr = 10;

function setup() {
    noStroke()

    // Set simulation framerate to 10 to avoid flickering
    frameRate(fr);
    var canvas = createCanvas(720, 250);
    canvas.parent('animation');
    w = 20;
    // Calculate columns and rows
    columns = floor(width / w);
    console.log(columns)
    rows = floor(height / w);
    // Wacky way to make a 2D array is JS
    board = new Array(columns);
    for (let i = 0; i < columns; i++) {
        board[i] = new Array(rows);
    }
    // Going to use multiple 2D arrays and swap them
    next = new Array(columns);
    for (let i = 0; i < columns; i++) {
        next[i] = new Array(rows);
    }
    init();
}


function draw() {
    background(255);
    generate();
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if ((board[i][j] == 1)) {
                fill(random(150, 255), 
                random(100, 200), 
                random(150, 255));
            } else {
                fill(255);
            }
            rect(i * w, j * w, w - 1, w - 1);
        }
    }
}

// reset board when mouse is pressed
function mousePressed() {
    init();
}

// Fill board randomly
function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1) board[i][j] = 0;
            else board[i][j] = floor(random(2));
            next[i][j] = 0;
        }
    }
}

// The process of creating the new generation
function generate() {
    // Loop through every spot in our 2D array and check spots neighbors
    for (let x = 1; x < columns - 1; x++) {
        for (let y = 1; y < rows - 1; y++) {
            // Add up all the states in a 3x3 surrounding grid
            let neighbors = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    neighbors += board[x + i][y + j];
                }
            }

            neighbors -= board[x][y];
            // Rules of Life
            if ((board[x][y] === 1) && (neighbors < 2)) {
                next[x][y] = 0;
            } else if ((board[x][y] === 1) && (neighbors > 3)) {
                next[x][y] = 0;
            } else if ((board[x][y] === 0) && (neighbors == 3)) {
                next[x][y] = 1;
            } else next[x][y] = board[x][y];
        }
    }

    let temp = board;
    board = next;
    next = temp;
}
