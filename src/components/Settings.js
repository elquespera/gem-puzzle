import BaseComponent from './BaseComponent';
import Button from './Button';
import OptionGroup from './OptionGroup';
import { state, puzzleSizes, difficulties } from '../services/AppState';

class Settings extends BaseComponent {
  constructor() {
    super('.settings');

    this.puzzleSizeTitle = new BaseComponent('h3');
    this.puzzleSizeTitle.text = 'Puzzle Size';
    this.puzzleSizeOptions = new OptionGroup(
      puzzleSizes.map((size) => `${size}x${size}`),
      (size) => this.sizeChange(parseInt(size, 10)),
    );

    this.difficultyTitle = new BaseComponent('h3');
    this.difficultyTitle.text = 'Difficulty';
    this.difficultyOptions = new OptionGroup(
      Object.keys(difficulties).map((difficulty) => difficulty),
      (difficulty) => this.difficultyChange(difficulty),
    );

    this.audioButton = new Button('Audio', { checkbox: true });
    this.audioButton.onclick(() => this.audioClick(!state.isAudio));
    this.themeButton = new Button('Dark theme', { checkbox: true });
    this.themeButton.onclick(() => this.themeClick(!state.isDarkTheme));

    this.themeAndAudioWrapper = new BaseComponent('.theme-and-audio-wrapper');
    this.themeAndAudioWrapper.append(this.audioButton, this.themeButton);
    this.themeAndAudioTitle = new BaseComponent('h3');
    this.themeAndAudioTitle.text = 'Audio and Theme';

    this.meta = document.createElement('meta');
    this.meta.name = 'theme-color';
    document.head.append(this.meta);
    this.themeClick(state.isDarkTheme);

    this.append(
      this.puzzleSizeTitle,
      this.puzzleSizeOptions,
      this.difficultyTitle,
      this.difficultyOptions,
      this.themeAndAudioTitle,
      this.themeAndAudioWrapper,
    );
  }

  checkSwitches() {
    this.puzzleSizeOptions.checked = `${state.puzzleSize}x${state.puzzleSize}`;
    this.difficultyOptions.checked = Object.keys(difficulties)
      .find((diff) => state.difficulty === difficulties[diff]);
    this.audioButton.checked = state.isAudio;
    this.themeButton.checked = state.isDarkTheme;
  }

  onSizeChange(callback) {
    this._onSizeChange = callback;
  }

  sizeChange(size) {
    if (this._onSizeChange) this._onSizeChange(size);
  }

  onDifficultyChange(callback) {
    this._onDifficultyChange = callback;
  }

  difficultyChange(difficulty) {
    if (this._onDifficultyChange) this._onDifficultyChange(difficulties[difficulty]);
  }

  audioClick(isAudio) {
    state.isAudio = isAudio;
    state.saveOptions();
    this.checkSwitches();
  }

  themeClick(isDarkTheme) {
    state.isDarkTheme = isDarkTheme;
    state.saveOptions();
    document.body.classList.toggle('dark-theme', isDarkTheme);
    this.meta.content = state.getCSSVariable('bg-color');
    this.checkSwitches();
  }
}

const settings = new Settings();

export default settings;
