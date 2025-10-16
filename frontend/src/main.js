import { Grille } from './grille';
import { showGameOver, removeGameOver } from './utils';

const scoreEl = document.getElementById('score_header');
const scoreGameOverEl = document.getElementById('score_gameover');
const bestEl = document.getElementById('best_score');

let best = 0;

document.addEventListener('keydown', (event) => {
  if (ma_grille.No_move_left()) {
    console.log('Perdu !');
    showGameOver();
  }
});
document.querySelector('.tryagain').addEventListener('click', function () {
  removeGameOver(ma_grille);
});
