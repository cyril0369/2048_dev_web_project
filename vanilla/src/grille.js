import { getRandomInt, move_and_merge } from './utils';
import { tileColors } from './colors';

export class Grille {
  constructor() {
    this.tableau = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
  }

  add_block() {
    let compte_block = 0;
    while (compte_block < 1) {
      let val = (getRandomInt(2) + 1) * 2;
      let x = getRandomInt(4);
      let y = getRandomInt(4);
      if (this.tableau[x][y] == 0) {
        this.tableau[x][y] = val;
        compte_block++;
      }
    }
  }

  move_to_one_direction(direction) {
    if (direction == 'left') {
      for (let i = 0; i < 4; i++) {
        let [newRow, line_score] = move_and_merge(this.tableau[i]);
        this.tableau[i] = newRow;
        this.score += line_score;
      }
    }

    if (direction == 'right') {
      for (let i = 0; i < 4; i++) {
        let [newRow, line_score] = move_and_merge(
          this.tableau[i].slice().reverse(),
        );
        this.tableau[i] = newRow.reverse();
        this.score += line_score;
      }
    }

    if (direction == 'up') {
      for (let col = 0; col < 4; col++) {
        let column = [];
        for (let row = 0; row < 4; row++) column.push(this.tableau[row][col]);

        let [newCol, line_score] = move_and_merge(column);
        this.score += line_score;

        for (let row = 0; row < 4; row++) this.tableau[row][col] = newCol[row];
      }
    }

    if (direction == 'down') {
      for (let col = 0; col < 4; col++) {
        let column = [];
        for (let row = 0; row < 4; row++) column.push(this.tableau[row][col]);

        let [newCol, line_score] = move_and_merge(column.reverse());
        newCol = newCol.reverse();
        this.score += line_score;

        for (let row = 0; row < 4; row++) this.tableau[row][col] = newCol[row];
      }
    }
  }

  reset() {
    this.tableau = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.add_block();
    this.add_block();
  }

  No_move_left() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let val = this.tableau[i][j];

        if (val === 0) {
          return false;
        }

        if (j < 3 && this.tableau[i][j + 1] === val) {
          return false;
        }

        if (i < 3 && this.tableau[i + 1][j] === val) {
          return false;
        }
      }
    }
    return true;
  }

  affiche() {
    const grille = document.getElementById('table');
    grille.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let val = this.tableau[i][j];
        const div = document.createElement('div');
        div.textContent = val === 0 ? '' : val;
        div.style.backgroundColor = tileColors[val];
        if (val == 2 || val == 4) {
          div.style.color = '#8F7A67';
        }

        grille.appendChild(div);
      }
    }
  }
}
