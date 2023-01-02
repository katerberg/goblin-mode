import {Position} from './definitions/position';

export function getPosition(event: TouchEvent | MouseEvent): Position {
  const [x, y] = globalThis.display.eventToPosition(event);
  return {x, y};
}
