export function filterInPlace<Type>(array: Array<Type>, fn: (arg0: Type, i: number) => boolean): void {
  let from = 0,
    to = 0;
  while (from < array.length) {
    if (fn(array[from], from)) {
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

export function clearRotScreen(): void {
  const ctx = (globalThis.display.getContainer() as HTMLCanvasElement)?.getContext('2d');
  if (ctx) {
    globalThis.display.clear();
  }
}

export function clearCanvas(): void {
  const ctx = (globalThis.display.getContainer() as HTMLCanvasElement)?.getContext('2d');
  if (ctx) {
    const prevFill = ctx.fillStyle;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevFill;
  }
}

type DrawOptions = {
  color?: string;
  font?: string;
  textAlign?: CanvasTextAlign;
};

export function drawSomeText(text: string, x?: number, y?: number, options?: DrawOptions): void {
  const ctx = (globalThis.display.getContainer() as HTMLCanvasElement)?.getContext('2d');
  if (ctx) {
    const prevAlign = ctx.textAlign;
    const prevFill = ctx.fillStyle;
    const prevFont = ctx.font;
    ctx.textAlign = options?.textAlign || 'left';
    ctx.fillStyle = options?.color || 'white';
    ctx.font = options?.font || '50px serif';

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
