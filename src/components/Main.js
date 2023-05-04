import BaseComponent from './BaseComponent';
import { state } from '../services/AppState';
import Tile from './Tile';

class Main extends BaseComponent {
  constructor() {
    super('main');
    this.puzzleWrapper = new BaseComponent('.puzzle-wrapper');
    this.append(this.puzzleWrapper);
    this.render();
  }

  render() {
    this.tiles = [];
    for (let i = 0; i < state.puzzleLength; i += 1) {
      const tile = new Tile(i, i);
      tile.onclick(() => this.tileClick(i));

      // Drag & Drop
      if (i === 0) {
        tile.addEventListener('dragenter', () => tile.classList.add('dragover'));
        tile.addEventListener('dragover', (event) => event.preventDefault());
        tile.addEventListener('dragleave', () => tile.classList.remove('dragover'));
        tile.addEventListener('drop', (event) => {
          event.preventDefault();
          tile.classList.remove('dragover');
          const index = parseInt(event.dataTransfer.getData('text'), 10);
          const targetTile = this.tiles[index];
          targetTile.classList.add('notransition');
          this.changeTiles(index);
          setTimeout(() => targetTile.classList.remove('notransition'), 0);
        });
      } else {
        tile.addEventListener('dragstart', (event) => {
          event.dataTransfer.setData('text/plain', i);
        });
        tile.addEventListener('drag', () => tile.classList.add('dragged'));
        tile.addEventListener('dragend', () => tile.classList.remove('dragged'));
      }
      this.tiles.push(tile);
    }
    this.puzzleWrapper.replace(...this.tiles);
    setTimeout(() => this.checkTileStatus(), 0);
  }

  checkTileStatus(checkActive = true) {
    state.tileOrder.forEach((order, index) => {
      const tile = this.tiles[order];
      const active = checkActive && state.checkTileActive(index);
      tile.element.draggable = active;
      tile.classList.toggle('active', active);
      tile.order = index;
    });
  }

  changeTiles(index) {
    state.changeTiles(index);
    this.checkTileStatus();
    if (this._onmove) this._onmove();
  }

  tileClick(index) {
    if (this.tiles[index].classList.contains('active')) {
      this.changeTiles(index);
    }
  }

  onmove(callback) {
    this._onmove = callback;
  }
}

const main = new Main();

export default main;
