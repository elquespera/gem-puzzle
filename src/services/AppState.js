import {
  loadFromStorage, saveToStorage,
  GAME_KEY, OPTIONS_KEY, SCORES_KEY, HISTORY_KEY,
} from './Storage';

const puzzleSizes = [3, 4, 5, 6, 7, 8];

const difficulties = {
  easy: 0.5,
  medium: 2,
  advanced: 5,
  hard: 20,
};

const scoreFields = {
  timeStamp: { title: 'Date' },
  elapsed: { title: 'Finished in' },
  moves: { title: '# Moves' },
  difficulty: { title: 'Difficulty' },
  puzzleSize: { title: 'Puzzle Size' },
};

class AppState {
  constructor() {
    this._puzzleSize = 4;
    this.root = document.body;
    this.isPaused = false;
    this.isAudio = true;
    this.isDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.moves = 0;
    this.elapsed = 0;
    this.difficulty = difficulties.advanced;
    this.scores = [];
    this.moveHistory = {};
    this.loadOptions();
    this.loadScores();
    this.shuffleTiles();
  }

  get puzzleSize() {
    return this._puzzleSize;
  }

  set puzzleSize(size) {
    this._puzzleSize = size;
    this._tileOrder = null;
    this.setCSSVariable('puzzle-size', size);
  }

  get puzzleLength() {
    return this.puzzleSize ** 2;
  }

  get tileOrder() {
    if (!this._tileOrder) this.initTiles();
    return this._tileOrder;
  }

  set tileOrder(order) {
    this._tileOrder = order;
  }

  calculateTileOder() {
    const order = Array
      .from({ length: this.puzzleLength - 1 })
      .fill()
      .map((_, index) => index + 1);
    order.push(0);
    return order;
  }

  isWinningOrder() {
    return this._tileOrder.join('') === this.calculateTileOder().join('');
  }

  initTiles() {
    this._tileOrder = this.calculateTileOder();
  }

  shuffleTiles() {
    this.initTiles();
    const steps = Math.floor(this.puzzleLength * this.difficulty) + Math.round(Math.random());
    this.moveHistory = { sequence: [] };
    let previousNeighbor;
    for (let i = 0; i < steps; i += 1) {
      const zeroIndex = this.tileOrder.indexOf(0);
      const neightbors = this.getTileNeighbors(zeroIndex);
      let randomNeighbor;
      let randomNeighborIndex;
      do {
        randomNeighborIndex = neightbors[Math.floor(Math.random() * neightbors.length)];
        randomNeighbor = this.tileOrder[randomNeighborIndex];
      } while (randomNeighbor === previousNeighbor);
      this.moveHistory.sequence.push(randomNeighbor);
      this.changeTiles(this.tileOrder[randomNeighborIndex]);
      previousNeighbor = randomNeighbor;
    }
    this.moveHistory.final = [...this.tileOrder];
    if (this.isWinningOrder()) {
      this.shuffleTiles();
    }
  }

  getTileNeighbors(index) {
    const column = (ind) => Math.floor(ind / this.puzzleSize);
    const neightbors = [];
    if (index - this.puzzleSize >= 0) neightbors.push(index - this.puzzleSize);
    if (index + this.puzzleSize < this.puzzleLength) neightbors.push(index + this.puzzleSize);
    if (column(index + 1) === column(index)) neightbors.push(index + 1);
    if (column(index - 1) === column(index)) neightbors.push(index - 1);
    return neightbors;
  }

  checkTileActive(index) {
    if (index < 0) return false;
    return this.getTileNeighbors(index)
      .some((neightbor) => this.tileOrder[neightbor] === 0);
  }

  changeTiles(order) {
    const zeroIndex = this.tileOrder.indexOf(0);
    const tileIndex = this.tileOrder.indexOf(order);
    this.tileOrder[zeroIndex] = order;
    this.tileOrder[tileIndex] = 0;
  }

  getCSSVariable(variable) {
    return getComputedStyle(this.root).getPropertyValue(`--${variable}`).trim();
  }

  setCSSVariable(variable, value) {
    this.root.style.setProperty(`--${variable}`, value);
  }

  saveGame() {
    const game = {
      puzzleSize: this.puzzleSize,
      difficulty: this.difficulty,
      tileOrder: this.tileOrder,
      moves: this.moves,
      elapsed: this.elapsed,
    };
    saveToStorage(GAME_KEY, game);
    saveToStorage(HISTORY_KEY, this.moveHistory);
  }

  restoreGame() {
    const game = loadFromStorage(GAME_KEY);
    const history = loadFromStorage(HISTORY_KEY);
    if (!game || !history) return;
    this.moveHistory = history;
    this.puzzleSize = game.puzzleSize;
    this.difficulty = game.difficulty;
    this.moves = game.moves;
    this.elapsed = game.elapsed;
    this._tileOrder = game.tileOrder;
  }

  saveOptions() {
    const options = {
      isAudio: this.isAudio,
      isDarkTheme: this.isDarkTheme,
    };
    saveToStorage(OPTIONS_KEY, options);
  }

  loadOptions() {
    const options = loadFromStorage(OPTIONS_KEY);
    if (!options) return;
    this.isAudio = options.isAudio;
    this.isDarkTheme = options.isDarkTheme;
  }

  saveScores() {
    saveToStorage(SCORES_KEY, this.scores);
  }

  loadScores() {
    const scores = loadFromStorage(SCORES_KEY);
    if (!scores) return;
    this.scores = scores;
  }

  clearScores() {
    this.scores = [];
    window.localStorage.removeItem(SCORES_KEY);
  }

  addCurrentToScores() {
    this.scores.push({
      timeStamp: Date.now(),
      elapsed: this.elapsed,
      moves: this.moves,
      difficulty: this.difficulty,
      puzzleSize: this.puzzleSize,
    });

    this.saveScores();
  }
}

const state = new AppState();

function continueGame() {
  state.isPaused = false;
  document.body.classList.remove('paused');
}

function pauseGame() {
  document.body.classList.add('paused');
  state.isPaused = true;
}

export {
  state, puzzleSizes, difficulties, scoreFields,
  continueGame, pauseGame,
};
