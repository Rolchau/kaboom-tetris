import { GameObj, SpriteComp } from 'kaboom';
import {
  moveRight,
  moveDown,
  generateNewTetromino,
  rotate,
} from './../components/tetromino';
import { getTetromino, moveLeft } from '../components/tetromino';
import k, { CENTER, THEMES } from '../index';

const theGame = () => {
  /* 
    Board 10 x 20 - each field renders whatever value it has in it - fx. 1 = red block, 2 = blue block, etc.
    Movement/Controls changes the value of the fields in the board...
    1. Move the tetromino
    2. Test if tetromino fits
    3. If fits, remove the tetromino from the board, and add it again with the new position
    4. If doesn't fit & movement was down, create a new tetromino at the top
    5. If the new tetromino doesn't fit -> Game over.
  */

  const BLOCK_SIZE = k.width() > 400 ? 32 : 16;
  const SCALE_FACTOR = k.width() > 400 ? 2 : 1;
  const ROWS = 20;
  const COLUMNS = 10;
  const EMPTY = 8;
  const SCORES = [0, 40, 100, 300, 1200];
  const boardMatrix = new Array<GameObj<SpriteComp>[]>(ROWS);
  let score = 0;
  let linesCount = 0;

  // Add the Tetris Frame on the screen
  k.add([
    k.sprite('tetris-frame'),
    k.pos(CENTER.x - 172, CENTER.y - 332),
    k.scale(SCALE_FACTOR),
  ]);

  const scoreLabel = k.add([
    k.text(score + '', { font: 'sink', size: 24 }),
    k.pos(CENTER.x + 345, CENTER.y - 100),
    k.origin('right'),
    k.color(255, 255, 255),
  ]);

  // Add the score counter
  const linesLabel = k.add([
    k.text(linesCount + '', { font: 'sink', size: 24 }),
    k.pos(CENTER.x + 345, CENTER.y + 100),
    k.origin('right'),
    k.color(255, 255, 255),
  ]);

  // Generate board matrix
  for (let idx = 0; idx < boardMatrix.length; idx++) {
    // Add a column array into each row
    boardMatrix[idx] = new Array(COLUMNS);
  }

  // Fill board with Game Objects
  for (let rowIdx = 0; rowIdx < ROWS; rowIdx++) {
    const row = boardMatrix[rowIdx];
    for (let colIdx = 0; colIdx < COLUMNS; colIdx++) {
      row[colIdx] = k.add([
        // Remember - k.rect sets a color, so remove it when using sprites.
        k.sprite('tetrominos', { frame: EMPTY }),
        k.scale(SCALE_FACTOR),
        k.origin('topleft'),
        k.pos(
          colIdx * BLOCK_SIZE + CENTER.x - (BLOCK_SIZE * COLUMNS) / 2,
          rowIdx * BLOCK_SIZE + CENTER.y - (BLOCK_SIZE * ROWS) / 2
        ),
      ]);
    }
  }

  // Generate the first tetromino
  generateNewTetromino();

  const addTetromino = () => {
    const { position, squares, type } = getTetromino();
    for (let idx = 0; idx < squares.length; idx++) {
      const x = position.x + squares[idx].x;
      const y = position.y + squares[idx].y;
      boardMatrix[y][x].frame = type;
    }
  };

  const removeTetromino = () => {
    const { position, squares } = getTetromino();
    for (let idx = 0; idx < squares.length; idx++) {
      const x = position.x + squares[idx].x;
      const y = position.y + squares[idx].y;
      boardMatrix[y][x].frame = EMPTY;
    }
  };

  const willFit = () => {
    const { position, squares } = getTetromino();
    for (let idx = 0; idx < squares.length; idx++) {
      const x = position.x + squares[idx].x;
      const y = position.y + squares[idx].y;

      // Restrain within the board
      if (x < 0 || x >= COLUMNS || y >= ROWS) {
        return false;
      }
      // Check for other tetrominos on the board
      if (boardMatrix[y][x].frame <= 7) {
        return false;
      }
    }
    return true;
  };

  const checkLines = () => {
    let lines = 0;
    for (let rowIdx = 0; rowIdx < ROWS; rowIdx++) {
      let isRowFull = true;
      for (let colIdx = 0; colIdx < COLUMNS; colIdx++) {
        if (boardMatrix[rowIdx][colIdx].frame === EMPTY) {
          isRowFull = false;
        }
      }
      if (isRowFull) {
        lines++;
        // Move each row down
        for (let tempRow = rowIdx; tempRow > 0; tempRow--) {
          for (let tempCol = 0; tempCol < COLUMNS; tempCol++) {
            boardMatrix[tempRow][tempCol].frame =
              boardMatrix[tempRow - 1][tempCol].frame;
          }
        }
      }
    }

    score += SCORES[lines];
    scoreLabel.text = score + '';
    linesCount += lines;
    linesLabel.text = linesCount + '';

    if (lines === 4) {
      k.shake(15);
    }
    if (lines > 0) {
      k.play('line-removal');
    } else {
      k.play('land');
    }
  };

  // Game loop...
  let time = 0;
  let paused = false;
  k.action(() => {
    if (paused) {
      return;
    }
    time += k.dt();
    if (time > 0.25) {
      removeTetromino();
      const doesFit = moveDown(willFit);
      addTetromino();
      if (!doesFit) {
        checkLines();
        generateNewTetromino();
        const canPlaceNew = willFit();
        if (!canPlaceNew) {
          k.go(THEMES.startScene);
        }
        addTetromino();
      }
      time = 0;
    }
  });

  k.keyPress('right', () => {
    if (!paused) {
      removeTetromino();
      moveRight(willFit);
      addTetromino();
    }
  });
  k.keyPress('left', () => {
    if (!paused) {
      removeTetromino();
      moveLeft(willFit);
      addTetromino();
    }
  });

  k.keyPress('p', () => {
    paused = !paused;
  });

  k.keyPress('down', () => {
    if (!paused) {
      removeTetromino();
      const doesFit = moveDown(willFit);
      addTetromino();
    }
  });

  k.keyPress('space', () => {
    if (!paused) {
      removeTetromino();
      rotate(willFit);
      addTetromino();
    }
  });
};

export default theGame;

/* 
  Custom component - update is called every frame, add once, destroy once etc.
  track time since last frame: delta time - dt()
  if time since last frame is larger than x-speed move the piece:
  movement: pos.y + distance
*/
