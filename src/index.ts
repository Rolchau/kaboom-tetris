import kaboom from 'kaboom';
import startScene from './scenes/start-screen';
import theGame from './scenes/the-game';

const k = kaboom({
  clearColor: [0, 0, 0, 1],
  debug: true,
});

export const CENTER = k.vec2(k.width() / 2, k.height() / 2);

export enum THEMES {
  startScene = 'startScene',
  theGame = 'theGame',
}

k.loadSpriteAtlas('tetris-sprite.png', {
  tetrominos: {
    x: 0,
    y: 0,
    width: 16,
    height: 17 * 9,
    sliceY: 9,
  },
});

k.loadSprite('tetris-frame', 'frame.png');
k.loadSound('land', 'click.wav');
k.loadSound('line-removal', 'line-removal.wav');

k.scene(THEMES.startScene, startScene);
k.scene(THEMES.theGame, theGame);

if (window.location.toString().indexOf('localhost')) {
  k.go(THEMES.startScene);
}

export default k;

// k.start('theGame');

/* 

Block Points

  L:

  Center point: 1,1
  Points: 
  [
    0, 0, X,
    X, X, X,
    0, 0, 0
  ]
  
  Rotation:
  [
    0, 0, 1
  ]

  xNew = -y
  yNew = x

  I:
  
  Center point: 1.5, 1.5
  
  Points: 
  [
    0, 0, 0, 0,
    X, X, X, X,
    0, 0, 0, 0
    0, 0, 0, 0
  ]


  O: 

  Center point: 1.5, 0.5 
  
  Points: 
  [
    0, 1, 1, 0,
    0, 1, 1, 0,
    0, 0, 0, 0
  ]

  Center point: 


  Board: 
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0


*/
