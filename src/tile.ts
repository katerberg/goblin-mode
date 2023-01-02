import {colors, symbols} from './constants';

export class Tile {
  public x: number;

  public y: number;

  public isPassable: boolean;

  public backgroundColor: string;

  constructor(x: number, y: number, isPassable: boolean) {
    this.x = x;
    this.y = y;
    this.isPassable = isPassable;
    this.backgroundColor = isPassable ? colors.BACKGROUND_NONVISIBLE_PASSABLE : colors.BACKGROUND_NONVISIBLE_IMPASSABLE;
  }

  setBackgroundColor(color: string): void {
    this.backgroundColor = color;
  }

  draw(): void {
    globalThis.display.draw(this.x, this.y, this.isPassable ? symbols.SPACE_OPEN : '', null, this.backgroundColor);
  }
}
