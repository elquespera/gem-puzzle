import { state, continueGame, pauseGame } from './AppState';
import { playAudio, SOUNDS } from './Audio';
import { isGameSaved } from './Storage';
import Dialog from '../components/Dialog';
import Scores from './Scores';

const Puzzle = (header, main, settings) => {
  const {
    moves, timer, shuffleButton, saveButton,
    restoreButton, scoresButton, solveButton,
  } = header;

  const checkButtons = () => {
    saveButton.element.disabled = state.isSolving;
    restoreButton.element.disabled = state.isSolving || !isGameSaved();
    scoresButton.element.disabled = state.isSolving;
    solveButton.element.disabled = false;
    solveButton.text = state.isSolving ? 'Stop' : 'Solve';
    timer.disabled = state.isSolving;
  };

  const render = () => {
    moves.render();
    timer.render();
    main.render();
    checkButtons();
    continueGame();
  };

  const reset = (options) => {
    if (options && options.puzzleSize) state.puzzleSize = options.puzzleSize;
    if (options && options.difficulty) state.difficulty = options.difficulty;
    state.isSolving = false;
    state.shuffleTiles();
    state.moves = 0;
    state.elapsed = 0;
    render();
  };

  const move = () => {
    state.moves += 1;
    moves.render();
    if (state.isSolving) return;

    playAudio(SOUNDS.move, state.isAudio);
    if (state.isWinningOrder()) {
      pauseGame();
      state.addCurrentToScores();
      playAudio(SOUNDS.win, state.isAudio);
      new Dialog('You won!', `<p>Hooray! You solved the puzzle in <b>${timer.text}</b> and <b>${state.moves} moves</b>!</p>`, 'Start new game').show(() => {
        reset();
      });
    }
  };

  const save = () => {
    state.saveGame();
    restoreButton.element.disabled = false;
  };

  const restore = () => {
    state.restoreGame();
    render();
    settings.checkSwitches();
  };

  const solve = () => {
    const sequence = state.moveHistory.sequence.reverse();
    let index = 0;

    if (state.isSolving) {
      reset();
      checkButtons();
      return;
    }

    const moveTile = () => {
      if (!state.isSolving) return;
      if (index < sequence.length) {
        setTimeout(() => moveTile(), 500);
        main.changeTiles(sequence[index]);
        index += 1;
      } else {
        state.isSolving = false;
        state.isPaused = true;
        solveButton.element.disabled = true;
      }
    };

    state.tileOrder = [...state.moveHistory.final];
    state.elapsed = 0;
    state.moves = 0;
    moves.render();
    timer.render();
    state.isSolving = true;
    checkButtons();
    main.checkTileStatus(false);
    moveTile();
  };

  main.onmove(() => move());
  shuffleButton.onclick(() => reset());
  settings.onSizeChange((puzzleSize) => reset({ puzzleSize }));
  settings.onDifficultyChange((difficulty) => reset({ difficulty }));
  saveButton.onclick(() => save());
  restoreButton.onclick(() => restore());
  scoresButton.onclick(() => Scores());
  solveButton.onclick(() => solve());
  if (!isGameSaved()) reset();
};

export default Puzzle;
