import {clearCanvas, drawSomeText, isDebug, wrapText} from './utils';

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
    const characterButton = document.getElementById('character-list-button');
    if (characterButton) {
      characterButton.classList.remove('visible');
    }
    clearCanvas();
  }

  // eslint-disable-next-line class-methods-use-this
  private showGameElements(): void {
    const levelView = document.getElementById('level-title');
    if (levelView) {
      levelView.classList.add('open');
    }
    const characterButton = document.getElementById('character-list-button');
    if (characterButton) {
      characterButton.classList.add('visible');
    }
    clearCanvas();
  }

  init(): void {
    this.hideGameElements();
    setTimeout(() => {
      drawSomeText('Goblin Mode', undefined, undefined, {textAlign: 'center', color: 'orange'});
      const ctx = (globalThis.display.getContainer() as HTMLCanvasElement)?.getContext('2d');
      if (ctx) {
        const description =
          'Dwarves have delved too deep into your most recent home. Now you must lead your goblins out of the mine, leveling them up as they sneak past the multitudes of annoying humans before the monster behind you arrives to claim your hovel.';
        wrapText(ctx, description, 20, ctx.canvas.height / 2 + 50, ctx.canvas.width - 100, 40).forEach(
          ([text, x, y]) => {
            drawSomeText(text, x, y, {
              textAlign: 'left',
              color: 'white',
              font: '24px serif',
            });
          },
        );
      }
    }, 1);
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
    this.showGameElements();
    if (!isDebug()) {
      if (document.querySelector('body')?.requestFullscreen) {
        await document.querySelector('body')?.requestFullscreen();
      }
    }
    const result = await this.gameStartCallback();
    await this.showEndScreen(result);
    this.init();
  }
}
