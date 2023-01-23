import {clearScreen, drawSomeText, isDebug} from './utils';

export class Intro {
  private gameStartCallback: () => void;

  constructor(gameStartCallback: () => void) {
    this.gameStartCallback = gameStartCallback;

    drawSomeText('Goblin Mode', undefined, undefined, {textAlign: 'center', color: 'orange'});
    if (isDebug()) {
      this.startGame();
    } else {
      globalThis.gameElement.ontouchstart = this.startGame.bind(this);
    }
  }

  async startGame(): Promise<void> {
    clearScreen();
    if (!isDebug()) {
      await document.querySelector('body')?.requestFullscreen();
    }
    this.gameStartCallback();
  }
}
