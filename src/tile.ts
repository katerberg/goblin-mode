export class Tile {
  public x;

  public y;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const colors = ['#fff', '#dfdfdf', '#ccc'];
    const gradiant = (x % 2) + ((y % 2) % 2);
    globalThis.display.draw(x, y, `${x},${y}`, null, colors[gradiant]);
  }
}
