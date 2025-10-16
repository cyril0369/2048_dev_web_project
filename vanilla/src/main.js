import { Grille } from './grille';
import { showGameOver, removeGameOver } from './utils';

const scoreEl = document.getElementById('score_header');
const scoreGameOverEl = document.getElementById('score_gameover');
const bestEl = document.getElementById('best_score');

let best = 0;

let ma_grille = new Grille();
ma_grille.add_block();
ma_grille.add_block();
ma_grille.affiche();
console.log('start !');

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      ma_grille.move_to_one_direction('up');
      console.log(ma_grille.score);
      break;
    case 'ArrowDown':
      ma_grille.move_to_one_direction('down');
      console.log(ma_grille.score);
      break;
    case 'ArrowLeft':
      ma_grille.move_to_one_direction('left');
      console.log(ma_grille.score);
      break;
    case 'ArrowRight':
      ma_grille.move_to_one_direction('right');
      console.log(ma_grille.score);
      break;
  }
  if (ma_grille.No_move_left()) {
    console.log('Perdu !');
    showGameOver();
  } else {
    if (ma_grille.tableau.flat().includes(0)) {
      ma_grille.add_block();
      ma_grille.affiche();
      scoreEl.textContent = ma_grille.score;
      scoreGameOverEl.textContent = ma_grille.score;
      if (ma_grille.score > best) {
        best = ma_grille.score;
        bestEl.textContent = best;
      }
    }
  }
});
document.querySelector('.tryagain').addEventListener('click', function () {
  removeGameOver(ma_grille);
});
