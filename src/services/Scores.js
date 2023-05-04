import BaseComponent from '../components/BaseComponent';
import OptionGroup from '../components/OptionGroup';
import Dialog from '../components/Dialog';
import {
  state, pauseGame, continueGame, scoreFields,
  difficulties, puzzleSizes,
} from './AppState';
import formatElapsed from './Time';

const MAX_SCORES = 10;

const generateScores = (body, puzzleSize, difficulty) => {
  const scores = state.scores
    .filter((score) => (puzzleSize === 'all' || score.puzzleSize === puzzleSize) && (difficulty === 'all' || score.difficulty === difficulty))
    .sort((a, b) => a.elapsed - b.elapsed)
    .slice(0, MAX_SCORES);

  body.replace(...scores.map((score, index) => {
    const cells = [
      index + 1,
      new Date(score.timeStamp).toLocaleDateString(),
      formatElapsed(score.elapsed),
      score.moves,
      Object.keys(difficulties).find((key) => difficulties[key] === score.difficulty),
      `${score.puzzleSize}x${score.puzzleSize}`,
    ].map((value) => {
      const component = new BaseComponent('td');
      component.text = value;
      return component;
    });

    const row = new BaseComponent('tr');
    row.append(...cells);
    return row;
  }));
};

const Scores = () => {
  const { isPaused } = state;
  pauseGame();
  const scores = new BaseComponent('table.score-table');
  const thead = new BaseComponent('tr');
  const number = new BaseComponent('th');
  number.text = '#';
  thead.append(number);

  Object.keys(scoreFields).forEach((key) => {
    const component = new BaseComponent('th');
    component.text = scoreFields[key].title;
    thead.append(component);
  });

  const tbody = new BaseComponent('tbody');
  scores.append(thead, tbody);

  let currentPuzzleSize = state.puzzleSize;
  let currentDifficulty = state.difficulty;

  const puzzleSizeOptions = new OptionGroup(
    ['all', ...puzzleSizes.map((size) => `${size}x${size}`)],
    (size) => {
      currentPuzzleSize = parseInt(size, 10) || 'all';
      generateScores(tbody, currentPuzzleSize, currentDifficulty);
    },
  );
  puzzleSizeOptions.checked = `${state.puzzleSize}x${state.puzzleSize}`;

  const difficultyOptions = new OptionGroup(
    ['all', ...Object.keys(difficulties)],
    (difficulty) => {
      currentDifficulty = difficulties[difficulty] || 'all';
      generateScores(tbody, currentPuzzleSize, currentDifficulty);
    },
  );
  difficultyOptions.checked = Object.keys(difficulties)
    .find((diff) => difficulties[diff] === currentDifficulty);

  const dialogBody = new BaseComponent('.score-wrapper');
  dialogBody.append(puzzleSizeOptions, difficultyOptions, scores);

  new Dialog(
    'Top scores',
    dialogBody,
    [
      { title: 'Close', focus: true, primary: true },
      {
        title: 'Clear history',
        preventClose: true,
        onclick: () => {
          tbody.element.remove();
          state.clearScores();
        },
      },
    ],
  ).show(() => { if (!isPaused) continueGame(); });
};

export default Scores;
