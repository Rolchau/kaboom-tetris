import k from '../index';

type Position = {
  x: number;
  y: number;
};

type Shape = Record<string, { squares: Position[]; centerPosition: Position }>;

enum BLOCKS {
  I_SHAPE = 0,
  T_SHAPE = 1,
  O_SHAPE = 2,
  L_SHAPE = 3,
  J_SHAPE = 4,
  S_SHAPE = 5,
  Z_SHAPE = 6,
}

let currentType = BLOCKS.I_SHAPE;

const centerPosition = {
  x: 5,
  y: 0,
};

let squares: Position[] = [];

const shapes: Shape = {
  [BLOCKS.O_SHAPE]: {
    squares: [
      { x: -0.5, y: -0.5 },
      { x: 0.5, y: -0.5 },
      { x: -0.5, y: 0.5 },
      { x: 0.5, y: 0.5 },
    ],
    centerPosition: {
      x: 4.5,
      y: 0.5,
    },
  },
  [BLOCKS.L_SHAPE]: {
    squares: [
      { x: -1.5, y: -0.5 },
      { x: -0.5, y: -0.5 },
      { x: 0.5, y: -0.5 },
      { x: 1.5, y: -0.5 },
    ],
    centerPosition: {
      x: 4.5,
      y: 1.5,
    },
  },
};

// Start with this.... add center position later. This doesn't work because of the I and O shapes center positions causes it to rotate a little weird.
// const I_SHAPE: Position[] = [
//   { x: -1, y: 0 },
//   { x: 0, y: 0 },
//   { x: 1, y: 0 },
//   { x: 2, y: 0 },
// ];

// const L_SHAPE: Position[] = [
//   { x: 0, y: 0 },
//   { x: -1, y: 0 },
//   { x: 1, y: 0 },
//   { x: 1, y: 1 },
// ];

// const J_SHAPE: Position[] = [
//   { x: 0, y: 0 },
//   { x: -1, y: 0 },
//   { x: 1, y: 0 },
//   { x: -1, y: 1 },
// ];

// const O_SHAPE: Position[] = [
//   { x: -1, y: 0 },
//   { x: 0, y: 0 },
//   { x: -1, y: 1 },
//   { x: 0, y: 1 },
// ];

const getCurrentType = () => {
  return currentType;
};

// const getSquaresFromType = (type: BLOCKS) => {
//   let squares;
//   switch (type) {
//     case BLOCKS.I_SHAPE:
//       squares = I_SHAPE;
//       break;
//     case BLOCKS.T_SHAPE:
//       squares = I_SHAPE;
//       break;
//     case BLOCKS.O_SHAPE:
//       squares = O_SHAPE;
//       break;
//     case BLOCKS.L_SHAPE:
//       squares = L_SHAPE;
//       break;
//     case BLOCKS.J_SHAPE:
//       squares = J_SHAPE;
//       break;
//     case BLOCKS.S_SHAPE:
//       squares = O_SHAPE;
//       break;
//     case BLOCKS.Z_SHAPE:
//       squares = O_SHAPE;
//       break;
//     default:
//       squares = O_SHAPE;
//   }
//   return squares;
// };

export const getTetromino = () => ({
  position: centerPosition,
  type: getCurrentType(),
  squares: squares,
});

export const generateNewTetromino = () => {
  currentType = Math.round(k.rand(0, 7));
  // centerPosition.x = 5;
  // centerPosition.y = 0;
  // squares = [...getSquaresFromType(currentType)]; <- Doesn't work, as its a shallow copy
  // squares = JSON.parse(JSON.stringify(getSquaresFromType(currentType)));
  const newShape = JSON.parse(JSON.stringify(shapes[BLOCKS.L_SHAPE]));
  squares = newShape.squares;
  centerPosition.x = newShape.centerPosition.x;
  centerPosition.y = newShape.centerPosition.y;
};

export const moveLeft = (cb: () => boolean) => {
  const oldPosition = centerPosition.x;
  centerPosition.x -= 1;
  if (!cb()) {
    centerPosition.x = oldPosition;
  }
};

export const moveRight = (cb: () => boolean) => {
  const oldPosition = centerPosition.x;
  centerPosition.x += 1;
  if (!cb()) {
    centerPosition.x = oldPosition;
  }
};

export const moveDown = (cb: () => boolean) => {
  const oldPosition = centerPosition.y;
  centerPosition.y += 1;
  if (!cb()) {
    centerPosition.y = oldPosition;
    return false;
  }
  return true;
};

// Leave out the cb to willfit - it generates a funky bug.
export const rotate = (cb: () => boolean) => {
  // x = -1
  // y = 1
  const oldSquarePositions = JSON.parse(JSON.stringify(squares));
  for (let idx = 0; idx < squares.length; idx++) {
    const tempX = squares[idx].x;
    squares[idx].x = -squares[idx].y;
    squares[idx].y = tempX;
  }
  if (!cb()) {
    squares = oldSquarePositions;
  }
};
