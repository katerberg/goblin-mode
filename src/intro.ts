import {drawSomeText} from './utils';

export class Intro {
  private gameStartCallback: () => void;

  constructor(gameStartCallback: () => void) {
    this.gameStartCallback = gameStartCallback;

    drawSomeText('Goblin Mode', undefined, undefined, undefined, 'center');
    globalThis.gameElement.ontouchstart = this.startGame.bind(this);
  }

  async startGame(): Promise<void> {
    globalThis.display.clear();
    await document.querySelector('body')?.requestFullscreen();
    this.gameStartCallback();
  }
}
