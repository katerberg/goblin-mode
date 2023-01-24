import {clearCanvas, drawSomeText, isDebug} from './utils';

export class SceneManager {
  private gameStartCallback: () => Promise<boolean>;

  constructor(gameStartCallback: () => Promise<boolean>) {
    this.gameStartCallback = gameStartCallback;

    if (isDebug()) {
      this.startGame();
    } else {
      this.init();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private hideGameElements(): void {
    const levelView = document.getElementById('level-title');
    if (levelView) {
      levelView.classList.remove('open');
    }
    clearCanvas();
  }

  init(): void {
    this.hideGameElements();
    drawSomeText('Goblin Mode', undefined, undefined, {textAlign: 'center', color: 'orange'});
    globalThis.gameElement.ontouchstart = this.startGame.bind(this);
  }

  async showEndScreen(result: boolean): Promise<void> {
    this.hideGameElements();
    const text = result ? 'The goblins survived!' : 'All your gobbos died.';
    drawSomeText(text, undefined, undefined, {textAlign: 'center', color: 'orange'});

    const promise = new Promise((promiseResolve) => {
      globalThis.gameElement.ontouchstart = (): void => promiseResolve();
    }) as Promise<void>;
    return promise;
  }

  async startGame(): Promise<void> {
    const levelView = document.getElementById('level-title');
    if (levelView) {
      levelView.classList.add('open');
    }

    clearCanvas();
    if (!isDebug()) {
      await document.querySelector('body')?.requestFullscreen();
    }
    const result = await this.gameStartCallback();
    await this.showEndScreen(result);

    this.init();
  }
}
