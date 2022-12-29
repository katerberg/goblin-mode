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

export function isNextTo(position1: Position, position2: Position): boolean {
  return Math.abs(position1.x - position2.x) < 2 && Math.abs(position1.y - position2.y) < 2;
}
