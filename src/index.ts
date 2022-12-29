import './index.scss';
import * as ROT from 'rot-js';
import {Game} from './game';

const boardWidth = 40;
const boardHeight = 40;

globalThis.width = boardWidth;
globalThis.height = boardHeight + 4;

globalThis.display = new ROT.Display({width: globalThis.width, height: globalThis.height, fg: '#000', spacing: 2});

window.addEventListener('load', () => {
  const container = globalThis.display.getContainer() as HTMLCanvasElement;
  if (container) {
    const gameElement = document.getElementById('game');
    if (gameElement) {
      globalThis.gameElement = gameElement;
      gameElement.appendChild(container);
      gameElement.onwheel = (event): void => {
        event.preventDefault();
      };
    }
  }

  new Game(boardWidth, boardHeight);
});
