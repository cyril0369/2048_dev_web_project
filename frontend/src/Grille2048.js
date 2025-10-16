import React, { useState, useEffect } from 'react';
import { 
  getRandomInt, move_and_merge, showGameOver, 
  removeGameOver, showMenu, removeMenu, showHightScores 
} from './utils';
import { tileColors } from './colors';
import { GamesTable } from './component.js';

const postGame = async (grille, score) => {
  await fetch('http://127.0.0.1:8000/games/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify({ grille, score })
  });
};

const initialGrid = () => [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function addBlock(grid) {
  let emptyCells = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) emptyCells.push([i, j]);
    }
  }
  if (emptyCells.length === 0) return grid;
  const [x, y] = emptyCells[getRandomInt(emptyCells.length)];
  const val = (getRandomInt(2) + 1) * 2;
  const newGrid = grid.map(row => [...row]);
  newGrid[x][y] = val;
  return newGrid;
}

function noMoveLeft(grid) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let val = grid[i][j];
      if (val === 0) return false;
      if (j < 3 && grid[i][j + 1] === val) return false;
      if (i < 3 && grid[i + 1][j] === val) return false;
    }
  }
  return true;
}

function Grille2048() {
  const [grid, setGrid] = useState(() => {
    let g = initialGrid();
    g = addBlock(g);
    g = addBlock(g);
    return g;
  });
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/games/best_score')
      .then(res => res.json())
      .then(data => {
        if (typeof data === 'object' && data.best_score !== undefined) {
          setBestScore(data.best_score);
        } else if (typeof data === 'number') {
          setBestScore(data);
        }
      });
  }, []);

  const moveToOneDirection = direction => {
    let newGrid = grid.map(row => [...row]);
    let newScore = score;
    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        let [newRow, lineScore] = move_and_merge(newGrid[i]);
        newGrid[i] = newRow;
        newScore += lineScore;
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        let [newRow, lineScore] = move_and_merge(newGrid[i].slice().reverse());
        newGrid[i] = newRow.reverse();
        newScore += lineScore;
      }
    } else if (direction === 'up') {
      for (let col = 0; col < 4; col++) {
        let column = [];
        for (let row = 0; row < 4; row++) column.push(newGrid[row][col]);
        let [newCol, lineScore] = move_and_merge(column);
        newScore += lineScore;
        for (let row = 0; row < 4; row++) newGrid[row][col] = newCol[row];
      }
    } else if (direction === 'down') {
      for (let col = 0; col < 4; col++) {
        let column = [];
        for (let row = 0; row < 4; row++) column.push(newGrid[row][col]);
        let [newCol, lineScore] = move_and_merge(column.reverse());
        newCol = newCol.reverse();
        newScore += lineScore;
        for (let row = 0; row < 4; row++) newGrid[row][col] = newCol[row];
      }
    }
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      newGrid = addBlock(newGrid);
      setGrid(newGrid);
      setScore(newScore);
      if (noMoveLeft(newGrid)) {
        showGameOver();
        postGame(JSON.stringify(newGrid), newScore);
      }
    }
  };

  const reset = () => {
    removeGameOver();
    removeMenu();
    let g = initialGrid();
    g = addBlock(g);
    g = addBlock(g);
    setGrid(g);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'ArrowLeft') moveToOneDirection('left');
      if (e.key === 'ArrowRight') moveToOneDirection('right');
      if (e.key === 'ArrowUp') moveToOneDirection('up');
      if (e.key === 'ArrowDown') moveToOneDirection('down');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div>
      <div id="gameover" className="gameover hidden">
        <h1>Game Over!</h1>
        <div className="score">
          <h1 id="score_title">score</h1>
          <p id="score_gameover">{score}</p>
        </div>
        <button className="tryagain" onClick={() => reset()}>
          <h1>TRY AGAIN</h1>
        </button>
      </div>
      <div id="menu" className="menu hidden">
        <h1>Menu</h1>
        <button className='button_menu' onClick={() => removeMenu()}>
          <h1>KEEP GOING</h1>
        </button>
        <button className='button_menu' onClick={() => reset()}>
          <h1>NEW GAME</h1>
        </button>
        <button className='button_menu' onClick={() => showHightScores()}>
          <h1>HIGH SCORES</h1>
        </button>
      </div>
      <div id="hight_scores" className="hight_scores hidden">
        <GamesTable/>
      </div>
      <header>
        <div className="logo">2048</div>
        <div className='main_info'>
          <div className='main_score'>
            <div className="score">
              <h1>score</h1>
              <p id="score_header">{score}</p>
            </div>
            <div className="score">
              <h1>best</h1>
              <p id="best_score">{bestScore}</p>
            </div>
          </div>
          <button className='menu_button' onClick={() => showMenu()}>
            menu
          </button>
        </div>
      </header>
      <main>
        <div className='table'>
          {grid.flat().map((val, idx) => (
            <div key={idx}
              style={{
                backgroundColor: tileColors[val],
                color: val === 2 || val === 4 ? '#8F7A67': '#fbf8ef',
              }}>
              {val === 0 ? '' : val}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Grille2048;
