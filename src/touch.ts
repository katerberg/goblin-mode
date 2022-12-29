import {Position} from './definitions/position';

export function getPosition(event: TouchEvent | MouseEvent): Position {
  const position = globalThis.display.eventToPosition(event);
  return {x: position[0], y: position[1]};
}
