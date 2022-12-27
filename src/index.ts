import './index.scss';
import * as ROT from 'rot-js';
import {Game} from './game';

const width = 20;
const height = 20;

globalThis.display = new ROT.Display({width, height, fg: '#000', spacing: 2});

window.addEventListener('load', () => {
  const container = display.getContainer();
  if (container) {
    const gameElement = document.getElementById('game');
    if (gameElement) {
      gameElement.appendChild(container);
      gameElement.onwheel = (event): void => {
        event.preventDefault();
      };
    }
  }

  new Game(width, height);
});
