export class Tile {
  public x;

  public y;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const color = 'rgba(255, 255, 255, 1)';
    const coordinates = `${Math.floor(x / 2) - Math.floor(y / 2)},${y}`;
    globalThis.display.draw(x, y, coordinates, null, color);
  }
}
