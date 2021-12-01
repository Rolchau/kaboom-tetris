import k, { CENTER, THEMES } from '../index';

const startScene = () => {
  k.add([
    k.text('Kaboom Tetris\nby Rolchau\n\nPress SPACE\nto start', { size: 32 }),
    k.pos(CENTER),
    k.origin('center'),
    k.color(255, 255, 255),
  ]);
  k.keyPress('space', () => {
    k.go(THEMES.theGame);
  });
  // Add the Tetris Frame on the screen
  k.add([
    k.sprite('tetris-frame'),
    k.pos(CENTER.x - 172, CENTER.y - 332),
    k.scale(2),
  ]);
};

export default startScene;
