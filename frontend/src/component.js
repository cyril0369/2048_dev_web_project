import React, { useEffect, useState } from 'react';
import { removeHightScores } from './utils';

import { tileColors } from './colors';

function GamesTable() {
  const [games, setGames] = useState([]);
  const [sortBy, setSortBy] = useState('score');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/games/?sort_by=${sortBy}&order=${order}`)
      .then(res => res.json())
      .then(data => setGames(data));
  }, [sortBy, order]);

  return (
    <div>
      <button className='close' onClick={() => removeHightScores()}>close</button>
      <h1>Hight Scores</h1>
      <div className='scroll'>
          <div>
          {games.map((game, idx) => {
            let grilleArray;
            try {
              grilleArray = JSON.parse(game.grille);
            } catch {
              grilleArray = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
            }
            return (
              <div key={idx} className="history-card">
                <div className="history-score">
                  <h1>Score : </h1>
                  <p>{game.score}</p>
                </div>
                <div className="table">
                  {grilleArray.flat().map((val, idx) => (
                    <div key={idx}
                      style={{
                        backgroundColor: tileColors[val],
                        color: val === 2 || val === 4 ? '#8F7A67': '#fbf8ef',
                      }}>
                      {val === 0 ? '' : val}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



export { GamesTable };