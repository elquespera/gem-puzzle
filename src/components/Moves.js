import BaseComponent from './BaseComponent';
import { state } from '../services/AppState';

class Moves extends BaseComponent {
  constructor() {
    super('span.game-moves');
    this.label = new BaseComponent('span.info-label');
    this.label.text = 'moves';
    this.value = new BaseComponent('span.info-value');
    this.append(this.value, this.label);
    this.render();
  }

  render() {
    this.value.text = state.moves;
  }
}

export default Moves;
