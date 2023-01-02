import {Position} from './definitions/position';

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

export function waitFor(ms: number): Promise<void> {
  let resolve: () => void;
  const promise = new Promise((promiseResolve) => {
    resolve = promiseResolve as () => void;
  }) as Promise<void>;
  setTimeout(() => resolve(), ms);
  return promise;
}

export function isWithin(position1: Position, position2: Position, distance: number): boolean {
  return Math.abs(position1.x - position2.x) < distance + 1 && Math.abs(position1.y - position2.y) < distance + 1;
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
