import './index.scss';
import * as ROT from 'rot-js';

window.addEventListener('load', () => {
  const width = 60;
  const height = 60;
  const display = new ROT.Display({width, height, layout: 'hex', fg: '#000', spacing: 4});
  const container = display.getContainer();
  if (container) {
    document.body.appendChild(container);
  }

  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      const coordinates = `${Math.floor(w / 2) - Math.floor(h / 2)},${h}`;
      const color = 'rgba(255, 255, 255, 1)';
      // x position is divided by two to get display position
      // y position is accurate
      if (h % 2 && w % 2) {
        display.draw(w, h, coordinates, null, color);
      }
      if (h % 2 === 0 && w % 2 === 0) {
        display.draw(w, h, coordinates, null, color);
      }
    }
  }
});
