import {Demon} from './actors/demon';
import {Position} from './definitions/position';

export function isWithin(position1: Position, position2: Position, distance: number): boolean {
  return Math.abs(position1.x - position2.x) < distance + 1 && Math.abs(position1.y - position2.y) < distance + 1;
}

export function getPositionFromCoords(coordinates: `${number},${number}`): Position {
  const [x, y] = coordinates.split(',');
  return {x: Number.parseInt(x, 10), y: Number.parseInt(y, 10)};
}

export function isInFire(y: number, demon: Demon): boolean {
  return y >= globalThis.height - demon.burningSpaces;
}
