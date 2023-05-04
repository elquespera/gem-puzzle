import { isGameSaved } from '../services/Storage';
import BaseComponent from './BaseComponent';
import Button from './Button';
import Moves from './Moves';
import Timer from './Timer';

class Header extends BaseComponent {
  constructor() {
    super('header');
    this.shuffleButton = new Button('Shuffle', { primary: true, icon: 'shuffle' });
    this.scoresButton = new Button('Scores', { icon: 'score' });
    this.saveButton = new Button('Save game', { icon: 'save' });
    this.restoreButton = new Button('Restore', { icon: 'restore' });
    this.solveButton = new Button('Solve', { icon: 'solve' });
    this.restoreButton.element.disabled = !isGameSaved();
    this.buttonsWrapper = new BaseComponent('.buttons-wrapper');
    this.buttonsWrapper.append(
      this.shuffleButton,
      this.scoresButton,
      this.saveButton,
      this.restoreButton,
      this.solveButton,
    );

    this.moves = new Moves();
    this.timer = new Timer();
    this.infoWrapper = new BaseComponent('.info-wrapper');
    this.infoWrapper.append(this.moves, this.timer);
    this.append(this.buttonsWrapper, this.infoWrapper);
  }
}

const header = new Header();

export default header;
