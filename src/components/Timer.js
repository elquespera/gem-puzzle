import BaseComponent from './BaseComponent';
import { state, continueGame, pauseGame } from '../services/AppState';
import formatElapsed from '../services/Time';

class Timer extends BaseComponent {
  constructor() {
    super('span.timer.info-value');
    this.onclick(() => {
      if (state.isSolving) return;
      if (state.isPaused) {
        continueGame();
      } else pauseGame();
      this.render();
    });
    setInterval(() => this.tick(), 1000);
    this.render();
  }

  tick() {
    if (state.isPaused) return;
    state.elapsed += 1;
    this.render();
  }

  render() {
    this.text = formatElapsed(state.elapsed);
    this.element.title = state.isPaused ? 'Click here to continue game' : 'Click here to pause game';
  }

  set disabled(disabled) {
    this.classList.toggle('disabled', disabled);
  }
}

export default Timer;
