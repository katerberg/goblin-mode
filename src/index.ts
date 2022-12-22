import './index.scss';
import * as ROT from 'rot-js';
import {Game} from './game';

const width = 60;
const height = 60;

globalThis.display = new ROT.Display({width, height, layout: 'hex', fg: '#000', spacing: 4});

window.addEventListener('load', () => {
  const container = display.getContainer();
  if (container) {
    document.body.appendChild(container);
  }

  new Game(width, height);
});
