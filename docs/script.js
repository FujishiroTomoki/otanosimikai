/* script.js */
const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
canvas.width = COLUMNS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;
context.scale(BLOCK_SIZE, BLOCK_SIZE);

const TETROMINOS = {
  I: [[1, 1, 1, 1]],
  J: [
    [1, 0, 0],
    [1, 1, 1]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ]
};

let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
let piece = createPiece();
let dropCounter = 0;
let lastTime = 0;

function createPiece() {
  const keys = Object.keys(TETROMINOS);
  const shape = TETROMINOS[keys[Math.floor(Math.random() * keys.length)]];
  return { shape, x: 3, y: 0 };
}

function rotate(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

function draw() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(board, { x: 0, y: 0 });
  drawMatrix(piece.shape, piece);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = "red";
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function drop() {
  piece.y++;
  if (collide()) {
    piece.y--;
    merge();
    piece = createPiece();
  }
  dropCounter = 0;
}

function collide() {
  return piece.shape.some((row, y) =>
    row.some((value, x) => value && (board[y + piece.y]?.[x + piece.x] !== 0))
  );
}

function merge() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) board[y + piece.y][x + piece.x] = value;
    });
  });
}

function isValidMove(offsetX) {
  return piece.shape.every((row, y) =>
    row.every((value, x) =>
      !value || (x + piece.x + offsetX >= 0 && x + piece.x + offsetX < COLUMNS && !board[y + piece.y]?.[x + piece.x + offsetX])
    )
  );
}

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > 1000) {
    drop();
  }
  draw();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && isValidMove(-1)) piece.x--;
  if (event.key === "ArrowRight" && isValidMove(1)) piece.x++;
  if (event.key === "ArrowDown") drop();
  if (event.key === "ArrowUp") {
    const rotated = rotate(piece.shape);
    if (!collide()) piece.shape = rotated;
  }
});

update();
