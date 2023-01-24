import {clearCanvas, drawSomeText, isDebug} from './utils';

export class Intro {
  private gameStartCallback: () => Promise<boolean>;

  constructor(gameStartCallback: () => Promise<boolean>) {
    this.gameStartCallback = gameStartCallback;

    if (isDebug()) {
      this.startGame();
    } else {
      this.init();
    }
  }

  init(): void {
    const levelView = document.getElementById('level-title');
    if (levelView) {
      levelView.classList.remove('open');
    }
    clearCanvas();
    drawSomeText('Goblin Mode', undefined, undefined, {textAlign: 'center', color: 'orange'});
    globalThis.gameElement.ontouchstart = this.startGame.bind(this);
  }

  async startGame(): Promise<void> {
    console.log('starting game');
    const levelView = document.getElementById('level-title');
    if (levelView) {
      levelView.classList.add('open');
    }

    clearCanvas();
    if (!isDebug()) {
      await document.querySelector('body')?.requestFullscreen();
    }
    const result = await this.gameStartCallback();
    console.log('Win result of ', result);
    this.init();
  }
}
