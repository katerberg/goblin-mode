export class Tile {
  public x: number;

  public y: number;

  public isPassable: boolean;

  public backgroundColor: string;

  constructor(x: number, y: number, isPassable: boolean) {
    this.x = x;
    this.y = y;
    this.isPassable = isPassable;
    this.backgroundColor = isPassable ? '#dfdfdf' : '#ccc';
    this.draw();
  }

  setBackgroundColor(color: string): void {
    this.backgroundColor = color;
  }

  draw(): void {
    globalThis.display.draw(this.x, this.y, '', null, this.backgroundColor);
  }
}
