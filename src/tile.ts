export class Tile {
  public x;

  public y;

  private backgroundColor;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.backgroundColor = ['#fff', '#dfdfdf', '#ccc'][(x % 2) + ((y % 2) % 2)];
    this.draw();
  }

  setBackgroundColor(color: string): void {
    this.backgroundColor = color;
    this.draw();
  }

  draw(): void {
    globalThis.display.draw(this.x, this.y, `${this.x},${this.y}`, null, this.backgroundColor);
  }
}
