export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function move_and_merge(line) {
  let newLine = line.filter((val) => val !== 0);
  let line_score = 0;
  for (let i = 0; i < newLine.length - 1; i++) {
    if (newLine[i] === newLine[i + 1]) {
      newLine[i] *= 2;
      newLine[i + 1] = 0;
      line_score += newLine[i];
    }
  }
  newLine = newLine.filter((val) => val !== 0);
  while (newLine.length < 4) {
    newLine.push(0);
  }
  return [newLine, line_score];
}

export function showGameOver() {
  document.getElementById('gameover').classList.remove('hidden');
}

export function removeGameOver() {
  document.getElementById('gameover').classList.add('hidden');
}

export function showMenu() {
  document.getElementById('menu').classList.remove('hidden');
}

export function removeMenu() {
  document.getElementById('menu').classList.add('hidden');
}

export function showHightScores() {
  document.getElementById('hight_scores').classList.remove('hidden');
}

export function removeHightScores() {
  document.getElementById('hight_scores').classList.add('hidden');
}