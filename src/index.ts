import './index.scss';
import * as ROT from 'rot-js';
import {Game} from './game';

const width = 20;
const height = 20;

globalThis.display = new ROT.Display({width, height, fg: '#000', spacing: 2});

window.addEventListener('load', () => {
  const container = display.getContainer();
  if (container) {
    document.body.appendChild(container);
  }

  new Game(width, height);
});
