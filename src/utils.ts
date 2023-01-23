export function filterInPlace<Type>(array: Array<Type>, fn: (arg0: Type) => boolean): void {
  let from = 0,
    to = 0;
  while (from < array.length) {
    if (fn(array[from])) {
      array[to] = array[from];
      to++;
    }
    from++;
  }
  array.length = to;
}

export function isDebug(): boolean {
  const url = new URL(window.location.href);
  const debug = url.searchParams.get('debug');
  return debug !== null;
}

export function clearScreen(): void {
  const ctx = (globalThis.display.getContainer() as HTMLCanvasElement)?.getContext('2d');
  if (ctx) {
    globalThis.display.clear();
  }
}

export function drawSomeText(
  text: string,
  x: number | undefined,
  y: number | undefined,
  font: string | undefined,
  textAlign?: CanvasTextAlign,
): void {
  const ctx = (globalThis.display.getContainer() as HTMLCanvasElement)?.getContext('2d');
  if (ctx) {
    const prevAlign = ctx.textAlign;
    const prevFill = ctx.fillStyle;
    const prevFont = ctx.font;
    ctx.textAlign = textAlign || 'left';
    ctx.fillStyle = 'orange';
    ctx.font = font || '50px serif';

    ctx.fillText(text, x || ctx.canvas.width / 2, y || ctx.canvas.height / 2);

    ctx.textAlign = prevAlign;
    ctx.fillStyle = prevFill;
    ctx.font = prevFont;
  }
}

export function waitFor(ms: number): Promise<void> {
  let resolve: () => void;
  const promise = new Promise((promiseResolve) => {
    resolve = promiseResolve as () => void;
  }) as Promise<void>;
  setTimeout(() => resolve(), ms);
  return promise;
}

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function getGoblinName(): string {
  globalThis.goblinNames = shuffle(globalThis.goblinNames);
  return globalThis.goblinNames.pop() || '';
}

export function getRandomGreen(): string {
  return `rgb(0, ${Math.random() * 130 + 80}, 0)`;
}

export function getRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
