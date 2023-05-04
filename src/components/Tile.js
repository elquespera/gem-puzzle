import BaseComponent from './BaseComponent';
import { state } from '../services/AppState';

class Tile extends BaseComponent {
  constructor(text, order) {
    super('.puzzle-tile');
    this.tileText = new BaseComponent('span.puzzle-tile-text');
    if (text) {
      this.tileText.text = text;
    } else {
      this.classList.add('zero');
    }
    this.append(this.tileText);
    this.order = order;
  }

  set order(order) {
    if (order === this._order) return;

    const calcShift = (size) => `calc(var(--tile-size) * ${size})`;
    const [shiftX, shiftY] = [
      order % state.puzzleSize,
      Math.floor(order / state.puzzleSize),
    ];
    this.element.style.transform = `translate(${calcShift(shiftX)}, ${calcShift(shiftY)})`;
    this._order = order;
  }

  get order() {
    return this._order;
  }
}

export default Tile;
